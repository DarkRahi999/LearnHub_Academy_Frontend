"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { examService } from "@/services/exam/exam.service";
import { Exam } from "@/interface/exam";
import { Calendar, Clock, Users, Play } from "lucide-react";
import Link from "next/link";

export default function ExamsPage() {
  const { user } = useAuth();
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

  // Calculate time remaining for each exam
  const calculateTimeRemaining = useCallback((examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        return "Soon";
      }
      
      // Parse the date - handle different formats
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
        return "Soon";
      }
      
      const now = new Date();
      
      // Check if exam has ended
      if (now > endDateTime) {
        return "Exam has ended";
      }
      
      // Check if exam hasn't started yet
      if (now < startDateTime) {
        const diff = startDateTime.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
      }
      
      // Exam is currently ongoing
      return "Exam is ongoing";
    } catch (error) {
      console.error("Error calculating time remaining:", error);
      return "Soon";
    }
  }, []);

  // Update time remaining for all exams
  useEffect(() => {
    const updateAllTimes = () => {
      const newTimeRemaining: Record<number, string> = {};
      exams.forEach(exam => {
        newTimeRemaining[exam.id] = calculateTimeRemaining(exam.examDate, exam.startTime, exam.endTime);
      });
      setTimeRemaining(newTimeRemaining);
    };

    // Initial update
    updateAllTimes();

    // Update every second
    const interval = setInterval(updateAllTimes, 1000);

    return () => clearInterval(interval);
  }, [exams, calculateTimeRemaining]);

  // Function to determine exam status based on date and time
  const getExamStatus = (examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        return "Unknown";
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
        return "Unknown";
      }
      
      const now = new Date();
      
      // Check if exam has ended
      if (now > endDateTime) {
        return "Ended";
      }
      
      // Check if exam is currently ongoing
      if (now >= startDateTime && now <= endDateTime) {
        return "Ongoing";
      }
      
      // Exam hasn't started yet
      return "Upcoming";
    } catch (error) {
      console.error("Error calculating exam status:", error);
      return "Unknown";
    }
  };

  const formatExamStartTime = (examDate: string, startTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime) {
        return "Invalid date/time";
      }
      
      // Handle different date formats
      let examStartTime: Date;
      if (examDate.includes('T')) {
        // If it's already a full date-time string
        const datePart = examDate.split('T')[0];
        examStartTime = new Date(`${datePart}T${startTime}`);
      } else {
        // If it's just a date string
        examStartTime = new Date(`${examDate}T${startTime}`);
      }
      
      // Check if the date is valid
      if (isNaN(examStartTime.getTime())) {
        return "Invalid date/time format";
      }
      
      return examStartTime.toLocaleString();
    } catch (error) {
      console.error("Error formatting exam start time:", error);
      return "Error formatting date";
    }
  };

  const formatExamDateTime = (examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        return "Invalid date/time";
      }
      
      const startDate = new Date(examDate);
      
      // Check if the date is valid
      if (isNaN(startDate.getTime())) {
        return "Invalid date format";
      }
      
      return `${startDate.toLocaleDateString()} ${startTime} - ${endTime}`;
    } catch (error) {
      console.error("Error formatting exam date time:", error);
      return "Error formatting date";
    }
  };

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
        <h1 className="text-3xl font-bold">Available Exams</h1>
        <p className="text-gray-600">Check out the upcoming exams and test your knowledge</p>
      </div>

      {exams.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No exams available at the moment</p>
          <p className="text-gray-400 mt-2">Check back later for new exams</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map(exam => {
            const examStatus = getExamStatus(exam.examDate, exam.startTime, exam.endTime);
            return (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span>{exam.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      examStatus === "Ongoing" ? "bg-green-100 text-green-800" :
                      examStatus === "Ended" ? "bg-red-100 text-red-800" :
                      exam.isActive ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {examStatus === "Ongoing" ? "Ongoing" :
                       examStatus === "Ended" ? "Ended" :
                       exam.isActive ? "Active" : "Inactive"}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{exam.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Starts: {formatExamStartTime(exam.examDate, exam.startTime)}</span>
                    </div>
                  
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-2 text-gray-500" />
                      <span>Duration: {exam.duration} minutes</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{exam.totalQuestions} questions</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-blue-600 font-medium">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Starts in: {
                        timeRemaining[exam.id] && 
                        !timeRemaining[exam.id].includes("Invalid") && 
                        !timeRemaining[exam.id].includes("Error") ? 
                        timeRemaining[exam.id] : 
                        "Soon"
                      }</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full" asChild disabled={!exam.isActive || examStatus === "Ended"}>
                      <Link href={`/exams/${exam.id}`}>
                        <Play className="w-4 h-4 mr-2" />
                        {examStatus === "Ongoing" ? "Join Exam" :
                         examStatus === "Ended" ? "Exam Ended" :
                         exam.isActive ? "Start Exam" : "Exam Not Available"}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}