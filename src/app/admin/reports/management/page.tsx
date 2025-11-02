"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/exam/exam.service";
import { ExamResult, ExamStatistics } from "@/services/exam/exam.service";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { Download, RefreshCw, Filter, BarChart3, FileText, Users } from "lucide-react";
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

export default function ReportManagementPage() {
  const { /*user*/ } = useAuth();
  const [reportData, setReportData] = useState<AdminReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('all');

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

  // Filter results based on selected filter
  const getFilteredResults = () => {
    if (!reportData) return [];
    
    let filtered = [...reportData.recentResults];
    
    if (filter === 'passed') {
      filtered = filtered.filter(r => r.passed);
    } else if (filter === 'failed') {
      filtered = filtered.filter(r => !r.passed);
    }
    
    return filtered;
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
    (doc as jsPDF).setFontSize(20);
    (doc as jsPDF).text("Report Management Dashboard", 105, 20, { align: "center" });
    
    // Add date
    (doc as jsPDF).setFontSize(12);
    (doc as jsPDF).text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
    
    // Add summary data
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("Report Summary", 20, 45);
    
    (doc as jsPDF).setFontSize(12);
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
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("Exam Statistics", 20, (doc.lastAutoTable?.finalY || 70) + 10);
    
    (doc as jsPDF).setFontSize(12);
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
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("Recent Exam Results", 20, (doc.lastAutoTable?.finalY || 120) + 10);
    
    (doc as jsPDF).setFontSize(12);
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
    (doc as jsPDF).save("report_management.pdf");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading report management dashboard...</p>
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
            <Button onClick={loadReport} className="mt-4">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredResults = getFilteredResults();

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
              <h1 className="text-3xl font-bold">Report Management</h1>
              <p className="text-gray-600">Manage and analyze exam performance reports</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadReport} variant="outline">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="py-6 text-center">
              <BarChart3 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{reportData.totalExams}</p>
              <p className="text-gray-500">Total Exams</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{reportData.totalResults}</p>
              <p className="text-gray-500">Total Results</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{reportData.totalUsers}</p>
              <p className="text-gray-500">Total Users</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="py-6 text-center">
              <BarChart3 className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">{filteredResults.length}</p>
              <p className="text-gray-500">Filtered Results</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Status Filter</label>
                <select 
                  className="border rounded p-2"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as 'all' | 'passed' | 'failed')}
                >
                  <option value="all">All Results</option>
                  <option value="passed">Passed Only</option>
                  <option value="failed">Failed Only</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Time Range</label>
                <select 
                  className="border rounded p-2"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'all')}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="all">All Time</option>
                </select>
              </div>
              
              <div className="flex items-end">
                <Button onClick={loadReport} variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Results */}
          <Card>
            <CardHeader>
              <CardTitle>Filtered Exam Results</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredResults.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No results match the current filters</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {filteredResults.map((result) => (
                    <div key={result.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Exam Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Exam Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.examStats.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No exam statistics available</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {reportData.examStats.slice(0, 10).map((stat, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{stat.examName || 'Unknown Exam'}</p>
                        <p className="text-sm text-gray-500">{stat.totalParticipants} participants</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{stat.averageScore}%</p>
                        <p className="text-sm text-gray-500">Avg. Score</p>
                        <p className="text-sm text-gray-500">{stat.passRate}% Pass Rate</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle>Export Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export Full Report (CSV)
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Statistics (CSV)
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export User Data (CSV)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}