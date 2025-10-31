"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useRouter, useParams } from "next/navigation";
import { examService } from "@/services/exam/exam.service";
import { Exam } from "@/interface/exam";
import { Clock, CheckCircle, XCircle } from "lucide-react";

// Remove useSearchParams and get examId from props instead
export default function TakeExamPage() {
  const { toast } = useToast();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string; // Get examId from params instead of searchParams
  
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
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

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
        
        // Calculate initial time until start
        calculateTimeUntilStart(examData.examDate, examData.startTime, examData.endTime);
        
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

  // Calculate time until exam starts
  const calculateTimeUntilStart = (examDate: string, startTime: string, endTime: string) => {
    try {
      // Validate input parameters
      if (!examDate || !startTime || !endTime) {
        setTimeUntilStart("Invalid exam date/time");
        setIsExamAvailable(false);
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
  };

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
  }, [exam, examStarted]);

  // Timer effect for exam duration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (examStarted && timeLeft > 0 && !examSubmitted) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Clean up interval on unmount or when dependencies change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [examStarted, timeLeft, examSubmitted]);

  // Additional effect to check if exam time has expired based on end time
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (examStarted && exam && timeLeft > 0 && !examSubmitted) {
      interval = setInterval(() => {
        // Check if current time has passed the exam end time
        const now = new Date();
        const examDateTimeEnd = new Date(exam.examDate);
        const [endHours, endMinutes] = exam.endTime.split(':').map(Number);
        examDateTimeEnd.setHours(endHours, endMinutes, 0, 0);
        
        // If current time is past exam end time, submit the exam automatically
        if (now >= examDateTimeEnd) {
          handleSubmitExam(true); // Pass true to indicate auto-submit
        }
      }, 1000);
    }

    // Clean up interval on unmount or when dependencies change
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [examStarted, exam, timeLeft, examSubmitted]);

  const handleStartExam = async () => {
    if (!isExamAvailable) return;
    if (!exam) return;
    
    try {
      setLoadingMessage("Starting exam...");
      setLoading(true); // Show loading state during exam start
      // Call the backend API to start the exam
      const response = await examService.startExam(parseInt(examId));
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

  const handleSubmitExam = async (isAutoSubmit: boolean = false) => {
    if (!exam) return;
    
    // Only show the unanswered questions warning for manual submissions
    if (!isAutoSubmit) {
      // Check if all questions have been answered
      const unansweredQuestions = exam.questions.filter(q => !selectedAnswers[q.id]);
      if (unansweredQuestions.length > 0) {
        const confirm = window.confirm(
          `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit the exam?`
        );
        if (!confirm) {
          // Optionally jump to the first unanswered question
          const firstUnansweredIndex = exam.questions.findIndex(q => !selectedAnswers[q.id]);
          if (firstUnansweredIndex !== -1) {
            setCurrentQuestionIndex(firstUnansweredIndex);
          }
          return;
        }
      }
    }
    
    try {
      // In a real implementation, this would submit to the backend
      // For now, we'll just calculate results locally
      
      // Calculate results
      const examResults = exam.questions.map(question => {
        const selected = selectedAnswers[question.id] || "";
        const isCorrect = selected === question.correctAnswer;
        return {
          questionId: question.id,
          selected,
          correct: question.correctAnswer,
          isCorrect
        };
      });
      
      setResults(examResults);
      setExamSubmitted(true);
      
      // We don't need to manually clear intervals anymore as useEffect handles cleanup
    } catch (error) {
      console.error("Failed to submit exam:", error);
      toast({
        title: "Error",
        description: "Failed to submit exam",
        variant: "destructive"
      });
    }
  };
  
  // Wrapper function for manual exam submission (button click)
  const handleManualSubmitExam = () => {
    handleSubmitExam(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Show loading state while auth is being checked
  if (authLoading || loading) {
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
                  <li>Click "Submit Exam" when you're finished</li>
                </ul>
              </div>
              
              <div className="pt-6">
                <Button 
                  onClick={handleStartExam} 
                  className="w-full"
                  disabled={!isExamAvailable}
                >
                  {isExamAvailable ? "Start Exam" : "Exam Not Available Yet"}
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
            <CardTitle className="text-2xl">{exam.name} - Results</CardTitle>
          </CardHeader>
          <CardContent>
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
                          
                          {question.description && (
                            <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                              <strong>Explanation:</strong> {question.description}
                            </div>
                          )}
                          
                          <div className="mt-2 text-sm">
                            <span className="font-medium">Your answer:</span> {selectedAnswers[question.id] || "Not answered"}
                            <span className="mx-2">|</span>
                            <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="mt-8 text-center">
              <Button onClick={() => router.push('/exams')}>
                Back to Exams
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;
  
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
                
                {currentQuestionIndex === exam.questions.length - 1 ? (
                  <Button onClick={handleManualSubmitExam}>
                    Submit Exam
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