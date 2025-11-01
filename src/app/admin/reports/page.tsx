"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/exam/exam.service";
import { ExamResult, ExamStatistics } from "@/services/exam/exam.service";

// Define interfaces for the report data
interface AdminReportData {
  totalExams: number;
  totalResults: number;
  totalUsers: number;
  recentResults: ExamResult[];
  examStats: ExamStatistics[];
}

export default function AdminReportsPage() {
  const { /*user*/ } = useAuth();
  const [reportData, setReportData] = useState<AdminReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      try {
        const data = await examService.getAdminReport();
        setReportData(data);
      } catch (error) {
        console.error("Failed to load admin report:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading admin report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Failed to load admin report.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of system activity and exam performance</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{reportData.totalExams}</p>
            <p className="text-gray-500">Total Exams</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-green-600">{reportData.totalResults}</p>
            <p className="text-gray-500">Total Exam Results</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{reportData.totalUsers}</p>
            <p className="text-gray-500">Total Users</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="py-6 text-center">
            <p className="text-3xl font-bold text-orange-600">{reportData.recentResults.length}</p>
            <p className="text-gray-500">Recent Attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Exam Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Exam Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.recentResults.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No recent exam attempts</p>
            ) : (
              <div className="space-y-4">
                {reportData.recentResults.slice(0, 5).map((result) => (
                  <div key={result.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{result.userName || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{result.examName || 'Unknown Exam'}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {result.percentage}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam Statistics Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.examStats.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No exam statistics available</p>
            ) : (
              <div className="space-y-4">
                {reportData.examStats.slice(0, 5).map((stat, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{stat.examName || 'Unknown Exam'}</p>
                      <p className="text-sm text-gray-500">{stat.totalParticipants} participants</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{stat.averageScore}%</p>
                      <p className="text-sm text-gray-500">Avg. Score</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Exam Statistics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Exam Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {reportData.examStats.length === 0 ? (
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
                  {reportData.examStats.map((stat, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.examName || 'Unknown Exam'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.totalParticipants}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{stat.averageScore}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <span className="mr-2">{stat.passRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.highestScore}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.lowestScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}