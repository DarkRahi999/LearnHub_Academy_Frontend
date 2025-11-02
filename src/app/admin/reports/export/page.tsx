"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { RefreshCw, Download, FileText, FileSpreadsheet } from "lucide-react";
import { examService } from "@/services/exam/exam.service";
import { AdminReport, ExamStatistics, ExamParticipation } from "@/services/exam/exam.service";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jsPDFWithAutoTable } from '@/lib/jspdf-autotable';

export default function ExportReportsPage() {
  const [reportData, setReportData] = useState<AdminReport | null>(null);
  const [examStats, setExamStats] = useState<ExamStatistics[]>([]);
  const [examParticipations, setExamParticipations] = useState<ExamParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      // Load admin report data
      const report = await examService.getAdminReport();
      setReportData(report);
      
      // Load exam statistics
      const stats = await examService.getExamStatistics();
      setExamStats(stats);
      
      // Load exam participation data
      const participation = await examService.getExamParticipationData();
      setExamParticipations(participation);
    } catch (error) {
      console.error("Failed to load report data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export all data to CSV
  const exportToCSV = () => {
    if (!reportData || !examStats.length || !examParticipations.length) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add summary data
    csvContent += "ADMIN REPORT SUMMARY\\n";
    csvContent += "Metric,Value\\n";
    csvContent += `Total Exams,${reportData.totalExams}\\n`;
    csvContent += `Total Results,${reportData.totalResults}\\n`;
    csvContent += `Total Users,${reportData.totalUsers}\\n\\n`;
    
    // Add exam statistics
    csvContent += "EXAM STATISTICS\\n";
    csvContent += "Exam Name,Participants,Average Score,Pass Rate,Highest Score,Lowest Score\\n";
    examStats.forEach(stat => {
      csvContent += `"${stat.examName || 'Unknown Exam'}",${stat.totalParticipants},${stat.averageScore},${stat.passRate},${stat.highestScore},${stat.lowestScore}\\n`;
    });
    
    csvContent += "\\n";
    
    // Add recent results
    csvContent += "RECENT EXAM RESULTS\\n";
    csvContent += "User,Exam,Score,Percentage,Status,Submitted At\\n";
    reportData.recentResults.forEach(result => {
      const status = result.passed ? 'Passed' : 'Failed';
      const submittedAt = result.submittedAt ? new Date(result.submittedAt).toLocaleString() : 'N/A';
      csvContent += `"${result.userName || 'Unknown User'}","${result.examName || 'Unknown Exam'}",${result.score},${result.percentage},${status},"${submittedAt}"\\n`;
    });
    
    csvContent += "\\n";
    
    // Add exam participation data
    csvContent += "EXAM PARTICIPATION DATA\\n";
    csvContent += "Exam,Total Participants\\n";
    examParticipations.forEach(participation => {
      csvContent += `"${participation.examName}",${participation.totalParticipants}\\n`;
    });
    
    csvContent += "\\n";
    
    // Add detailed participation data
    csvContent += "DETAILED PARTICIPATION DATA\\n";
    csvContent += "Exam,User,Score,Percentage,Status,Submitted At\\n";
    examParticipations.forEach(participation => {
      participation.participants.forEach((participant) => {
        const status = participant.passed ? 'Passed' : 'Failed';
        const submittedAt = participant.submittedAt ? new Date(participant.submittedAt).toLocaleString() : 'N/A';
        csvContent += `"${participation.examName}","${participant.userName}",${participant.score},${participant.percentage},${status},"${submittedAt}"\\n`;
      });
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "full_admin_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export all data to PDF
  const exportToPDF = () => {
    if (!reportData || !examStats.length || !examParticipations.length) return;
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Add title
    doc.setFontSize(20);
    doc.text("Admin Report", 105, 20, { align: "center" });
    
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
    doc.save("full_admin_report.pdf");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading report data...</p>
        </div>
      </div>
    );
  }

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
              <h1 className="text-3xl font-bold">Export Reports</h1>
              <p className="text-gray-600">Export comprehensive admin reports in various formats</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadAllData} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Data
              </Button>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* CSV Export Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileSpreadsheet className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Export to CSV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Export all report data in CSV format for spreadsheet analysis
              </p>
              <Button onClick={exportToCSV} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download CSV
              </Button>
            </CardContent>
          </Card>

          {/* PDF Export Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Export to PDF</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Export all report data in PDF format for sharing and printing
              </p>
              <Button onClick={exportToPDF} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Data Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{reportData?.totalExams || 0}</p>
                <p className="text-gray-600">Total Exams</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{reportData?.totalResults || 0}</p>
                <p className="text-gray-600">Total Results</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{reportData?.totalUsers || 0}</p>
                <p className="text-gray-600">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}