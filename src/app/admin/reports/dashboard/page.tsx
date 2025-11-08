"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/exam/exam.service";
import { ExamResult, ExamStatistics } from "@/services/exam/exam.service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { RefreshCw, Download, FileText, ArrowLeft } from "lucide-react";
import { viewportAnimation } from "@/lib/utils";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jsPDFWithAutoTable } from '@/lib/jspdf-autotable';

// Define interfaces for the report data
interface AdminReportData {
  totalExams: number;
  totalResults: number;
  totalUsers: number;
  recentResults: ExamResult[];
  examStats: ExamStatistics[];
}

// Define color palette for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

export default function ReportsDashboardPage() {
  const { /*user*/ } = useAuth();
  const [reportData, setReportData] = useState<AdminReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await examService.getAdminReport();
      setReportData(data);
    } catch (error) {
      console.error("Failed to load admin report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const getExamParticipationData = () => {
    if (!reportData) return [];

    return reportData.examStats
      .sort((a, b) => b.totalParticipants - a.totalParticipants)
      .slice(0, 10)
      .map(stat => ({
        name: stat.examName || 'Unknown Exam',
        participants: stat.totalParticipants,
        averageScore: stat.averageScore
      }));
  };

  const getExamPerformanceData = () => {
    if (!reportData) return [];

    return reportData.examStats
      .sort((a, b) => b.averageScore - a.averageScore)
      .slice(0, 10)
      .map(stat => ({
        name: stat.examName || 'Unknown Exam',
        averageScore: stat.averageScore,
        passRate: stat.passRate
      }));
  };

  const getPassFailData = () => {
    if (!reportData) return [];

    const passed = reportData.recentResults.filter(r => r.passed).length;
    const failed = reportData.recentResults.filter(r => !r.passed).length;

    return [
      { name: 'Passed', value: passed },
      { name: 'Failed', value: failed }
    ];
  };

  // Export report data to CSV
  const exportToCSV = () => {
    if (!reportData) return;

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Add summary data
    csvContent += "Report Summary\\n";
    csvContent += "Metric,Value\\n";
    csvContent += `Total Exams,${reportData.totalExams}\\n`;
    csvContent += `Total Results,${reportData.totalResults}\\n`;
    csvContent += `Total Users,${reportData.totalUsers}\\n\\n`;

    // Add exam statistics
    csvContent += "Exam Statistics\\n";
    csvContent += "Exam Name,Participants,Average Score,Pass Rate,Highest Score,Lowest Score\\n";
    reportData.examStats.forEach(stat => {
      csvContent += `"${stat.examName || 'Unknown Exam'}",${stat.totalParticipants},${stat.averageScore},${stat.passRate},${stat.highestScore},${stat.lowestScore}\\n`;
    });

    csvContent += "\\n";

    // Add recent results
    csvContent += "Recent Exam Results\\n";
    csvContent += "User,Exam,Score,Percentage,Status,Submitted At\\n";
    reportData.recentResults.forEach(result => {
      const status = result.passed ? 'Passed' : 'Failed';
      const submittedAt = result.submittedAt ? new Date(result.submittedAt).toLocaleString() : 'N/A';
      csvContent += `"${result.userName || 'Unknown User'}","${result.examName || 'Unknown Exam'}",${result.score},${result.percentage},${status},"${submittedAt}"\\n`;
    });

    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export report data to PDF
  const exportToPDF = () => {
    if (!reportData) return;

    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Add title
    doc.setFontSize(20);
    doc.text("Admin Report Dashboard", 105, 20, { align: "center" });

    // Add date
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });

    // Add summary data
    doc.setFontSize(16);
    doc.text("Report Summary", 20, 45);

    doc.setFontSize(12);
    doc.autoTable({
      startY: 50,
      head: [['Metric', 'Value']],
      body: [
        ['Total Exams', reportData.totalExams.toString()],
        ['Total Results', reportData.totalResults.toString()],
        ['Total Users', reportData.totalUsers.toString()]
      ],
      theme: 'striped'
    });

    // Add exam statistics
    doc.setFontSize(16);
    doc.text("Exam Statistics", 20, (doc.lastAutoTable?.finalY || 70) + 10);

    doc.setFontSize(12);
    doc.autoTable({
      startY: (doc.lastAutoTable?.finalY || 70) + 15,
      head: [['Exam Name', 'Participants', 'Avg Score', 'Pass Rate', 'Highest', 'Lowest']],
      body: reportData.examStats.map(stat => [
        stat.examName || 'Unknown Exam',
        stat.totalParticipants.toString(),
        stat.averageScore.toFixed(1),
        stat.passRate.toFixed(1) + '%',
        stat.highestScore.toFixed(1) + '%',
        stat.lowestScore.toFixed(1) + '%'
      ]),
      theme: 'striped'
    });

    // Add recent results
    doc.setFontSize(16);
    doc.text("Recent Exam Results", 20, (doc.lastAutoTable?.finalY || 120) + 10);

    doc.setFontSize(12);
    doc.autoTable({
      startY: (doc.lastAutoTable?.finalY || 120) + 15,
      head: [['User', 'Exam', 'Score', 'Percentage', 'Status', 'Submitted At']],
      body: reportData.recentResults.map(result => {
        const status = result.passed ? 'Passed' : 'Failed';
        const submittedAt = result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A';
        return [
          result.userName || 'Unknown User',
          result.examName || 'Unknown Exam',
          result.score.toString(),
          result.percentage.toFixed(1) + '%',
          status,
          submittedAt
        ];
      }),
      theme: 'striped'
    });

    // Save the PDF
    doc.save("admin_report_dashboard.pdf");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading reports dashboard...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Failed to load report data.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const examParticipationData = getExamParticipationData();
  const examPerformanceData = getExamPerformanceData();
  const passFailData = getPassFailData();

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
        <motion.div 
          className="mb-8"
          {...viewportAnimation(0, 20)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Reports Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Comprehensive overview of system activity and exam performance</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadReport} variant="outline" className="dark:bg-blue-50/5 border-blue-200 dark:hover:text-blue-300 dark:hover:bg-blue-50/5">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button onClick={exportToPDF} variant="secondary" className="dark:bg-black">
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div {...viewportAnimation(0, 20)}>
            <Card className="dark:bg-slate-900">
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-700">{reportData.totalExams}</p>
                <p className="text-gray-500 dark:text-blue-100/60">Total Exams</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...viewportAnimation(0.1, 20)}>
            <Card className="dark:bg-slate-900">
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-green-600 dark:text-green-700">{reportData.totalResults}</p>
                <p className="text-gray-500 dark:text-blue-100/60">Total Exam Results</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...viewportAnimation(0.2, 20)}>
            <Card className="dark:bg-slate-900">
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-700">{reportData.totalUsers}</p>
                <p className="text-gray-500 dark:text-blue-100/60">Total Users</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...viewportAnimation(0.3, 20)}>
            <Card className="dark:bg-slate-900">
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-700">{reportData.recentResults.length}</p>
                <p className="text-gray-500 dark:text-blue-100/60">Recent Attempts</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Exam Participation Chart */}
          <motion.div {...viewportAnimation(0, 20)}>
            <Card>
              <CardHeader>
                <CardTitle>Top Exams by Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={examParticipationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-60} textAnchor="end" height={60} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="participants" name="Participants" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exam Performance Chart */}
          <motion.div {...viewportAnimation(0.1, 20)}>
            <Card>
              <CardHeader>
                <CardTitle>Top Exams by Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={examPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-80} textAnchor="end" height={60} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="averageScore" name="Average Score (%)" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pass/Fail Distribution */}
          <motion.div {...viewportAnimation(0, 20)}>
            <Card>
              <CardHeader>
                <CardTitle>Pass/Fail Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={passFailData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={(props) => `${props.name}: ${(Number(props.percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {passFailData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Trend */}
          <motion.div {...viewportAnimation(0.1, 20)}>
            <Card>
              <CardHeader>
                <CardTitle>Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={examPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="averageScore"
                        name="Average Score (%)"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="passRate"
                        name="Pass Rate (%)"
                        stroke="#82ca9d"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Exam Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div {...viewportAnimation(0, 20)}>
            <Card className="dark:bg-slate-900">
              <CardHeader>
                <CardTitle>Recent Exam Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.recentResults.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent exam attempts</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar p-2">
                    {reportData.recentResults.map((result) => (
                      <motion.div 
                        key={result.id} 
                        className="flex justify-between items-center p-4 border rounded-lg transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-300/5 hover:border-blue-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <p className="font-medium">{result.userName || 'Unknown User'}</p>
                          <p className="text-sm text-gray-500">{result.examName || 'Unknown Exam'}</p>
                          <p className="text-xs text-gray-400">
                            {result.submittedAt ? new Date(result.submittedAt).toLocaleString() : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-lg ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.percentage}%
                          </p>
                          <p className={`text-sm ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
                            {result.passed ? 'Passed' : 'Failed'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Exam Statistics Summary */}
          <motion.div {...viewportAnimation(0.1, 20)}>
            <Card className="dark:bg-slate-900">
              <CardHeader>
                <CardTitle>Exam Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.examStats.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No exam statistics available</p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar p-2">
                    {reportData.examStats.slice(0, 10).map((stat, index) => (
                      <motion.div 
                        key={index} 
                        className="flex justify-between items-center p-4 border rounded-lg transition-colors duration-200 hover:bg-blue-50 dark:hover:bg-blue-300/5 hover:border-blue-300"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div>
                          <p className="font-medium">{stat.examName || 'Unknown Exam'}</p>
                          <p className="text-sm text-gray-500">{stat.totalParticipants} participants</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-blue-600">{stat.averageScore}%</p>
                          <p className="text-sm text-gray-500">Avg. Score</p>
                          <p className="text-sm text-gray-500">{stat.passRate}% Pass Rate</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </RoleGuard>
  );
}
