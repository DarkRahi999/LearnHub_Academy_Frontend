"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { examService, ExamSubmissionResponse, ExamAnswer } from "@/services/exam/exam.service";
import { Exam } from "@/interface/exam";
import { StartExamResponse } from "@/services/exam/exam.service";
import { Clock, CheckCircle, XCircle } from "lucide-react";

// Define interface for answer submission
interface AnswerSubmission {
  questionId: number;
  answer: string;
}

// Remove useSearchParams and get examId from props instead
export default function TakeExamPage() {
  const { toast } = useToast();
  const { isAuthenticated, /*user,*/ isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const examId = params.id as string; // Get examId from params instead of searchParams
  const isPracticeMode = searchParams.get('practice') === 'true'; // Check for practice mode
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [results, setResults] = useState<{questionId: number, selected: string, correct: string, isCorrect: boolean}[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading exam...");
  const [timeUntilStart, setTimeUntilStart] = useState<string>("");
  const [isExamAvailable, setIsExamAvailable] = useState<boolean>(false);
  const [hasAttemptedExam, setHasAttemptedExam] = useState<boolean>(false);
  const [examAttemptChecked, setExamAttemptChecked] = useState<boolean>(false);
  const [showUnansweredConfirmation, setShowUnansweredConfirmation] = useState<boolean>(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSubmitTriggeredRef = useRef<boolean>(false); // Ref to track if auto-submit has been triggered

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Cleanup function to clear timer when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        console.log("Clearing timer on component unmount");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Load exam data
  useEffect(() => {
    const loadExam = async () => {
      // Wait for auth to be loaded
      if (authLoading) return;
      
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      
      if (!examId) {
        router.push('/exams');
        return;
      }
      
      try {
        setLoadingMessage("Loading exam...");
        setLoading(true);
        const examData = await examService.getExamById(parseInt(examId));
        setExam(examData);
        
        // Set initial time left to exam duration, but it will be updated when exam starts
        setTimeLeft(examData.duration * 60); // Convert minutes to seconds
        
        // Debug log to see the actual date values
        console.log("Exam data:", examData);
        console.log("Exam date:", examData.examDate);
        console.log("Start time:", examData.startTime);
        console.log("End time:", examData.endTime);
        
        // Add a small delay to prevent loading screen from flashing
        await new Promise(resolve => setTimeout(resolve, 300));
      } catch (error) {
        console.error("Failed to load exam:", error);
        toast({
          title: "Error",
          description: "Failed to load exam",
          variant: "destructive"
        });
        router.push('/exams');
      } finally {
        setLoading(false);
      }
    };

    loadExam();
  }, [examId, router, toast, isAuthenticated, authLoading]);

  // Check if user has already attempted this exam
  useEffect(() => {
    const checkExamAttempt = async () => {
      if (!examId || authLoading || !isAuthenticated) return;
      
      try {
        const response = await examService.checkUserExamAttempt(parseInt(examId));
        setHasAttemptedExam(response.hasAttempted);
        setExamAttemptChecked(true);
      } catch (error) {
        console.error("Failed to check exam attempt:", error);
        setExamAttemptChecked(true); // Still set as checked to avoid blocking UI
      }
    };

    checkExamAttempt();
  }, [examId, isAuthenticated, authLoading]);

  // Handle exam submission (both manual and auto)
  const handleSubmitExam = useCallback(async (isAutoSubmit: boolean = false, forceSubmit: boolean = false) => {
    if (!exam) return;
    
    // Prevent double submission with additional logging
    if (examSubmitted) {
      return;
    }
    
    // For practice mode, we always treat it as a practice submission
    const isPracticeSubmission = isPracticeMode;
    
    // Only show the unanswered questions warning for manual submissions in real exam mode
    if (!isAutoSubmit && !isPracticeSubmission && !forceSubmit) {
      // Check if all questions have been answered
      const unansweredQuestions = exam.questions.filter(q => !selectedAnswers[q.id]);
      
      if (unansweredQuestions.length > 0) {
        // The confirmation dialog is handled in handleManualSubmitExam
        return;
      }
    }
    
    try {
      if (isPracticeSubmission) {
        // For practice exams, just calculate results locally without submitting to backend
        const resultsData = exam.questions.map(question => ({
          questionId: question.id,
          selected: selectedAnswers[question.id] || "",
          correct: question.correctAnswer,
          isCorrect: selectedAnswers[question.id] === question.correctAnswer
        }));
        
        setResults(resultsData);
        setExamSubmitted(true);
        
        // Use setTimeout to avoid calling toast during render
        setTimeout(() => {
          toast({
            title: "Practice Exam Completed",
            description: "Your practice exam results are displayed below. No data was saved.",
            variant: "default"
          });
        }, 0);
        return;
      }
      
      // For real exams, submit to backend
      const answers: AnswerSubmission[] = exam.questions.map(question => ({
        questionId: question.id,
        answer: selectedAnswers[question.id] || ""
      }));
      
      const response: ExamSubmissionResponse = await examService.submitExamAnswers(parseInt(examId), answers);
      
      // Map the backend response to the format expected by the results display
      // Handle both auto-submit and manual submit cases properly
      let resultsData;
      if (response && response.answers) {
        // Backend response format
        resultsData = exam.questions.map(question => {
          const answer = response.answers.find((a: ExamAnswer) => a.questionId === question.id);
          return {
            questionId: question.id,
            selected: answer?.userAnswer || "",
            correct: question.correctAnswer,
            isCorrect: answer?.userAnswer === question.correctAnswer
          };
        });
      } else {
        // Fallback to local calculation if backend response is not as expected
        resultsData = exam.questions.map(question => ({
          questionId: question.id,
          selected: selectedAnswers[question.id] || "",
          correct: question.correctAnswer,
          isCorrect: selectedAnswers[question.id] === question.correctAnswer
        }));
      }
      
      setResults(resultsData);
      setExamSubmitted(true);
      
      // Use setTimeout to avoid calling toast during render
      setTimeout(() => {
        toast({
          title: "Exam Submitted",
          description: "Your exam has been submitted successfully!",
          variant: "default"
        });
      }, 0);
    } catch (error) {
      console.error("Failed to submit exam:", error);
      // For auto-submit, we should still show results even if there's an error
      if (isAutoSubmit) {
        // Calculate results locally as fallback
        const resultsData = exam.questions.map(question => ({
          questionId: question.id,
          selected: selectedAnswers[question.id] || "",
          correct: question.correctAnswer,
          isCorrect: selectedAnswers[question.id] === question.correctAnswer
        }));
        
        setResults(resultsData);
        setExamSubmitted(true);
        
        setTimeout(() => {
          toast({
            title: "Exam Auto-Submitted",
            description: "Your exam was auto-submitted. Results calculated locally.",
            variant: "default"
          });
        }, 0);
        return;
      }
      
      // Use setTimeout to avoid calling toast during render
      setTimeout(() => {
        toast({
          title: "Error",
          description: (error as Error).message || "Failed to submit exam",
          variant: "destructive"
        });
      }, 0);
    }
  }, [exam, examSubmitted, isPracticeMode, selectedAnswers, examId, toast]);

  // Calculate time until exam starts
  const calculateTimeUntilStart = useCallback((examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        setTimeUntilStart("Invalid exam date/time");
        setIsExamAvailable(false);
        return;
      }
      
      // If in practice mode, exam is always available
      if (isPracticeMode) {
        setTimeUntilStart("Practice Mode");
        setIsExamAvailable(true);
        return;
      }
      
      let examStartTime: Date;
      let examEndTime: Date;
      
      // Handle different date formats for start time
      if (examDate.includes('T')) {
        // If it's already a full date-time string
        const datePart = examDate.split('T')[0];
        examStartTime = new Date(`${datePart}T${startTime}`);
      } else {
        // If it's just a date string
        examStartTime = new Date(`${examDate}T${startTime}`);
      }
      
      // Handle different date formats for end time
      if (examDate.includes('T')) {
        // If it's already a full date-time string
        const datePart = examDate.split('T')[0];
        examEndTime = new Date(`${datePart}T${endTime}`);
      } else {
        // If it's just a date string
        examEndTime = new Date(`${examDate}T${endTime}`);
      }
      
      // Check if the dates are valid
      if (isNaN(examStartTime.getTime()) || isNaN(examEndTime.getTime())) {
        setTimeUntilStart("Invalid exam date/time format");
        setIsExamAvailable(false);
        return;
      }
      
      const now = new Date();
      
      // Check if exam has already ended
      if (now > examEndTime) {
        setTimeUntilStart("Exam has ended");
        setIsExamAvailable(false);
        return;
      }
      
      // Check if exam has started
      if (now >= examStartTime) {
        setTimeUntilStart("Exam is now available!");
        setIsExamAvailable(true);
        return;
      }
      
      // Exam hasn't started yet, calculate time until start
      const timeDiff = examStartTime.getTime() - now.getTime();
      
      // Handle negative time differences
      if (timeDiff < 0) {
        setTimeUntilStart("Exam should have started already");
        return;
      }
      
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      let timeRemaining = "";
      if (days > 0) {
        timeRemaining = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (hours > 0) {
        timeRemaining = `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        timeRemaining = `${minutes}m ${seconds}s`;
      } else {
        timeRemaining = `${seconds}s`;
      }
      
      setTimeUntilStart(timeRemaining);
      setIsExamAvailable(timeDiff <= 0);
    } catch (error) {
      console.error("Error calculating time until start:", error);
      setTimeUntilStart("Error calculating time");
      setIsExamAvailable(false);
    }
  }, [isPracticeMode]);

  // Update countdown timer until exam starts
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (exam && !examStarted) {
      // Initial calculation
      calculateTimeUntilStart(exam.examDate, exam.startTime, exam.endTime);
      
      // Update every second
      interval = setInterval(() => {
        calculateTimeUntilStart(exam.examDate, exam.startTime, exam.endTime);
      }, 1000);
    }
    
    // Clean up interval on unmount or when dependencies change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [exam, examStarted, calculateTimeUntilStart]);

  // Timer effect for exam duration (handles UI display and auto-submit for both real and practice exams)
  useEffect(() => {
    // Reset the auto-submit trigger flag when exam state changes
    if (examStarted && timeLeft > 0 && !examSubmitted) {
      autoSubmitTriggeredRef.current = false;
    }
    
    // Clear any existing interval first
    if (timerRef.current) {
      console.log("Clearing existing timer interval");
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Apply timer for both real and practice exams
    if (examStarted && timeLeft > 0 && !examSubmitted) {
      console.log("Starting timer with timeLeft:", timeLeft);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1 && !examSubmitted && !autoSubmitTriggeredRef.current) {
            autoSubmitTriggeredRef.current = true; // Mark auto-submit as triggered
            // Auto-submit when duration expires for both real and practice exams
            handleSubmitExam(true); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Clean up interval on unmount or when dependencies change
    return () => {
      if (timerRef.current) {
        console.log("Clearing timer interval on cleanup");
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [examStarted, timeLeft, examSubmitted, handleSubmitExam]);

  // Remove any secondary timer effects to prevent double auto-submit
  // Only the primary timer above should handle auto-submit for both real and practice exams

  const handleStartExam = async () => {
    if (!isExamAvailable && !isPracticeMode) return;
    if (!exam) return;
    
    // Reset the auto-submit trigger flag when starting a new exam
    autoSubmitTriggeredRef.current = false;
    
    // Check if exam time has ended to determine if this should be practice mode
    const now = new Date();
    const examDateTimeEnd = new Date(exam.examDate);
    const [endHours, endMinutes] = exam.endTime.split(':').map(Number);
    examDateTimeEnd.setHours(endHours, endMinutes, 0, 0);
    
    const isExamEnded = now > examDateTimeEnd;
    
    // If in practice mode or exam has ended, start in practice mode
    if (isPracticeMode || isExamEnded) {
      // Just set the exam as started and use the full duration
      setTimeLeft(exam.duration * 60); // Convert minutes to seconds
      setExamStarted(true);
      toast({
        title: "Practice Mode",
        description: "You are now in practice mode. Your results will not be saved. Exam will auto-submit after " + exam.duration + " minutes."
      });
      return;
    }
    
    // Check if user has already attempted this exam
    if (hasAttemptedExam) {
      toast({
        title: "Error",
        description: "You have already taken this exam.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoadingMessage("Starting exam...");
      setLoading(true); // Show loading state during exam start
      // Call the backend API to start the exam
      const response: StartExamResponse = await examService.startExam(parseInt(examId));
      if (response.success) {
        // Calculate the actual remaining time based on current time and exam end time
        const now = new Date();
        const examDateTimeEnd = new Date(exam.examDate);
        const [endHours, endMinutes] = exam.endTime.split(':').map(Number);
        examDateTimeEnd.setHours(endHours, endMinutes, 0, 0);
        
        // Calculate remaining time in seconds
        const timeDiff = examDateTimeEnd.getTime() - now.getTime();
        const remainingTimeInSeconds = Math.max(0, Math.floor(timeDiff / 1000));
        
        // Set the time left to the actual remaining time
        setTimeLeft(remainingTimeInSeconds);
        
        // Add a small delay to make the transition feel smoother
        await new Promise(resolve => setTimeout(resolve, 300));
        setExamStarted(true);
        toast({
          title: "Exam Started",
          description: "You can now begin answering questions. Good luck!"
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Failed to start exam:", error);
      
      // Handle specific error for already taken exam
      if ((error as Error).message && (error as Error).message.includes("already taken")) {
        toast({
          title: "Error",
          description: "You have already taken this exam.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Error",
        description: "Failed to start exam",
        variant: "destructive"
      });
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (exam?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Wrapper function for manual exam submission (button click)
  const handleManualSubmitExam = () => {
    // Check if all questions have been answered
    if (exam) {
      const unansweredQuestions = exam.questions.filter(q => !selectedAnswers[q.id]);
      
      if (unansweredQuestions.length > 0 && !isPracticeMode) {
        // Show confirmation dialog
        setShowUnansweredConfirmation(true);
        return;
      }
    }
    
    // If no unanswered questions or in practice mode, submit directly
    handleSubmitExam(false);
  };

  // Wrapper function for forced exam submission (after confirmation)
  const handleForcedSubmitExam = () => {
    setShowUnansweredConfirmation(false);
    handleSubmitExam(false, true);
  };
  
  // Function to cancel exam submission
  const handleCancelSubmitExam = () => {
    setShowUnansweredConfirmation(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state while auth is being checked
  if (authLoading || loading || !examAttemptChecked) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by useEffect
  }

  if (!exam) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Exam not found</p>
        </div>
      </div>
    );
  }

  if (!examStarted) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">{exam.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">{exam.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" />
                  <span>Duration: {exam.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Questions: {exam.totalQuestions}</span>
                </div>
              </div>
              
              {/* Time remaining display */}
              <div className="pt-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-blue-600" />
                    <span className="font-medium text-blue-800">Time until exam starts:</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 mt-2 text-center">
                    {timeUntilStart}
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <h3 className="font-semibold mb-2">Instructions:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>You have {exam.duration} minutes to complete the exam</li>
                  <li>Answer all questions to the best of your ability</li>
                  <li>You can navigate between questions using the buttons</li>
                  <li>Click &quot;Submit Exam&quot; when you&apos;re finished</li>
                </ul>
              </div>
              
              <div className="pt-6">
                {hasAttemptedExam && !isPracticeMode ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 text-center">
                      <strong>Note:</strong> You have already taken this exam and cannot take it again.
                    </p>
                  </div>
                ) : null}
                
                <Button 
                  onClick={handleStartExam} 
                  className="w-full"
                  disabled={(!isExamAvailable && !isPracticeMode) || (hasAttemptedExam && !isPracticeMode)}
                >
                  {hasAttemptedExam && !isPracticeMode ? "Exam Already Taken" : 
                   isPracticeMode ? "Start Practice Exam" :
                   isExamAvailable ? "Start Exam" : "Exam Not Available Yet"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (examSubmitted) {
    const correctAnswers = results.filter(r => r.isCorrect).length;
    const totalQuestions = results.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    // Use the isPracticeMode variable we already have
    const isCurrentlyPracticeMode = isPracticeMode;
    
    // Calculate letter grade based on percentage
    let letterGrade = "F";
    let gradeColor = "bg-red-100 text-red-800";
    
    if (percentage >= 90) {
      letterGrade = "A+";
      gradeColor = "bg-green-100 text-green-800";
    } else if (percentage >= 80) {
      letterGrade = "A";
      gradeColor = "bg-green-100 text-green-800";
    } else if (percentage >= 70) {
      letterGrade = "A-";
      gradeColor = "bg-green-100 text-green-800";
    } else if (percentage >= 60) {
      letterGrade = "B";
      gradeColor = "bg-yellow-100 text-yellow-800";
    } else if (percentage >= 50) {
      letterGrade = "C";
      gradeColor = "bg-yellow-100 text-yellow-800";
    } else if (percentage >= 40) {
      letterGrade = "Pass";
      gradeColor = "bg-orange-100 text-orange-800";
    } else {
      letterGrade = "Fail";
      gradeColor = "bg-red-100 text-red-800";
    }
    
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{exam.name} - {isCurrentlyPracticeMode ? "Practice Results" : "Results"}</CardTitle>
          </CardHeader>
          <CardContent>
            {isCurrentlyPracticeMode ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-center">
                  <strong>Note:</strong> This was a practice exam. Your results are not saved or recorded.
                </p>
              </div>
            ) : null}
            
            <div className="text-center mb-8">
              <div className="text-4xl font-bold mb-2">
                {correctAnswers}/{totalQuestions}
              </div>
              <div className="text-xl mb-4">
                {percentage}% Correct
              </div>
              <div className={`inline-block px-4 py-2 rounded-full ${gradeColor}`}>
                {letterGrade}
              </div>
            </div>
            
            <div className="space-y-6">
              {exam.questions.map((question, index) => {
                const result = results.find(r => r.questionId === question.id);
                return (
                  <Card key={question.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start">
                        <div className={`mr-3 mt-1 ${
                          result?.isCorrect ? "text-green-500" : "text-red-500"
                        }`}>
                          {result?.isCorrect ? 
                            <CheckCircle className="w-5 h-5" /> : 
                            <XCircle className="w-5 h-5" />
                          }
                        </div>
                        <div>
                          <h3 className="font-medium">Question {index + 1}: {question.questionText}</h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                            <div className={`p-2 rounded ${
                              question.correctAnswer === "A" ? "bg-green-100" : 
                              selectedAnswers[question.id] === "A" ? "bg-red-100" : ""
                            }`}>
                              A. {question.optionA}
                            </div>
                            <div className={`p-2 rounded ${
                              question.correctAnswer === "B" ? "bg-green-100" : 
                              selectedAnswers[question.id] === "B" ? "bg-red-100" : ""
                            }`}>
                              B. {question.optionB}
                            </div>
                            <div className={`p-2 rounded ${
                              question.correctAnswer === "C" ? "bg-green-100" : 
                              selectedAnswers[question.id] === "C" ? "bg-red-100" : ""
                            }`}>
                              C. {question.optionC}
                            </div>
                            <div className={`p-2 rounded ${
                              question.correctAnswer === "D" ? "bg-green-100" : 
                              selectedAnswers[question.id] === "D" ? "bg-red-100" : ""
                            }`}>
                              D. {question.optionD}
                            </div>
                          </div>
                          
                          {!result?.isCorrect && (
                            <div className="mt-3 text-sm">
                              <p className="text-gray-600">
                                Your answer: <span className="font-medium">{selectedAnswers[question.id] || "Not answered"}</span>
                              </p>
                              <p className="text-green-600">
                                Correct answer: <span className="font-medium">{question.correctAnswer}</span>
                              </p>
                              {question.description && (
                                <p className="mt-2 text-blue-600">
                                  Explanation: {question.description}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <div className="flex justify-center mt-8">
                <Button onClick={() => router.push('/exams')}>
                  Back to Exams
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  
  // Calculate how many questions have been answered
  const answeredCount = exam.questions.filter(q => selectedAnswers[q.id]).length;
  const totalQuestions = exam.questions.length;
  const completionPercentage = Math.round((answeredCount / totalQuestions) * 100);

  // Function to jump to a specific question
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{exam.name}</h1>
        <div className="flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full">
          <Clock className="w-5 h-5 mr-2" />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>
      </div>
      
      {/* Time expired message for practice exams */}
      {isPracticeMode && timeLeft <= 0 && !examSubmitted && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
          <p className="text-yellow-800 font-medium">Time has expired for this practice exam</p>
          <p className="text-yellow-700 text-sm mt-1">Please submit your exam to see the results</p>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      {showUnansweredConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">Unanswered Questions</h3>
            <p className="mb-4">
              You have unanswered questions. Are you sure you want to submit the exam?
            </p>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleCancelSubmitExam}>
                Cancel
              </Button>
              <Button onClick={handleForcedSubmitExam}>
                Submit Anyway
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Navigation Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="text-sm text-gray-600">
                  {answeredCount}/{totalQuestions} answered ({completionPercentage}% complete)
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => jumpToQuestion(index)}
                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                      index === currentQuestionIndex
                        ? "bg-blue-600 text-white"
                        : selectedAnswers[exam.questions[index].id]
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              
              <div className="mt-4 text-xs text-gray-600">
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span>Current question</span>
                </div>
                <div className="flex items-center mb-1">
                  <div className="w-3 h-3 bg-green-100 rounded-full mr-2 border border-green-300"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-100 rounded-full mr-2 border border-gray-300"></div>
                  <span>Not answered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Exam Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>Question {currentQuestionIndex + 1} of {exam.questions.length}</span>
                  <span>{answeredCount}/{totalQuestions} answered ({completionPercentage}% complete)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Question */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4">{currentQuestion.questionText}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { label: "A", value: currentQuestion.optionA },
                    { label: "B", value: currentQuestion.optionB },
                    { label: "C", value: currentQuestion.optionC },
                    { label: "D", value: currentQuestion.optionD }
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnswers[currentQuestion.id] === label
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestion.id, label)}
                    >
                      <span className="font-medium mr-2">{label}.</span> {value}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  Previous
                </Button>
                
                {(currentQuestionIndex === exam.questions.length - 1 || (isPracticeMode && timeLeft <= 0)) ? (
                  <Button onClick={handleManualSubmitExam}>
                    {timeLeft <= 0 ? "Time Expired - Submit Exam" : "Submit Exam"}
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Next
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}