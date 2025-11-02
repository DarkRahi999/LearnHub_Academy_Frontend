"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { examService } from "@/services/exam/exam.service";
import { ExamResult } from "@/services/exam/exam.service";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { RefreshCw, Download, FileText } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jsPDFWithAutoTable } from '@/lib/jspdf-autotable';

// Define interface for admin report results which includes userName
interface AdminExamResult extends ExamResult {
  userName?: string;
}

interface UserPerformance {
  userId: number;
  userName: string;
  totalExams: number;
  averageScore: number;
  passedExams: number;
  failedExams: number;
  examResults: AdminExamResult[];
}

export default function UserPerformancePage() {
  const [userPerformances, setUserPerformances] = useState<UserPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadUserPerformances();
  }, []);

  const loadUserPerformances = async () => {
    try {
      setLoading(true);
      const report = await examService.getAdminReport();
      
      // Group results by user
      const userMap: Record<number, UserPerformance> = {};
      
      report.recentResults.forEach(result => {
        // Use result.user as the userId (backend sends user ID in the user property)
        const userId = result.user;
        if (!userId) return;
        
        if (!userMap[userId]) {
          userMap[userId] = {
            userId: userId,
            userName: result.userName || 'Unknown User',
            totalExams: 0,
            averageScore: 0,
            passedExams: 0,
            failedExams: 0,
            examResults: []
          };
        }
        
        const userPerformance = userMap[userId];
        userPerformance.totalExams += 1;
        userPerformance.examResults.push(result);
        if (result.passed) {
          userPerformance.passedExams += 1;
        } else {
          userPerformance.failedExams += 1;
        }
      });
      
      // Calculate average scores
      Object.values(userMap).forEach(userPerformance => {
        if (userPerformance.examResults.length > 0) {
          const totalScore = userPerformance.examResults.reduce((sum, result) => sum + result.percentage, 0);
          userPerformance.averageScore = Math.round(totalScore / userPerformance.examResults.length);
        }
      });
      
      setUserPerformances(Object.values(userMap));
    } catch (error) {
      console.error("Failed to load user performances:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export user performance data to CSV
  const exportToCSV = () => {
    if (!userPerformances.length) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add user performance data
    csvContent += "User Performance\\n";
    csvContent += "User,Total Exams,Average Score,Passed Exams,Failed Exams\\n";
    userPerformances.forEach(performance => {
      csvContent += `"${performance.userName}",${performance.totalExams},${performance.averageScore},${performance.passedExams},${performance.failedExams}\\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "user_performance.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export user performance data to PDF
  const exportToPDF = () => {
    if (!userPerformances.length) return;
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Add title
    (doc as jsPDF).setFontSize(20);
    (doc as jsPDF).text("User Performance Report", 105, 20, { align: "center" });
    
    // Add date
    (doc as jsPDF).setFontSize(12);
    (doc as jsPDF).text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
    
    // Add user performance data
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("User Performance Overview", 20, 45);
    
    (doc as jsPDF).setFontSize(12);
    doc.autoTable({
      startY: 50,
      head: [['User', 'Total Exams', 'Average Score', 'Passed Exams', 'Failed Exams']],
      body: userPerformances.map(performance => [
        performance.userName,
        performance.totalExams.toString(),
        performance.averageScore.toString() + '%',
        performance.passedExams.toString(),
        performance.failedExams.toString()
      ]),
      theme: 'striped'
    });
    
    // Save the PDF
    (doc as jsPDF).save("user_performance.pdf");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading user performance data...</p>
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
              <h1 className="text-3xl font-bold">User Performance</h1>
              <p className="text-gray-600">Track individual user progress and performance</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadUserPerformances} variant="outline">
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

        {/* User Performance Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {userPerformances.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No user performance data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Exams</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Failed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userPerformances.map((performance) => (
                      <tr key={performance.userId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {performance.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {performance.totalExams}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {performance.averageScore}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="text-green-600 font-medium">{performance.passedExams}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="text-red-600 font-medium">{performance.failedExams}</span>
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