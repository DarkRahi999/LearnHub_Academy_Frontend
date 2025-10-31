"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { questionService } from "@/services/question/question.service";
import { groupService } from "@/services/question/group.service";
import { subjectService } from "@/services/question/subject.service";
import { chapterService } from "@/services/question/chapter.service";
import { subChapterService } from "@/services/question/subchapter.service";
import { CreateQuestionDto } from "@/interface/question";
import { Group } from "@/interface/group";
import { Subject } from "@/interface/subject";
import { Chapter } from "@/interface/chapter";
import { SubChapter } from "@/interface/subchapter";
import { ExamCourse } from "@/interface/examCourse";
import examCourseService from "@/services/question/course.service";

interface QuestionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  // Default values for hierarchy selection
  defaultCourseId?: number;
  defaultGroupId?: number;
  defaultSubjectId?: number;
  defaultChapterId?: number;
  defaultSubChapterId?: number;
}

interface FormErrors {
  questionText?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  courseId?: string;
  groupId?: string;
  subjectId?: string;
  chapterId?: string;
  subChapterId?: string;
}

export function QuestionForm({ 
  onSuccess,
  onCancel,
  defaultCourseId,
  defaultGroupId,
  defaultSubjectId,
  defaultChapterId,
  defaultSubChapterId
}: QuestionFormProps) {
  // Form state
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [description, setDescription] = useState("");
  const [previousYearInfo, setPreviousYearInfo] = useState("");

  // Selection state - initialized with default values if provided
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(defaultCourseId || null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(defaultGroupId || null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(defaultSubjectId || null);
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(defaultChapterId || null);
  const [selectedSubChapterId, setSelectedSubChapterId] = useState<number | null>(defaultSubChapterId || null);

  // Data for dropdowns
  const [courses, setCourses] = useState<ExamCourse[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subChapters, setSubChapters] = useState<SubChapter[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Move function declarations before their usage
  const loadSubChapters = useCallback(async (chapterId: number) => {
    try {
      const data = await subChapterService.getAllSubChapters();
      const filteredSubChapters = data.filter(subChapter => subChapter.chapterId === chapterId);
      setSubChapters(filteredSubChapters);
    } catch (error) {
      console.error("Failed to load subchapters:", error);
    }
  }, []);

  const loadChapters = useCallback(async (subjectId: number) => {
    try {
      const data = await chapterService.getAllChapters();
      const filteredChapters = data.filter(chapter => chapter.subjectId === subjectId);
      setChapters(filteredChapters);
      // If we have a default chapter ID that matches this subject, load its subchapters
      if (defaultChapterId && filteredChapters.some(c => c.id === defaultChapterId)) {
        loadSubChapters(defaultChapterId);
      }
    } catch (error) {
      console.error("Failed to load chapters:", error);
    }
  }, [defaultChapterId, loadSubChapters]);

  const loadSubjects = useCallback(async (groupId: number) => {
    try {
      const data = await subjectService.getAllSubjects();
      const filteredSubjects = data.filter(subject => subject.groupId === groupId);
      setSubjects(filteredSubjects);
      // If we have a default subject ID that matches this group, load its chapters
      if (defaultSubjectId && filteredSubjects.some(s => s.id === defaultSubjectId)) {
        loadChapters(defaultSubjectId);
      }
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  }, [defaultSubjectId, loadChapters]);

  const loadGroups = useCallback(async (courseId: number) => {
    try {
      const data = await groupService.getAllGroups();
      const filteredGroups = data.filter(group => group.courseId === courseId);
      setGroups(filteredGroups);
      // If we have a default group ID that matches this course, load its subjects
      if (defaultGroupId && filteredGroups.some(g => g.id === defaultGroupId)) {
        loadSubjects(defaultGroupId);
      }
    } catch (error) {
      console.error("Failed to load groups:", error);
    }
  }, [defaultGroupId, loadSubjects]);

  const loadCourses = useCallback(async () => {
    try {
      const data = await examCourseService.getAllExamCourses();
      setCourses(data);
      // If we have a default course ID, load its groups
      if (defaultCourseId) {
        loadGroups(defaultCourseId);
      }
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  }, [defaultCourseId, loadGroups]);

  // Load initial data
  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  // Load groups when course is selected
  useEffect(() => {
    if (selectedCourseId) {
      loadGroups(selectedCourseId);
      // Reset dependent selections only if they don't match the default values
      if (!defaultGroupId || selectedCourseId !== defaultCourseId) {
        setSelectedGroupId(null);
        setSelectedSubjectId(null);
        setSelectedChapterId(null);
        setSelectedSubChapterId(null);
        setGroups([]);
        setSubjects([]);
        setChapters([]);
        setSubChapters([]);
      }
    } else {
      setGroups([]);
      setSelectedGroupId(null);
    }
  }, [selectedCourseId, defaultCourseId, defaultGroupId, loadGroups]);

  // Load subjects when group is selected
  useEffect(() => {
    if (selectedGroupId) {
      loadSubjects(selectedGroupId);
      // Reset dependent selections only if they don't match the default values
      if (!defaultSubjectId || selectedGroupId !== defaultGroupId) {
        setSelectedSubjectId(null);
        setSelectedChapterId(null);
        setSelectedSubChapterId(null);
        setSubjects([]);
        setChapters([]);
        setSubChapters([]);
      }
    } else {
      setSubjects([]);
      setSelectedSubjectId(null);
    }
  }, [selectedGroupId, defaultGroupId, defaultSubjectId, loadSubjects]);

  // Load chapters when subject is selected
  useEffect(() => {
    if (selectedSubjectId) {
      loadChapters(selectedSubjectId);
      // Reset dependent selections only if they don't match the default values
      if (!defaultChapterId || selectedSubjectId !== defaultSubjectId) {
        setSelectedChapterId(null);
        setSelectedSubChapterId(null);
        setChapters([]);
        setSubChapters([]);
      }
    } else {
      setChapters([]);
      setSelectedChapterId(null);
    }
  }, [selectedSubjectId, defaultSubjectId, defaultChapterId, loadChapters]);

  // Load subchapters when chapter is selected
  useEffect(() => {
    if (selectedChapterId) {
      loadSubChapters(selectedChapterId);
      // Reset dependent selections only if they don't match the default values
      if (!defaultSubChapterId || selectedChapterId !== defaultChapterId) {
        setSelectedSubChapterId(null);
        setSubChapters([]);
      }
    } else {
      setSubChapters([]);
      setSelectedSubChapterId(null);
    }
  }, [selectedChapterId, defaultChapterId, defaultSubChapterId, loadSubChapters]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!questionText.trim()) {
      errors.questionText = "Question text is required";
    }
    
    if (!optionA.trim()) {
      errors.optionA = "Option A is required";
    }
    
    if (!optionB.trim()) {
      errors.optionB = "Option B is required";
    }
    
    if (!optionC.trim()) {
      errors.optionC = "Option C is required";
    }
    
    if (!optionD.trim()) {
      errors.optionD = "Option D is required";
    }
    
    if (!correctAnswer) {
      errors.correctAnswer = "Correct answer is required";
    }
    
    if (!selectedCourseId) {
      errors.courseId = "Course is required";
    }
    
    if (!selectedGroupId) {
      errors.groupId = "Group is required";
    }
    
    if (!selectedSubjectId) {
      errors.subjectId = "Subject is required";
    }
    
    if (!selectedChapterId) {
      errors.chapterId = "Chapter is required";
    }
    
    if (!selectedSubChapterId) {
      errors.subChapterId = "SubChapter is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const questionData: CreateQuestionDto = {
        courseId: selectedCourseId!,
        groupId: selectedGroupId!,
        subjectId: selectedSubjectId!,
        chapterId: selectedChapterId!,
        subChapterId: selectedSubChapterId!,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        description,
        previousYearInfo
      };

      await questionService.createQuestion(questionData);
      
      // Reset form
      setQuestionText("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("");
      setDescription("");
      setPreviousYearInfo("");
      // Keep the default selections
      setSelectedCourseId(defaultCourseId || null);
      setSelectedGroupId(defaultGroupId || null);
      setSelectedSubjectId(defaultSubjectId || null);
      setSelectedChapterId(defaultChapterId || null);
      setSelectedSubChapterId(defaultSubChapterId || null);
      setFormErrors({});
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow border">
      <h3 className="text-xl font-semibold mb-4">Add New Question</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Hierarchy Selection */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course *</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedCourseId || ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value) || null)}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name}</option>
              ))}
            </select>
            {formErrors.courseId && <p className="text-red-500 text-sm mt-1">{formErrors.courseId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Group *</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedGroupId || ""}
              onChange={(e) => setSelectedGroupId(Number(e.target.value) || null)}
              disabled={!selectedCourseId}
            >
              <option value="">Select Group</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
            {formErrors.groupId && <p className="text-red-500 text-sm mt-1">{formErrors.groupId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Subject *</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubjectId || ""}
              onChange={(e) => setSelectedSubjectId(Number(e.target.value) || null)}
              disabled={!selectedGroupId}
            >
              <option value="">Select Subject</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            {formErrors.subjectId && <p className="text-red-500 text-sm mt-1">{formErrors.subjectId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Chapter *</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedChapterId || ""}
              onChange={(e) => setSelectedChapterId(Number(e.target.value) || null)}
              disabled={!selectedSubjectId}
            >
              <option value="">Select Chapter</option>
              {chapters.map(chapter => (
                <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
              ))}
            </select>
            {formErrors.chapterId && <p className="text-red-500 text-sm mt-1">{formErrors.chapterId}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">SubChapter *</label>
            <select
              className="w-full p-2 border rounded"
              value={selectedSubChapterId || ""}
              onChange={(e) => setSelectedSubChapterId(Number(e.target.value) || null)}
              disabled={!selectedChapterId}
            >
              <option value="">Select SubChapter</option>
              {subChapters.map(subChapter => (
                <option key={subChapter.id} value={subChapter.id}>{subChapter.name}</option>
              ))}
            </select>
            {formErrors.subChapterId && <p className="text-red-500 text-sm mt-1">{formErrors.subChapterId}</p>}
          </div>
        </div>
        
        {/* Question Details */}
        <div>
          <label className="block text-sm font-medium mb-1">Question Text *</label>
          <Textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the question"
            rows={3}
          />
          {formErrors.questionText && <p className="text-red-500 text-sm mt-1">{formErrors.questionText}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Option A *</label>
            <Input
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder="Option A"
            />
            {formErrors.optionA && <p className="text-red-500 text-sm mt-1">{formErrors.optionA}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Option B *</label>
            <Input
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder="Option B"
            />
            {formErrors.optionB && <p className="text-red-500 text-sm mt-1">{formErrors.optionB}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Option C *</label>
            <Input
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              placeholder="Option C"
            />
            {formErrors.optionC && <p className="text-red-500 text-sm mt-1">{formErrors.optionC}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Option D *</label>
            <Input
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              placeholder="Option D"
            />
            {formErrors.optionD && <p className="text-red-500 text-sm mt-1">{formErrors.optionD}</p>}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Correct Answer *</label>
          <select
            className="w-full p-2 border rounded"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          >
            <option value="">Select correct answer</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          {formErrors.correctAnswer && <p className="text-red-500 text-sm mt-1">{formErrors.correctAnswer}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            rows={2}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Previous Year Info (Optional)</label>
          <Input
            value={previousYearInfo}
            onChange={(e) => setPreviousYearInfo(e.target.value)}
            placeholder="e.g., HSC 2020, Dhaka Board"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Question"}
          </Button>
        </div>
      </form>
    </div>
  );
}