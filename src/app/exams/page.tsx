"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/exam/exam.service";
import { Exam } from "@/interface/exam";
import { Calendar, Clock, Users, BookOpen, Hourglass, PlayCircle } from "lucide-react";
import Link from "next/link";

export default function ExamsPage() {
  const { /*user*/ } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<Record<number, string>>({});

  // Load exams
  useEffect(() => {
    const loadExams = async () => {
      try {
        const examsData = await examService.getAllExams();
        setExams(examsData);
      } catch (error) {
        console.error("Failed to load exams:", error);
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  // Calculate time remaining for exams
  const calculateTimeRemaining = useCallback((examId: number, examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        return "Invalid time";
      }
      
      let startDateTime: Date;
      let endDateTime: Date;
      
      // Handle start time
      if (examDate.includes('T')) {
        const datePart = examDate.split('T')[0];
        startDateTime = new Date(`${datePart}T${startTime}`);
      } else {
        startDateTime = new Date(`${examDate}T${startTime}`);
      }
      
      // Handle end time
      if (examDate.includes('T')) {
        const datePart = examDate.split('T')[0];
        endDateTime = new Date(`${datePart}T${endTime}`);
      } else {
        endDateTime = new Date(`${examDate}T${endTime}`);
      }
      
      // Final check if the dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return "Invalid time";
      }
      
      const now = new Date();
      
      // If exam hasn't started yet (upcoming)
      if (now < startDateTime) {
        const diff = startDateTime.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (hours > 0) {
          return `Starts in: ${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          return `Starts in: ${minutes}m ${seconds}s`;
        } else {
          return `Starts in: ${seconds}s`;
        }
      }
      
      // If exam has ended (practice)
      if (now > endDateTime) {
        return "Ended";
      }
      
      // Calculate remaining time for ongoing exams
      const diff = endDateTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        return `Time left: ${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        return `Time left: ${minutes}m ${seconds}s`;
      } else {
        return `Time left: ${seconds}s`;
      }
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Error";
    }
  }, []);

  // Update time remaining for all exams
  useEffect(() => {
    const updateAllTimes = () => {
      const newTimeRemaining: Record<number, string> = {};
      exams.forEach(exam => {
        // Calculate time for all exams (ongoing and upcoming)
        newTimeRemaining[exam.id] = calculateTimeRemaining(exam.id, exam.examDate, exam.startTime, exam.endTime);
      });
      setTimeRemaining(newTimeRemaining);
    };

    // Initial update
    updateAllTimes();

    // Update every second
    const interval = setInterval(updateAllTimes, 1000);

    return () => clearInterval(interval);
  }, [exams, calculateTimeRemaining]);

  // Function to determine if an exam is currently ongoing
  const isOngoingExam = (examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        return false;
      }
      
      let startDateTime: Date;
      let endDateTime: Date;
      
      // Handle start time
      if (examDate.includes('T')) {
        const datePart = examDate.split('T')[0];
        startDateTime = new Date(`${datePart}T${startTime}`);
      } else {
        startDateTime = new Date(`${examDate}T${startTime}`);
      }
      
      // Handle end time
      if (examDate.includes('T')) {
        const datePart = examDate.split('T')[0];
        endDateTime = new Date(`${datePart}T${endTime}`);
      } else {
        endDateTime = new Date(`${examDate}T${endTime}`);
      }
      
      // Final check if the dates are valid
      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        return false;
      }
      
      const now = new Date();
      
      // Return true if exam is currently ongoing
      return now >= startDateTime && now <= endDateTime;
    } catch (error) {
      console.error("Error calculating exam status:", error);
      return false;
    }
  };

  // Function to determine if an exam has ended (for practice)
  const isPracticeExam = (examDate: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !endTime) {
        return false;
      }
      
      let endDateTime: Date;
      
      // Handle end time
      if (examDate.includes('T')) {
        const datePart = examDate.split('T')[0];
        endDateTime = new Date(`${datePart}T${endTime}`);
      } else {
        endDateTime = new Date(`${examDate}T${endTime}`);
      }
      
      // Final check if the date is valid
      if (isNaN(endDateTime.getTime())) {
        return false;
      }
      
      const now = new Date();
      
      // Return true if exam has ended
      return now > endDateTime;
    } catch (error) {
      console.error("Error calculating exam status:", error);
      return false;
    }
  };

  // Function to determine if an exam is upcoming (not started yet)
  const isUpcomingExam = (examDate: string, startTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime) {
        return false;
      }
      
      let startDateTime: Date;
      
      // Handle start time
      if (examDate.includes('T')) {
        const datePart = examDate.split('T')[0];
        startDateTime = new Date(`${datePart}T${startTime}`);
      } else {
        startDateTime = new Date(`${examDate}T${startTime}`);
      }
      
      // Final check if the date is valid
      if (isNaN(startDateTime.getTime())) {
        return false;
      }
      
      const now = new Date();
      
      // Return true if exam hasn't started yet
      return now < startDateTime;
    } catch (error) {
      console.error("Error calculating exam status:", error);
      return false;
    }
  };

  // Separate exams into categories
  const ongoingExams = exams.filter(exam => 
    isOngoingExam(exam.examDate, exam.startTime, exam.endTime) && exam.isActive
  );
  
  const upcomingExams = exams.filter(exam => 
    isUpcomingExam(exam.examDate, exam.startTime) && exam.isActive
  );
  
  const practiceExams = exams.filter(exam => 
    isPracticeExam(exam.examDate, exam.endTime) && exam.isActive
  );

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Exams</h1>
        <p className="text-gray-600">Browse ongoing, upcoming, and practice exams</p>
      </div>

      {/* Ongoing Exams Section - Only show when there are ongoing exams */}
      {ongoingExams.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <PlayCircle className="w-5 h-5 mr-2 text-green-500" />
            <h2 className="text-2xl font-semibold">Ongoing Exams</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingExams.map(exam => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow border-green-300 border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{exam.name}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Ongoing
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                  
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Time: {exam.startTime} - {exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    
                    {/* Time remaining for ongoing exams */}
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {timeRemaining[exam.id] || "Calculating..."}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full" asChild>
                      <Link href={`/exams/${exam.id}`}>
                        Join Exam
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Exams Section */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Hourglass className="w-5 h-5 mr-2 text-blue-500" />
          <h2 className="text-2xl font-semibold">Upcoming Exams</h2>
        </div>
        
        {upcomingExams.length === 0 ? (
          <div className="text-center py-8 bg-blue-50 rounded-lg">
            <p className="text-gray-600">No upcoming exams available at the moment</p>
            <p className="text-gray-500 mt-1">Check back later for new exams</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingExams.map(exam => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow border-blue-200 border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{exam.name}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      Upcoming
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                  
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Time: {exam.startTime} - {exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    
                    {/* Time until start for upcoming exams */}
                    <div className="flex items-center text-sm font-medium text-blue-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>
                        {timeRemaining[exam.id] || "Calculating..."}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full" asChild>
                      <Link href={`/exams/${exam.id}`}>
                        Start Exam
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Practice Exams Section */}
      <div>
        <div className="flex items-center mb-6">
          <BookOpen className="w-5 h-5 mr-2 text-purple-500" />
          <h2 className="text-2xl font-semibold">Practice Exams</h2>
        </div>
        
        {practiceExams.length === 0 ? (
          <div className="text-center py-8 bg-purple-50 rounded-lg">
            <p className="text-gray-600">No practice exams available yet</p>
            <p className="text-gray-500 mt-1">Ended exams will appear here for practice</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {practiceExams.map(exam => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow border-purple-200 border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{exam.name}</span>
                    <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      Practice
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Date: {new Date(exam.examDate).toLocaleDateString()}</span>
                    </div>
                  
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Time: {exam.startTime} - {exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    
                    {/* Status for practice exams */}
                    <div className="flex items-center text-sm font-medium text-purple-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Status: Ended</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full" variant="secondary" asChild>
                      <Link href={`/exams/${exam.id}?practice=true`}>
                        Practice Exam
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}