"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { examService } from "@/services/exam/exam.service";
import { ExamStatistics } from "@/services/exam/exam.service";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { RefreshCw, Download, FileText } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { jsPDFWithAutoTable } from '@/lib/jspdf-autotable';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ExamStatisticsPage() {
  const [examStats, setExamStats] = useState<ExamStatistics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamStatistics();
  }, []);

  const loadExamStatistics = async () => {
    try {
      setLoading(true);
      const stats = await examService.getExamStatistics();
      setExamStats(stats);
    } catch (error) {
      console.error("Failed to load exam statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const getTopExamsByParticipants = () => {
    return examStats
      .sort((a, b) => b.totalParticipants - a.totalParticipants)
      .slice(0, 10)
      .map(stat => ({
        name: stat.examName || 'Unknown Exam',
        participants: stat.totalParticipants
      }));
  };

  const getTopExamsByAverageScore = () => {
    return examStats
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10)
      .map(stat => ({
        name: stat.examName || 'Unknown Exam',
        averageScore: stat.averageScore
      }));
  };

  const getPassRateData = () => {
    return examStats
      .filter(stat => stat.examName)
      .slice(0, 10)
      .map(stat => ({
        name: stat.examName || 'Unknown Exam',
        passRate: stat.passRate,
        participants: stat.totalParticipants
      }));
  };

  const getScoreDistributionData = () => {
    const data = [
      { name: '0-20%', count: 0 },
      { name: '21-40%', count: 0 },
      { name: '41-60%', count: 0 },
      { name: '61-80%', count: 0 },
      { name: '81-100%', count: 0 }
    ];

    examStats.forEach(stat => {
      if (stat.averageScore <= 20) data[0].count++;
      else if (stat.averageScore <= 40) data[1].count++;
      else if (stat.averageScore <= 60) data[2].count++;
      else if (stat.averageScore <= 80) data[3].count++;
      else data[4].count++;
    });

    return data;
  };

  // Export statistics data to CSV
  const exportToCSV = () => {
    if (!examStats.length) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add exam statistics
    csvContent += "Exam Statistics\\n";
    csvContent += "Exam Name,Participants,Average Score,Pass Rate,Highest Score,Lowest Score\\n";
    examStats.forEach(stat => {
      csvContent += `"${stat.examName || 'Unknown Exam'}",${stat.totalParticipants},${stat.averageScore},${stat.passRate},${stat.highestScore},${stat.lowestScore}\\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exam_statistics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export statistics data to PDF
  const exportToPDF = () => {
    if (!examStats.length) return;
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Add title
    (doc as jsPDF).setFontSize(20);
    (doc as jsPDF).text("Exam Statistics Report", 105, 20, { align: "center" });
    
    // Add date
    (doc as jsPDF).setFontSize(12);
    (doc as jsPDF).text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
    
    // Add exam statistics
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("Exam Statistics", 20, 45);
    
    (doc as jsPDF).setFontSize(12);
    doc.autoTable({
      startY: 50,
      head: [['Exam Name', 'Participants', 'Avg Score', 'Pass Rate', 'Highest', 'Lowest']],
      body: examStats.map(stat => [
        stat.examName || 'Unknown Exam',
        stat.totalParticipants.toString(),
        stat.averageScore.toFixed(1),
        stat.passRate.toFixed(1) + '%',
        stat.highestScore.toFixed(1) + '%',
        stat.lowestScore.toFixed(1) + '%'
      ]),
      theme: 'striped'
    });
    
    // Save the PDF
    (doc as jsPDF).save("exam_statistics.pdf");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading exam statistics...</p>
        </div>
      </div>
    );
  }

  const topExamsByParticipants = getTopExamsByParticipants();
  const topExamsByAverageScore = getTopExamsByAverageScore();
  const passRateData = getPassRateData();
  const scoreDistributionData = getScoreDistributionData();

  return (
    <RoleGuard 
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      fallback={
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">Access denied. Admin privileges required.</p>
            </CardContent>
          </Card>
        </div>
      }
    >
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Exam Statistics</h1>
              <p className="text-gray-600">Data visualization and analytics for exam performance</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadExamStatistics} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={exportToPDF} variant="secondary">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{examStats.length}</p>
              <p className="text-gray-500">Total Exams</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-3xl font-bold text-green-600">
                {examStats.reduce((sum, stat) => sum + stat.totalParticipants, 0)}
              </p>
              <p className="text-gray-500">Total Participants</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-3xl font-bold text-purple-600">
                {examStats.length > 0 
                  ? (examStats.reduce((sum, stat) => sum + stat.averageScore, 0) / examStats.length).toFixed(1)
                  : 0}%
              </p>
              <p className="text-gray-500">Avg. Score</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-3xl font-bold text-orange-600">
                {examStats.length > 0 
                  ? (examStats.reduce((sum, stat) => sum + stat.passRate, 0) / examStats.length).toFixed(1)
                  : 0}%
              </p>
              <p className="text-gray-500">Avg. Pass Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Exams by Participants */}
          <Card>
            <CardHeader>
              <CardTitle>Top Exams by Participants</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topExamsByParticipants}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participants" fill="#8884d8" name="Participants" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Top Exams by Average Score */}
          <Card>
            <CardHeader>
              <CardTitle>Top Exams by Average Score</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topExamsByAverageScore}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="averageScore" fill="#82ca9d" name="Average Score (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pass Rate Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Pass Rate Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={passRateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="passRate" 
                    stroke="#ff7300" 
                    name="Pass Rate (%)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Score Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Exam Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {examStats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No exam statistics available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pass Rate</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Highest Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lowest Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {examStats.map((stat) => (
                      <tr key={stat.examId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {stat.examName || 'Unknown Exam'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.totalParticipants}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.averageScore.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.passRate.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.highestScore}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {stat.lowestScore}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}