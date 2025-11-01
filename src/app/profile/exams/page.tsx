"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { examService } from "@/services/exam/exam.service";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Clock, Calendar, Hourglass, BookOpen } from "lucide-react";

interface Exam {
  id: number;
  name: string;
  description?: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalQuestions: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function UserExamsPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        const data = await examService.getAllExams();
        // Filter active exams only
        const activeExams = data.filter(exam => exam.isActive);
        setExams(activeExams);
      } catch (error) {
        console.error("Failed to load exams:", error);
        setError("Failed to load exams. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  const handleStartExam = async (examId: number, isPractice: boolean = false) => {
    try {
      if (isPractice) {
        // For practice exams, we don't need to call the backend to start the exam
        // Just redirect to the exam page with practice mode
        router.push(`/exams/${examId}?practice=true`);
      } else {
        // Check if user has already attempted this exam
        const { hasAttempted } = await examService.checkUserExamAttempt(examId);
        
        if (hasAttempted) {
          router.push(`/exams/${examId}/review`);
        } else {
          // Start the exam
          await examService.startExam(examId);
          router.push(`/exams/${examId}`);
        }
      }
    } catch (error) {
      console.error("Failed to start exam:", error);
      setError("Failed to start exam. Please try again.");
    }
  };

  // Function to check if exam is in the future (upcoming)
  const isUpcomingExam = (exam: Exam) => {
    const now = new Date();
    const examDateTimeStart = new Date(exam.examDate);
    const [startHours, startMinutes] = exam.startTime.split(':').map(Number);
    examDateTimeStart.setHours(startHours, startMinutes, 0, 0);
    
    return examDateTimeStart > now;
  };

  // Function to check if exam has ended (practice)
  const isPracticeExam = (exam: Exam) => {
    const now = new Date();
    const examDateTimeEnd = new Date(exam.examDate);
    const [endHours, endMinutes] = exam.endTime.split(':').map(Number);
    examDateTimeEnd.setHours(endHours, endMinutes, 0, 0);
    
    return examDateTimeEnd < now;
  };

  // Function to check if exam is currently active
  const isCurrentlyActive = (exam: Exam) => {
    const now = new Date();
    const examDateTimeStart = new Date(exam.examDate);
    const [startHours, startMinutes] = exam.startTime.split(':').map(Number);
    examDateTimeStart.setHours(startHours, startMinutes, 0, 0);
    
    const examDateTimeEnd = new Date(exam.examDate);
    const [endHours, endMinutes] = exam.endTime.split(':').map(Number);
    examDateTimeEnd.setHours(endHours, endMinutes, 0, 0);
    
    return now >= examDateTimeStart && now <= examDateTimeEnd;
  };

  // Separate exams into different categories
  const upcomingExams = exams.filter(exam => isUpcomingExam(exam));
  const activeExams = exams.filter(exam => isCurrentlyActive(exam));
  const practiceExams = exams.filter(exam => isPracticeExam(exam));

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading available exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Exams</h1>
        <p className="text-gray-600">Browse and take available exams</p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Active Exams Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <Hourglass className="h-5 w-5 mr-2 text-blue-500" />
          <h2 className="text-2xl font-semibold">Active Exams</h2>
        </div>
        {activeExams.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">No active exams available right now.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeExams.map((exam) => (
              <Card key={exam.id} className="flex flex-col border-blue-200 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{exam.name}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Active
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {exam.description && (
                    <p className="text-gray-600 mb-4">{exam.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Time: {exam.startTime} - {exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Questions: {exam.totalQuestions}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    onClick={() => handleStartExam(exam.id)}
                  >
                    Start Exam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Exams Section */}
      <div className="mb-10">
        <div className="flex items-center mb-4">
          <Calendar className="h-5 w-5 mr-2 text-yellow-500" />
          <h2 className="text-2xl font-semibold">Upcoming Exams</h2>
        </div>
        {upcomingExams.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">No upcoming exams scheduled.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingExams.map((exam) => (
              <Card key={exam.id} className="flex flex-col border-yellow-200 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{exam.name}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Upcoming
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {exam.description && (
                    <p className="text-gray-600 mb-4">{exam.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Time: {exam.startTime} - {exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Questions: {exam.totalQuestions}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    disabled
                  >
                    Starts Soon
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Practice Exams Section */}
      <div>
        <div className="flex items-center mb-4">
          <BookOpen className="h-5 w-5 mr-2 text-green-500" />
          <h2 className="text-2xl font-semibold">Practice Exams</h2>
        </div>
        {practiceExams.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center">
              <p className="text-gray-500">No practice exams available.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceExams.map((exam) => (
              <Card key={exam.id} className="flex flex-col border-green-200 border-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{exam.name}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Practice
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  {exam.description && (
                    <p className="text-gray-600 mb-4">{exam.description}</p>
                  )}
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Time: {exam.startTime} - {exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Questions: {exam.totalQuestions}</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-4" 
                    variant="secondary"
                    onClick={() => handleStartExam(exam.id, true)}
                  >
                    Practice Exam
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}