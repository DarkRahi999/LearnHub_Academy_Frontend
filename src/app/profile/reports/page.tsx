"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { examService } from "@/services/exam/exam.service";
import { ExamResult } from "@/services/exam/exam.service";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Helper function to group results by week
const getWeeklyProgressData = (results: ExamResult[]) => {
  const weeklyData: { [key: string]: { totalScore: number; count: number } } = {};
  
  results.forEach(result => {
    if (result.submittedAt) {
      const date = new Date(result.submittedAt);
      // Get week number (simplified approach)
      const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
      
      if (!weeklyData[week]) {
        weeklyData[week] = { totalScore: 0, count: 0 };
      }
      
      weeklyData[week].totalScore += result.percentage;
      weeklyData[week].count += 1;
    }
  });
  
  return Object.entries(weeklyData)
    .map(([week, data]) => ({
      week,
      averageScore: Math.round(data.totalScore / data.count)
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
};

// Helper function to group results by month
const getMonthlyProgressData = (results: ExamResult[]) => {
  const monthlyData: { [key: string]: { totalScore: number; count: number } } = {};
  
  results.forEach(result => {
    if (result.submittedAt) {
      const date = new Date(result.submittedAt);
      // Get month in YYYY-MM format
      const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      
      if (!monthlyData[month]) {
        monthlyData[month] = { totalScore: 0, count: 0 };
      }
      
      monthlyData[month].totalScore += result.percentage;
      monthlyData[month].count += 1;
    }
  });
  
  return Object.entries(monthlyData)
    .map(([month, data]) => ({
      month,
      averageScore: Math.round(data.totalScore / data.count)
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

export default function UserReportsPage() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await examService.getUserExamHistory();
        setResults(data);
      } catch (error) {
        console.error("Failed to load exam results:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading your exam history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Exam History</h1>
        <p className="text-gray-600">View your exam attempts and performance over time</p>
      </div>

      {results.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">You haven&apos;t taken any exams yet.</p>
            <p className="text-gray-400 mt-2">Take an exam to see your results here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-blue-600">{results.length}</p>
                <p className="text-gray-500">Exams Taken</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-green-600">
                  {results.filter(r => r.passed).length}
                </p>
                <p className="text-gray-500">Passed</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="py-6 text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length) : 0}%
                </p>
                <p className="text-gray-500">Average Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Individual Exam Results */}
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Exam Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={results.map((result, index) => ({
                        name: result.examName || `Exam ${index + 1}`,
                        percentage: result.percentage,
                        passed: result.passed ? 1 : 0
                      })).reverse()}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        name="Score (%)" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getWeeklyProgressData(results)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="averageScore" 
                        name="Average Score (%)" 
                        stroke="#82ca9d" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={getMonthlyProgressData(results)}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="averageScore" 
                        name="Average Score (%)" 
                        stroke="#ffc658" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Exam History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.examName || 'Exam'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.submittedAt ? new Date(result.submittedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {result.correctAnswers} / {result.totalQuestions}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <span className="mr-2">{result.percentage}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${result.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Badge variant={result.passed ? "success" : "destructive"}>
                            {result.passed ? "Passed" : "Failed"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}