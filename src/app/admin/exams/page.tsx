"use client";

import { useState, useEffect } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Permission } from "@/interface/permission";
import { Question } from "@/interface/question";
import { SubChapter } from "@/interface/subchapter";
import { Exam } from "@/interface/exam";
import { questionService } from "@/services/question/question.service";
import { subChapterService } from "@/services/question/subchapter.service";
import { examService } from "@/services/exam/exam.service";
import { Plus, Calendar, Clock, Users, Edit, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Import services for filtering
import { examCourseService } from "@/services/question/course.service";
import { groupService } from "@/services/question/group.service";
import { subjectService } from "@/services/question/subject.service";
import { chapterService } from "@/services/question/chapter.service";

// Interface for filter options
interface FilterOptions {
  courseId?: number;
  groupId?: number;
  subjectId?: number;
  chapterId?: number;
  subChapterId?: number;
}

export default function ExamManagementPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examName, setExamName] = useState("");
  const [examDescription, setExamDescription] = useState("");
  const [examDate, setExamDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subChapters, setSubChapters] = useState<SubChapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // Filter states
  const [courses, setCourses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);

  // Load exams, questions and subchapters
  useEffect(() => {
    const loadData = async () => {
      try {
        setFetching(true);
        const [examsData, questionsData, subChaptersData, coursesData, groupsData] = await Promise.all([
          examService.getAllExams(),
          questionService.getAllQuestions(),
          subChapterService.getAllSubChapters(),
          examCourseService.getAllExamCourses(),
          groupService.getAllGroups()
        ]);
        setExams(examsData);
        setQuestions(questionsData);
        setSubChapters(subChaptersData);
        setCourses(coursesData);
        setGroups(groupsData);
        setFilteredQuestions(questionsData); // Initially show all questions
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive"
        });
      } finally {
        setFetching(false);
      }
    };

    loadData();
  }, [toast]);

  // Load subjects when group is selected
  useEffect(() => {
    const loadSubjects = async () => {
      if (filterOptions.groupId) {
        try {
          const subjectsData = await subjectService.getAllSubjects();
          setSubjects(subjectsData.filter(subject => subject.groupId === filterOptions.groupId));
        } catch (error) {
          console.error("Failed to load subjects:", error);
        }
      } else {
        setSubjects([]);
        setFilterOptions(prev => ({ ...prev, subjectId: undefined }));
      }
    };

    loadSubjects();
  }, [filterOptions.groupId]);

  // Load chapters when subject is selected
  useEffect(() => {
    const loadChapters = async () => {
      if (filterOptions.subjectId) {
        try {
          const chaptersData = await chapterService.getAllChapters();
          setChapters(chaptersData.filter(chapter => chapter.subjectId === filterOptions.subjectId));
        } catch (error) {
          console.error("Failed to load chapters:", error);
        }
      } else {
        setChapters([]);
        setFilterOptions(prev => ({ ...prev, chapterId: undefined }));
      }
    };

    loadChapters();
  }, [filterOptions.subjectId]);

  // Filter questions when filter options change
  useEffect(() => {
    const applyFilters = async () => {
      try {
        // If any filter is selected, fetch filtered questions
        if (filterOptions.courseId || filterOptions.groupId || filterOptions.subjectId || filterOptions.chapterId || filterOptions.subChapterId) {
          const filteredData = await questionService.getFilteredQuestions(
            filterOptions.courseId,
            filterOptions.groupId,
            filterOptions.subjectId,
            filterOptions.chapterId,
            filterOptions.subChapterId
          );
          setFilteredQuestions(filteredData);
        } else {
          // If no filters, show all questions
          setFilteredQuestions(questions);
        }
      } catch (error) {
        console.error("Failed to filter questions:", error);
        toast({
          title: "Error",
          description: "Failed to filter questions",
          variant: "destructive"
        });
      }
    };

    applyFilters();
  }, [filterOptions, questions, toast]);

  const handleCreateExam = async () => {
    if (!examName || !examDate || !startTime || !endTime || selectedQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select questions",
        variant: "destructive"
      });
      return;
    }

    // Validate that end time is after start time
    if (endTime <= startTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    // Validate question count
    if (selectedQuestions.length !== totalQuestions) {
      toast({
        title: "Error",
        description: `You must select exactly ${totalQuestions} questions. Currently selected: ${selectedQuestions.length}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const examData = {
        name: examName,
        description: examDescription,
        examDate: examDate, // Date only
        startTime: startTime, // Time only
        endTime: endTime, // Time only
        duration,
        totalQuestions,
        questionIds: selectedQuestions
      };

      const newExam = await examService.createExam(examData);
      setExams([...exams, newExam]);
      
      // Reset form
      setExamName("");
      setExamDescription("");
      setExamDate("");
      setStartTime("");
      setEndTime("");
      setDuration(60);
      setTotalQuestions(10);
      setSelectedQuestions([]);
      setShowCreateForm(false);
      setFilterOptions({});

      toast({
        title: "Success",
        description: "Exam created successfully"
      });
    } catch (error: any) {
      console.error("Failed to create exam:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create exam",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditExam = async () => {
    if (!editingExam || !examName || !examDate || !startTime || !endTime) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Validate that end time is after start time
    if (endTime <= startTime) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive"
      });
      return;
    }

    // Validate question count for edit
    if (selectedQuestions.length !== totalQuestions) {
      toast({
        title: "Error",
        description: `You must select exactly ${totalQuestions} questions. Currently selected: ${selectedQuestions.length}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const examData = {
        name: examName,
        description: examDescription,
        examDate: examDate, // Date only
        startTime: startTime, // Time only
        endTime: endTime, // Time only
        duration,
        totalQuestions,
        questionIds: selectedQuestions,
        isActive: editingExam.isActive
      };

      const updatedExam = await examService.updateExam(editingExam.id, examData);
      
      // Update the exam in the list
      setExams(exams.map(exam => exam.id === updatedExam.id ? updatedExam : exam));
      
      // Reset form
      setEditingExam(null);
      setExamName("");
      setExamDescription("");
      setExamDate("");
      setStartTime("");
      setEndTime("");
      setDuration(60);
      setTotalQuestions(10);
      setSelectedQuestions([]);
      setShowEditForm(false);
      setFilterOptions({});

      toast({
        title: "Success",
        description: "Exam updated successfully"
      });
    } catch (error: any) {
      console.error("Failed to update exam:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update exam",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId: number) => {
    try {
      await examService.deleteExam(examId);
      // Update the exams list by filtering out the deleted exam
      setExams(exams.filter(exam => exam.id !== examId));
      toast({
        title: "Success",
        description: "Exam deleted successfully"
      });
    } catch (error) {
      console.error("Failed to delete exam:", error);
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive"
      });
    }
  };

  const startEditing = (exam: Exam) => {
    setEditingExam(exam);
    setExamName(exam.name);
    setExamDescription(exam.description || "");
    
    // For the new structure, we need to handle the date and time separately
    const examDateObj = new Date(exam.examDate);
    setExamDate(examDateObj.toISOString().split('T')[0]);
    
    // Times are stored as strings in the new format
    setStartTime(exam.startTime);
    setEndTime(exam.endTime);
    
    setDuration(exam.duration);
    setTotalQuestions(exam.totalQuestions);
    setSelectedQuestions(exam.questions.map(q => q.id));
    setShowEditForm(true);
    setShowCreateForm(false);
  };

  const toggleQuestionSelection = (questionId: number) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== questionId));
    } else {
      if (selectedQuestions.length < totalQuestions) {
        setSelectedQuestions([...selectedQuestions, questionId]);
      } else {
        toast({
          title: "Limit reached",
          description: `You can only select ${totalQuestions} questions`,
          variant: "destructive"
        });
      }
    }
  };

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    setFilterOptions(prev => ({ ...prev, [key]: numValue }));
  };

  if (fetching) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Loading exams...</p>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[Permission.CREATE_QUESTION]}
    >
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Exam Management</h1>
            <p className="text-gray-600">Create and manage online exams</p>
          </div>
          <Button onClick={() => {
            setShowCreateForm(!showCreateForm);
            setShowEditForm(false);
            if (!showCreateForm) {
              // Reset form when opening
              setExamName("");
              setExamDescription("");
              setExamDate("");
              setStartTime("");
              setEndTime("");
              setDuration(60);
              setTotalQuestions(10);
              setSelectedQuestions([]);
              setFilterOptions({});
            }
          }}>
            <Plus className="w-4 h-4 mr-2" />
            {showCreateForm ? "Cancel" : "Create New Exam"}
          </Button>
        </div>

        {(showCreateForm || showEditForm) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{showEditForm ? "Edit Exam" : "Create New Exam"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="examName">Exam Name *</Label>
                  <Input
                    id="examName"
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    placeholder="Enter exam name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="totalQuestions">Total Questions *</Label>
                  <Input
                    id="totalQuestions"
                    type="number"
                    value={totalQuestions}
                    onChange={(e) => setTotalQuestions(Math.max(10, parseInt(e.target.value) || 10))}
                    min="10"
                  />
                </div>
                
                <div>
                  <Label htmlFor="examDate">Exam Date *</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="examDescription">Description</Label>
                  <Textarea
                    id="examDescription"
                    value={examDescription}
                    onChange={(e) => setExamDescription(e.target.value)}
                    placeholder="Enter exam description"
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Advanced filtering options */}
              <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Filter Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="courseFilter">Course</Label>
                    <select
                      id="courseFilter"
                      className="w-full p-2 border rounded bg-white text-gray-900"
                      value={filterOptions.courseId || ""}
                      onChange={(e) => handleFilterChange('courseId', e.target.value)}
                    >
                      <option value="">All Courses</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="groupFilter">Group</Label>
                    <select
                      id="groupFilter"
                      className="w-full p-2 border rounded bg-white text-gray-900"
                      value={filterOptions.groupId || ""}
                      onChange={(e) => handleFilterChange('groupId', e.target.value)}
                    >
                      <option value="">All Groups</option>
                      {groups.map(group => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subjectFilter">Subject</Label>
                    <select
                      id="subjectFilter"
                      className="w-full p-2 border rounded bg-white text-gray-900 disabled:bg-gray-100"
                      value={filterOptions.subjectId || ""}
                      onChange={(e) => handleFilterChange('subjectId', e.target.value)}
                      disabled={!filterOptions.groupId}
                    >
                      <option value="">All Subjects</option>
                      {subjects.map(subject => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="chapterFilter">Chapter</Label>
                    <select
                      id="chapterFilter"
                      className="w-full p-2 border rounded bg-white text-gray-900 disabled:bg-gray-100"
                      value={filterOptions.chapterId || ""}
                      onChange={(e) => handleFilterChange('chapterId', e.target.value)}
                      disabled={!filterOptions.subjectId}
                    >
                      <option value="">All Chapters</option>
                      {chapters.map(chapter => (
                        <option key={chapter.id} value={chapter.id}>
                          {chapter.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="subChapterFilter">SubChapter</Label>
                    <select
                      id="subChapterFilter"
                      className="w-full p-2 border rounded bg-white text-gray-900 disabled:bg-gray-100"
                      value={filterOptions.subChapterId || ""}
                      onChange={(e) => handleFilterChange('subChapterId', e.target.value)}
                      disabled={!filterOptions.chapterId}
                    >
                      <option value="">All SubChapters</option>
                      {subChapters
                        .filter(sc => !filterOptions.chapterId || sc.chapterId === filterOptions.chapterId)
                        .map(subChapter => (
                          <option key={subChapter.id} value={subChapter.id}>
                            {subChapter.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Select Questions ({selectedQuestions.length}/{totalQuestions})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                  {filteredQuestions.map(question => (
                    <div 
                      key={question.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedQuestions.includes(question.id) 
                          ? "border-primary bg-primary/10" 
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                      onClick={() => toggleQuestionSelection(question.id)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm line-clamp-2">{question.questionText}</p>
                        <div className="flex items-center text-xs text-gray-500 ml-2">
                          <Users className="w-3 h-3 mr-1" />
                          {question.id}
                        </div>
                      </div>
                      {question.previousYearInfo && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-1">
                          {question.previousYearInfo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                {selectedQuestions.length !== totalQuestions && (
                  <div className="mt-2 text-sm text-red-500">
                    Please select exactly {totalQuestions} questions. Currently selected: {selectedQuestions.length}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button 
                  onClick={showEditForm ? handleEditExam : handleCreateExam} 
                  disabled={loading || selectedQuestions.length !== totalQuestions}
                >
                  {loading ? (showEditForm ? "Updating..." : "Creating...") : (showEditForm ? "Update Exam" : "Create Exam")}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>Upcoming Exams</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No exams created yet</p>
                <Button 
                  className="mt-4" 
                  onClick={() => {
                    setShowCreateForm(true);
                    setShowEditForm(false);
                  }}
                >
                  Create Your First Exam
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(exam => (
                  <div key={exam.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">{exam.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        exam.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {exam.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-2">{exam.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{new Date(exam.examDate).toLocaleDateString()} {exam.startTime} - {exam.endTime}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{exam.totalQuestions} questions</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{exam.duration} minutes</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => startEditing(exam)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteExam(exam.id)}
                      >
                        Delete
                      </Button>
                    </div>
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