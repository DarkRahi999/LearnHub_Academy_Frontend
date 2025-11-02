"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { examService, ExamParticipation } from "@/services/exam/exam.service";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { RefreshCw, Download, FileText } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { jsPDFWithAutoTable } from "@/lib/jspdf-autotable";

export default function ExamParticipationPage() {
  const [examParticipations, setExamParticipations] = useState<ExamParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedExam, setExpandedExam] = useState<number | null>(null);

  useEffect(() => {
    loadExamParticipationData();
  }, []);

  const loadExamParticipationData = async () => {
    try {
      setLoading(true);
      const data = await examService.getExamParticipationData();
      // Reverse the order to show recent exams first
      setExamParticipations(data.reverse());
    } catch (error) {
      console.error("Failed to load exam participation data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Export participation data to CSV
  const exportToCSV = () => {
    if (!examParticipations.length) return;
    
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add exam participation summary
    csvContent += "Exam Participation Summary\\n";
    csvContent += "Exam,Total Participants\\n";
    examParticipations.forEach(participation => {
      csvContent += `"${participation.examName}",${participation.totalParticipants}\\n`;
    });
    
    csvContent += "\\n";
    
    // Add detailed participation data
    csvContent += "Detailed Participation Data\\n";
    csvContent += "Exam,User,Score,Percentage,Status,Submitted At\\n";
    examParticipations.forEach(participation => {
      participation.participants.forEach(participant => {
        const status = participant.passed ? 'Passed' : 'Failed';
        const submittedAt = participant.submittedAt ? new Date(participant.submittedAt).toLocaleString() : 'N/A';
        csvContent += `"${participation.examName}","${participant.userName}",${participant.score},${participant.percentage},${status},"${submittedAt}"\\n`;
      });
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "exam_participation.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export participation data to PDF
  const exportToPDF = () => {
    if (!examParticipations.length) return;
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Add title
    (doc as jsPDF).setFontSize(20);
    (doc as jsPDF).text("Exam Participation Report", 105, 20, { align: "center" });
    
    // Add date
    (doc as jsPDF).setFontSize(12);
    (doc as jsPDF).text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: "center" });
    
    // Add exam participation summary
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("Exam Participation Summary", 20, 45);
    
    (doc as jsPDF).setFontSize(12);
    doc.autoTable({
      startY: 50,
      head: [['Exam', 'Total Participants']],
      body: examParticipations.map(participation => [
        participation.examName,
        participation.totalParticipants.toString()
      ]),
      theme: 'striped'
    });
    
    // Add detailed participation data
    (doc as jsPDF).setFontSize(16);
    (doc as jsPDF).text("Detailed Participation Data", 20, (doc.lastAutoTable?.finalY || 70) + 10);
    
    (doc as jsPDF).setFontSize(12);
    examParticipations.forEach((participation, index) => {
      doc.autoTable({
        startY: (doc.lastAutoTable?.finalY || 70) + 15 + (index > 0 ? 10 : 0),
        head: [['User', 'Score', 'Percentage', 'Status', 'Submitted At']],
        body: participation.participants.map(participant => {
          const status = participant.passed ? 'Passed' : 'Failed';
          const submittedAt = participant.submittedAt ? new Date(participant.submittedAt).toLocaleDateString() : 'N/A';
          return [
            participant.userName,
            participant.score.toString(),
            participant.percentage.toFixed(1) + '%',
            status,
            submittedAt
          ];
        }),
        theme: 'striped',
        showHead: 'firstPage',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
      });
    });
    
    // Save the PDF
    (doc as jsPDF).save("exam_participation.pdf");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading exam participation data...</p>
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
              <h1 className="text-3xl font-bold">Exam Participation</h1>
              <p className="text-gray-600">View which exams have how many participants and who participated</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={loadExamParticipationData} variant="outline">
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

        {/* Exam Participation Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Exam Participation Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {examParticipations.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No exam participation data available</p>
            ) : (
              <div className="space-y-4">
                {examParticipations.map((participation) => (
                  <div key={participation.examId} className="border rounded-lg">
                    <div 
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedExam(
                        expandedExam === participation.examId ? null : participation.examId
                      )}
                    >
                      <div>
                        <h3 className="font-medium text-lg">{participation.examName}</h3>
                        <p className="text-sm text-gray-500">
                          {participation.totalParticipants} participant{participation.totalParticipants !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm">
                          {expandedExam === participation.examId ? 'Hide Details' : 'View Details'}
                        </Button>
                      </div>
                    </div>
                    
                    {expandedExam === participation.examId && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                          <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-xl font-bold">{participation.examName} - Participants</h3>
                              <Button 
                                variant="ghost" 
                                onClick={() => setExpandedExam(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Close
                              </Button>
                            </div>
                            
                            <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted At</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {participation.participants.map((participant, index) => (
                                    <tr key={`${participant.userId}-${index}`} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {participant.userName}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {participant.score}
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {participant.percentage}%
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                          participant.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                          {participant.passed ? 'Passed' : 'Failed'}
                                        </span>
                                      </td>
                                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                        {participant.submittedAt ? new Date(participant.submittedAt).toLocaleString() : 'N/A'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}