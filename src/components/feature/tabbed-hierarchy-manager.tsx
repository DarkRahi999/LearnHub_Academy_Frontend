"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
// Fix the dialog import
// Add toast for notifications
import { Pencil, Trash2 } from "lucide-react";
import { groupService } from "@/services/question/group.service";
import { subjectService } from "@/services/question/subject.service";
import { chapterService } from "@/services/question/chapter.service";
import { subChapterService } from "@/services/question/subchapter.service";
import { questionService } from "@/services/question/question.service";
import { Group } from "@/interface/group";
import { Subject } from "@/interface/subject";
import { Chapter } from "@/interface/chapter";
import { SubChapter } from "@/interface/subchapter";
import { Question } from "@/interface/question";
import { QuestionForm } from "@/components/feature/question-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { ExamCourse } from "@/interface/examCourse";
import examCourseService from "@/services/question/course.service";
import { useToast } from "@/hooks/use-toast"; // Import useToast hook

interface TabbedHierarchyManagerProps {
  onQuestionSelected?: (question: Question) => void;
}

// Add interface for edit forms
interface EditCourseFormProps {
  course: ExamCourse;
  onSave: (updatedCourse: ExamCourse) => void;
  onCancel: () => void;
}

interface EditGroupFormProps {
  group: Group;
  onSave: (updatedGroup: Group) => void;
  onCancel: () => void;
}

interface EditSubjectFormProps {
  subject: Subject;
  onSave: (updatedSubject: Subject) => void;
  onCancel: () => void;
}

interface EditChapterFormProps {
  chapter: Chapter;
  onSave: (updatedChapter: Chapter) => void;
  onCancel: () => void;
}

interface EditSubChapterFormProps {
  subChapter: SubChapter;
  onSave: (updatedSubChapter: SubChapter) => void;
  onCancel: () => void;
}

interface EditQuestionFormProps {
  question: Question;
  onSave: (updatedQuestion: Question) => void;
  onCancel: () => void;
}

export function TabbedHierarchyManager({ onQuestionSelected }: TabbedHierarchyManagerProps) {
  const { toast } = useToast(); // Use the toast hook
  // Data states
  const [courses, setCourses] = useState<ExamCourse[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subChapters, setSubChapters] = useState<SubChapter[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Selection states
  const [selectedCourse, setSelectedCourse] = useState<ExamCourse | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedSubChapter, setSelectedSubChapter] = useState<SubChapter | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);

  // Edit dialog states
  const [editingCourse, setEditingCourse] = useState<ExamCourse | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [editingSubChapter, setEditingSubChapter] = useState<SubChapter | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Creation form states
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateChapter, setShowCreateChapter] = useState(false);
  const [showCreateSubChapter, setShowCreateSubChapter] = useState(false);
  const [showCreateQuestion, setShowCreateQuestion] = useState(false);

  // Form input states
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseDescription, setNewCourseDescription] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDescription, setNewSubjectDescription] = useState("");
  const [newChapterName, setNewChapterName] = useState("");
  const [newChapterDescription, setNewChapterDescription] = useState("");
  const [newSubChapterName, setNewSubChapterName] = useState("");
  const [newSubChapterDescription, setNewSubChapterDescription] = useState("");

  // Active tab state
  const [activeTab, setActiveTab] = useState<"course" | "group" | "subject" | "chapter" | "subchapter" | "question">("course");

  // Add loading states for delete operations
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<number | null>(null);
  const [deletingSubjectId, setDeletingSubjectId] = useState<number | null>(null);
  const [deletingChapterId, setDeletingChapterId] = useState<number | null>(null);
  const [deletingSubChapterId, setDeletingSubChapterId] = useState<number | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadGroups(selectedCourse.id);
    } else {
      setGroups([]);
      setSelectedGroup(null);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedGroup) {
      loadSubjects(selectedGroup.id);
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedSubject) {
      loadChapters(selectedSubject.id);
    } else {
      setChapters([]);
      setSelectedChapter(null);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedChapter) {
      loadSubChapters(selectedChapter.id);
    } else {
      setSubChapters([]);
      setSelectedSubChapter(null);
    }
  }, [selectedChapter]);

  useEffect(() => {
    if (selectedSubChapter) {
      loadQuestions(selectedSubChapter.id);
    } else {
      setQuestions([]);
      setSelectedQuestion(null);
    }
  }, [selectedSubChapter]);

  const loadCourses = async () => {
    try {
      const data = await examCourseService.getAllExamCourses();
      setCourses(data);
    } catch (error) {
      console.error("Failed to load courses:", error);
    }
  };

  const loadGroups = async (courseId: number) => {
    try {
      const data = await groupService.getAllGroups();
      const filteredGroups = data.filter(group => group.courseId === courseId);
      setGroups(filteredGroups);
    } catch (error) {
      console.error("Failed to load groups:", error);
    }
  };

  const loadSubjects = async (groupId: number) => {
    try {
      const data = await subjectService.getAllSubjects();
      const filteredSubjects = data.filter(subject => subject.groupId === groupId);
      setSubjects(filteredSubjects);
    } catch (error) {
      console.error("Failed to load subjects:", error);
    }
  };

  const loadChapters = async (subjectId: number) => {
    try {
      const data = await chapterService.getAllChapters();
      const filteredChapters = data.filter(chapter => chapter.subjectId === subjectId);
      setChapters(filteredChapters);
    } catch (error) {
      console.error("Failed to load chapters:", error);
    }
  };

  const loadSubChapters = async (chapterId: number) => {
    try {
      const data = await subChapterService.getAllSubChapters();
      const filteredSubChapters = data.filter(subChapter => subChapter.chapterId === chapterId);
      setSubChapters(filteredSubChapters);
    } catch (error) {
      console.error("Failed to load subchapters:", error);
    }
  };

  const loadQuestions = async (subChapterId: number) => {
    try {
      const data = await questionService.getAllQuestions();
      const filteredQuestions = data.filter(question => question.subChapterId === subChapterId);
      setQuestions(filteredQuestions);
    } catch (error) {
      console.error("Failed to load questions:", error);
    }
  };

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    
    try {
      const newCourse = await examCourseService.createExamCourse({
        name: newCourseName,
        description: newCourseDescription
      });
      
      setCourses([...courses, newCourse]);
      setSelectedCourse(newCourse);
      setNewCourseName("");
      setNewCourseDescription("");
      setShowCreateCourse(false);
      setActiveTab("group"); // Move to next tab
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !selectedCourse) return;
    
    try {
      const newGroup = await groupService.createGroup({
        name: newGroupName,
        courseId: selectedCourse.id,
        description: newGroupDescription
      });
      
      setGroups([...groups, newGroup]);
      setSelectedGroup(newGroup);
      setNewGroupName("");
      setNewGroupDescription("");
      setShowCreateGroup(false);
      setActiveTab("subject"); // Move to next tab
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim() || !selectedCourse || !selectedGroup) return;
    
    try {
      const newSubject = await subjectService.createSubject({
        name: newSubjectName,
        courseId: selectedCourse.id,
        groupId: selectedGroup.id,
        description: newSubjectDescription
      });
      
      setSubjects([...subjects, newSubject]);
      setSelectedSubject(newSubject);
      setNewSubjectName("");
      setNewSubjectDescription("");
      setShowCreateSubject(false);
      setActiveTab("chapter"); // Move to next tab
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  };

  const handleCreateChapter = async () => {
    if (!newChapterName.trim() || !selectedCourse || !selectedGroup || !selectedSubject) return;
    
    try {
      const newChapter = await chapterService.createChapter({
        name: newChapterName,
        courseId: selectedCourse.id,
        groupId: selectedGroup.id,
        subjectId: selectedSubject.id,
        description: newChapterDescription
      });
      
      setChapters([...chapters, newChapter]);
      setSelectedChapter(newChapter);
      setNewChapterName("");
      setNewChapterDescription("");
      setShowCreateChapter(false);
      setActiveTab("subchapter"); // Move to next tab
    } catch (error) {
      console.error("Failed to create chapter:", error);
    }
  };

  const handleCreateSubChapter = async () => {
    if (!newSubChapterName.trim() || !selectedChapter || !selectedCourse || !selectedGroup || !selectedSubject) return;
    
    try {
      const newSubChapter = await subChapterService.createSubChapter({
        name: newSubChapterName,
        chapterId: selectedChapter.id,
        courseId: selectedCourse.id,
        groupId: selectedGroup.id,
        subjectId: selectedSubject.id,
        description: newSubChapterDescription
      });
      
      setSubChapters([...subChapters, newSubChapter]);
      setSelectedSubChapter(newSubChapter);
      setNewSubChapterName("");
      setNewSubChapterDescription("");
      setShowCreateSubChapter(false);
      setActiveTab("question"); // Move to next tab
    } catch (error) {
      console.error("Failed to create subchapter:", error);
    }
  };

  const handleQuestionCreated = () => {
    setShowCreateQuestion(false);
    // Reload questions
    if (selectedSubChapter) {
      loadQuestions(selectedSubChapter.id);
    }
  };

  const handleSelectCourse = (course: ExamCourse) => {
    setSelectedCourse(course);
    setSelectedGroup(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedSubChapter(null);
    setSelectedQuestion(null);
  };

  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedSubChapter(null);
    setSelectedQuestion(null);
  };

  const handleSelectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setSelectedChapter(null);
    setSelectedSubChapter(null);
    setSelectedQuestion(null);
  };

  const handleSelectChapter = (chapter: Chapter) => {
    setSelectedChapter(chapter);
    setSelectedSubChapter(null);
    setSelectedQuestion(null);
  };

  const handleSelectSubChapter = (subChapter: SubChapter) => {
    setSelectedSubChapter(subChapter);
    setSelectedQuestion(null);
  };

  const handleSelectQuestion = (question: Question) => {
    setSelectedQuestion(question);
    if (onQuestionSelected) {
      onQuestionSelected(question);
    }
  };

  // Edit functions
  const handleEditCourse = (course: ExamCourse) => {
    setEditingCourse(course);
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
  };

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter);
  };

  const handleEditSubChapter = (subChapter: SubChapter) => {
    setEditingSubChapter(subChapter);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
  };

  // Delete functions with loading states
  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Are you sure you want to delete this course? This will also delete all related groups, subjects, chapters, subchapters, and questions.")) {
      return;
    }
    
    setDeletingCourseId(courseId);
    try {
      await examCourseService.deleteExamCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      if (selectedCourse?.id === courseId) {
        setSelectedCourse(null);
        setSelectedGroup(null);
        setSelectedSubject(null);
        setSelectedChapter(null);
        setSelectedSubChapter(null);
        setSelectedQuestion(null);
      }
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course",
        variant: "destructive",
      });
    } finally {
      setDeletingCourseId(null);
    }
  };

  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm("Are you sure you want to delete this group? This will also delete all related subjects, chapters, subchapters, and questions.")) {
      return;
    }
    
    setDeletingGroupId(groupId);
    try {
      await groupService.deleteGroup(groupId);
      setGroups(groups.filter(group => group.id !== groupId));
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setSelectedSubject(null);
        setSelectedChapter(null);
        setSelectedSubChapter(null);
        setSelectedQuestion(null);
      }
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete group:", error);
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    } finally {
      setDeletingGroupId(null);
    }
  };

  const handleDeleteSubject = async (subjectId: number) => {
    if (!confirm("Are you sure you want to delete this subject? This will also delete all related chapters, subchapters, and questions.")) {
      return;
    }
    
    setDeletingSubjectId(subjectId);
    try {
      await subjectService.deleteSubject(subjectId);
      setSubjects(subjects.filter(subject => subject.id !== subjectId));
      if (selectedSubject?.id === subjectId) {
        setSelectedSubject(null);
        setSelectedChapter(null);
        setSelectedSubChapter(null);
        setSelectedQuestion(null);
      }
      toast({
        title: "Success",
        description: "Subject deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete subject:", error);
      toast({
        title: "Error",
        description: "Failed to delete subject",
        variant: "destructive",
      });
    } finally {
      setDeletingSubjectId(null);
    }
  };

  const handleDeleteChapter = async (chapterId: number) => {
    if (!confirm("Are you sure you want to delete this chapter? This will also delete all related subchapters and questions.")) {
      return;
    }
    
    setDeletingChapterId(chapterId);
    try {
      await chapterService.deleteChapter(chapterId);
      setChapters(chapters.filter(chapter => chapter.id !== chapterId));
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null);
        setSelectedSubChapter(null);
        setSelectedQuestion(null);
      }
      toast({
        title: "Success",
        description: "Chapter deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete chapter:", error);
      toast({
        title: "Error",
        description: "Failed to delete chapter",
        variant: "destructive",
      });
    } finally {
      setDeletingChapterId(null);
    }
  };

  const handleDeleteSubChapter = async (subChapterId: number) => {
    if (!confirm("Are you sure you want to delete this subchapter? This will also delete all related questions.")) {
      return;
    }
    
    setDeletingSubChapterId(subChapterId);
    try {
      await subChapterService.deleteSubChapter(subChapterId);
      setSubChapters(subChapters.filter(subChapter => subChapter.id !== subChapterId));
      if (selectedSubChapter?.id === subChapterId) {
        setSelectedSubChapter(null);
        setSelectedQuestion(null);
      }
      toast({
        title: "Success",
        description: "SubChapter deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete subchapter:", error);
      toast({
        title: "Error",
        description: "Failed to delete subchapter",
        variant: "destructive",
      });
    } finally {
      setDeletingSubChapterId(null);
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm("Are you sure you want to delete this question?")) {
      return;
    }
    
    setDeletingQuestionId(questionId);
    try {
      await questionService.deleteQuestion(questionId);
      setQuestions(questions.filter(question => question.id !== questionId));
      if (selectedQuestion?.id === questionId) {
        setSelectedQuestion(null);
      }
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    } catch (error) {
      console.error("Failed to delete question:", error);
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    } finally {
      setDeletingQuestionId(null);
    }
  };

  // Save functions for edit forms (update toast messages to use react-hot-toast)
  const handleSaveCourse = async (updatedCourse: ExamCourse) => {
    try {
      const savedCourse = await examCourseService.updateExamCourse(updatedCourse.id, {
        name: updatedCourse.name,
        description: updatedCourse.description
      });
      
      setCourses(courses.map(course => course.id === savedCourse.id ? savedCourse : course));
      if (selectedCourse?.id === savedCourse.id) {
        setSelectedCourse(savedCourse);
      }
      
      setEditingCourse(null);
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
    } catch (error) {
      console.error("Failed to update course:", error);
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    }
  };

  const handleSaveGroup = async (updatedGroup: Group) => {
    try {
      const savedGroup = await groupService.updateGroup(updatedGroup.id, {
        name: updatedGroup.name,
        description: updatedGroup.description,
        courseId: updatedGroup.courseId
      });
      
      setGroups(groups.map(group => group.id === savedGroup.id ? savedGroup : group));
      if (selectedGroup?.id === savedGroup.id) {
        setSelectedGroup(savedGroup);
      }
      
      setEditingGroup(null);
      toast({
        title: "Success",
        description: "Group updated successfully",
      });
    } catch (error) {
      console.error("Failed to update group:", error);
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive",
      });
    }
  };

  const handleSaveSubject = async (updatedSubject: Subject) => {
    try {
      const savedSubject = await subjectService.updateSubject(updatedSubject.id, {
        name: updatedSubject.name,
        description: updatedSubject.description,
        courseId: updatedSubject.courseId,
        groupId: updatedSubject.groupId
      });
      
      setSubjects(subjects.map(subject => subject.id === savedSubject.id ? savedSubject : subject));
      if (selectedSubject?.id === savedSubject.id) {
        setSelectedSubject(savedSubject);
      }
      
      setEditingSubject(null);
      toast({
        title: "Success",
        description: "Subject updated successfully",
      });
    } catch (error) {
      console.error("Failed to update subject:", error);
      toast({
        title: "Error",
        description: "Failed to update subject",
        variant: "destructive",
      });
    }
  };

  const handleSaveChapter = async (updatedChapter: Chapter) => {
    try {
      const savedChapter = await chapterService.updateChapter(updatedChapter.id, {
        name: updatedChapter.name,
        description: updatedChapter.description,
        courseId: updatedChapter.courseId,
        groupId: updatedChapter.groupId,
        subjectId: updatedChapter.subjectId
      });
      
      setChapters(chapters.map(chapter => chapter.id === savedChapter.id ? savedChapter : chapter));
      if (selectedChapter?.id === savedChapter.id) {
        setSelectedChapter(savedChapter);
      }
      
      setEditingChapter(null);
      toast({
        title: "Success",
        description: "Chapter updated successfully",
      });
    } catch (error) {
      console.error("Failed to update chapter:", error);
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive",
      });
    }
  };

  const handleSaveSubChapter = async (updatedSubChapter: SubChapter) => {
    try {
      const savedSubChapter = await subChapterService.updateSubChapter(updatedSubChapter.id, {
        name: updatedSubChapter.name,
        description: updatedSubChapter.description,
        chapterId: updatedSubChapter.chapterId,
        courseId: updatedSubChapter.courseId,
        groupId: updatedSubChapter.groupId,
        subjectId: updatedSubChapter.subjectId
      });
      
      setSubChapters(subChapters.map(subChapter => subChapter.id === savedSubChapter.id ? savedSubChapter : subChapter));
      if (selectedSubChapter?.id === savedSubChapter.id) {
        setSelectedSubChapter(savedSubChapter);
      }
      
      setEditingSubChapter(null);
      toast({
        title: "Success",
        description: "SubChapter updated successfully",
      });
    } catch (error) {
      console.error("Failed to update subchapter:", error);
      toast({
        title: "Error",
        description: "Failed to update subchapter",
        variant: "destructive",
      });
    }
  };

  const handleSaveQuestion = async (updatedQuestion: Question) => {
    try {
      const savedQuestion = await questionService.updateQuestion(updatedQuestion.id, {
        name: updatedQuestion.name,
        questionText: updatedQuestion.questionText,
        optionA: updatedQuestion.optionA,
        optionB: updatedQuestion.optionB,
        optionC: updatedQuestion.optionC,
        optionD: updatedQuestion.optionD,
        correctAnswer: updatedQuestion.correctAnswer,
        description: updatedQuestion.description,
        subChapterId: updatedQuestion.subChapterId
      });
      
      setQuestions(questions.map(question => question.id === savedQuestion.id ? savedQuestion : question));
      if (selectedQuestion?.id === savedQuestion.id) {
        setSelectedQuestion(savedQuestion);
      }
      
      setEditingQuestion(null);
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
    } catch (error) {
      console.error("Failed to update question:", error);
      toast({
        title: "Error",
        description: "Failed to update question",
        variant: "destructive",
      });
    }
  };

  // Edit Course Form Component
  const EditCourseForm = ({ course, onSave, onCancel }: EditCourseFormProps) => {
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave({ ...course, name, description });
      } finally {
        setLoading(false);
      }
    };
    
    const handleClose = () => {
      if (!loading) {
        setEditingCourse(null);
      }
    };

    return (
      <Dialog open={!!editingCourse}>
        <DialogContent>
          <DialogHeader onClose={handleClose}>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Course name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Course description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Group Form Component
  const EditGroupForm = ({ group, onSave, onCancel }: EditGroupFormProps) => {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave({ ...group, name, description });
      } finally {
        setLoading(false);
      }
    };
    
    const handleClose = () => {
      if (!loading) {
        setEditingGroup(null);
      }
    };

    return (
      <Dialog open={!!editingGroup}>
        <DialogContent>
          <DialogHeader onClose={handleClose}>
            <DialogTitle>Edit Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Group name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Group description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Subject Form Component
  const EditSubjectForm = ({ subject, onSave, onCancel }: EditSubjectFormProps) => {
    const [name, setName] = useState(subject.name);
    const [description, setDescription] = useState(subject.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave({ ...subject, name, description });
      } finally {
        setLoading(false);
      }
    };
    
    const handleClose = () => {
      if (!loading) {
        setEditingSubject(null);
      }
    };

    return (
      <Dialog open={!!editingSubject}>
        <DialogContent>
          <DialogHeader onClose={handleClose}>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Subject name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Subject description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Chapter Form Component
  const EditChapterForm = ({ chapter, onSave, onCancel }: EditChapterFormProps) => {
    const [name, setName] = useState(chapter.name);
    const [description, setDescription] = useState(chapter.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave({ ...chapter, name, description });
      } finally {
        setLoading(false);
      }
    };
    
    const handleClose = () => {
      if (!loading) {
        setEditingChapter(null);
      }
    };

    return (
      <Dialog open={!!editingChapter}>
        <DialogContent>
          <DialogHeader onClose={handleClose}>
            <DialogTitle>Edit Chapter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Chapter name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Chapter description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit SubChapter Form Component
  const EditSubChapterForm = ({ subChapter, onSave, onCancel }: EditSubChapterFormProps) => {
    const [name, setName] = useState(subChapter.name);
    const [description, setDescription] = useState(subChapter.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave({ ...subChapter, name, description });
      } finally {
        setLoading(false);
      }
    };
    
    const handleClose = () => {
      if (!loading) {
        setEditingSubChapter(null);
      }
    };

    return (
      <Dialog open={!!editingSubChapter}>
        <DialogContent>
          <DialogHeader onClose={handleClose}>
            <DialogTitle>Edit SubChapter</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="SubChapter name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="SubChapter description (optional)"
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  // Edit Question Form Component
  const EditQuestionForm = ({ question, onSave, onCancel }: EditQuestionFormProps) => {
    const [name, setName] = useState(question.name);
    const [questionText, setQuestionText] = useState(question.questionText);
    const [optionA, setOptionA] = useState(question.optionA);
    const [optionB, setOptionB] = useState(question.optionB);
    const [optionC, setOptionC] = useState(question.optionC);
    const [optionD, setOptionD] = useState(question.optionD);
    const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer);
    const [description, setDescription] = useState(question.description || "");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      try {
        await onSave({ 
          ...question, 
          name, 
          questionText, 
          optionA, 
          optionB, 
          optionC, 
          optionD, 
          correctAnswer, 
          description 
        });
      } finally {
        setLoading(false);
      }
    };
    
    const handleClose = () => {
      if (!loading) {
        setEditingQuestion(null);
      }
    };

    return (
      <Dialog open={!!editingQuestion}>
        <DialogContent>
          <DialogHeader onClose={handleClose}>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Question Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Question name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Question Text *</label>
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Question text"
                rows={3}
                required
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Option A *</label>
                <Input
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                  placeholder="Option A"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Option B *</label>
                <Input
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                  placeholder="Option B"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Option C *</label>
                <Input
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                  placeholder="Option C"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Option D *</label>
                <Input
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                  placeholder="Option D"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Correct Answer *</label>
              <select
                className="w-full p-2 border rounded"
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select correct answer</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      {/* Edit Dialogs */}
      {editingCourse && (
        <EditCourseForm
          course={editingCourse}
          onSave={handleSaveCourse}
          onCancel={() => setEditingCourse(null)}
        />
      )}
      
      {editingGroup && (
        <EditGroupForm
          group={editingGroup}
          onSave={handleSaveGroup}
          onCancel={() => setEditingGroup(null)}
        />
      )}
      
      {editingSubject && (
        <EditSubjectForm
          subject={editingSubject}
          onSave={handleSaveSubject}
          onCancel={() => setEditingSubject(null)}
        />
      )}
      
      {editingChapter && (
        <EditChapterForm
          chapter={editingChapter}
          onSave={handleSaveChapter}
          onCancel={() => setEditingChapter(null)}
        />
      )}
      
      {editingSubChapter && (
        <EditSubChapterForm
          subChapter={editingSubChapter}
          onSave={handleSaveSubChapter}
          onCancel={() => setEditingSubChapter(null)}
        />
      )}
      
      {editingQuestion && (
        <EditQuestionForm
          question={editingQuestion}
          onSave={handleSaveQuestion}
          onCancel={() => setEditingQuestion(null)}
        />
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "course"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("course")}
          >
            Courses
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "group"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("group")}
            disabled={!selectedCourse}
          >
            Groups
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "subject"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("subject")}
            disabled={!selectedGroup}
          >
            Subjects
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "chapter"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("chapter")}
            disabled={!selectedSubject}
          >
            Chapters
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "subchapter"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("subchapter")}
            disabled={!selectedChapter}
          >
            SubChapters
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "question"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("question")}
            disabled={!selectedSubChapter}
          >
            Questions
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Course Tab */}
        {activeTab === "course" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Courses</h3>
              <Button onClick={() => setShowCreateCourse(!showCreateCourse)}>
                {showCreateCourse ? "Cancel" : "Add New Course"}
              </Button>
            </div>
            
            {showCreateCourse && (
              <div className="mb-6 p-4 border rounded-lg">
                <h4 className="text-md font-medium mb-3">Create New Course</h4>
                <div className="space-y-3">
                  <Input
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="Course name"
                  />
                  <Textarea
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                    placeholder="Course description (optional)"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateCourse}>Create</Button>
                    <Button variant="outline" onClick={() => setShowCreateCourse(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                    selectedCourse?.id === course.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectCourse(course)}
                >
                  {/* Edit and Delete buttons - only show when selected */}
                  {selectedCourse?.id === course.id && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCourse(course);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course.id);
                        }}
                        disabled={deletingCourseId === course.id}
                      >
                        {deletingCourseId === course.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h4 className="font-medium">{course.name}</h4>
                  {course.description && (
                    <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Group Tab */}
        {activeTab === "group" && selectedCourse && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Groups for {selectedCourse.name}
              </h3>
              <Button onClick={() => setShowCreateGroup(!showCreateGroup)}>
                {showCreateGroup ? "Cancel" : "Add New Group"}
              </Button>
            </div>
            
            {showCreateGroup && (
              <div className="mb-6 p-4 border rounded-lg">
                <h4 className="text-md font-medium mb-3">Create New Group</h4>
                <div className="space-y-3">
                  <Input
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group name"
                  />
                  <Textarea
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    placeholder="Group description (optional)"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateGroup}>Create</Button>
                    <Button variant="outline" onClick={() => setShowCreateGroup(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                    selectedGroup?.id === group.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectGroup(group)}
                >
                  {/* Edit and Delete buttons - only show when selected */}
                  {selectedGroup?.id === group.id && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGroup(group);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGroup(group.id);
                        }}
                        disabled={deletingGroupId === group.id}
                      >
                        {deletingGroupId === group.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h4 className="font-medium">{group.name}</h4>
                  {group.description && (
                    <p className="text-sm text-gray-600 mt-1">{group.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subject Tab */}
        {activeTab === "subject" && selectedGroup && selectedCourse && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Subjects for {selectedGroup.name} ({selectedCourse.name})
              </h3>
              <Button onClick={() => setShowCreateSubject(!showCreateSubject)}>
                {showCreateSubject ? "Cancel" : "Add New Subject"}
              </Button>
            </div>
            
            {showCreateSubject && (
              <div className="mb-6 p-4 border rounded-lg">
                <h4 className="text-md font-medium mb-3">Create New Subject</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Course</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedCourse?.id || ""}
                        disabled
                      >
                        <option value={selectedCourse?.id}>{selectedCourse?.name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Group</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedGroup?.id || ""}
                        disabled
                      >
                        <option value={selectedGroup?.id}>{selectedGroup?.name}</option>
                      </select>
                    </div>
                  </div>
                  <Input
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="Subject name"
                  />
                  <Textarea
                    value={newSubjectDescription}
                    onChange={(e) => setNewSubjectDescription(e.target.value)}
                    placeholder="Subject description (optional)"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateSubject}>Create</Button>
                    <Button variant="outline" onClick={() => setShowCreateSubject(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                    selectedSubject?.id === subject.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectSubject(subject)}
                >
                  {/* Edit and Delete buttons - only show when selected */}
                  {selectedSubject?.id === subject.id && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSubject(subject);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubject(subject.id);
                        }}
                        disabled={deletingSubjectId === subject.id}
                      >
                        {deletingSubjectId === subject.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h4 className="font-medium">{subject.name}</h4>
                  {subject.description && (
                    <p className="text-sm text-gray-600 mt-1">{subject.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(subject.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapter Tab */}
        {activeTab === "chapter" && selectedSubject && selectedGroup && selectedCourse && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Chapters for {selectedSubject.name} ({selectedGroup.name} - {selectedCourse.name})
              </h3>
              <Button onClick={() => setShowCreateChapter(!showCreateChapter)}>
                {showCreateChapter ? "Cancel" : "Add New Chapter"}
              </Button>
            </div>
            
            {showCreateChapter && (
              <div className="mb-6 p-4 border rounded-lg">
                <h4 className="text-md font-medium mb-3">Create New Chapter</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Course</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedCourse?.id || ""}
                        disabled
                      >
                        <option value={selectedCourse?.id}>{selectedCourse?.name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Group</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedGroup?.id || ""}
                        disabled
                      >
                        <option value={selectedGroup?.id}>{selectedGroup?.name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedSubject?.id || ""}
                        disabled
                      >
                        <option value={selectedSubject?.id}>{selectedSubject?.name}</option>
                      </select>
                    </div>
                  </div>
                  <Input
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    placeholder="Chapter name"
                  />
                  <Textarea
                    value={newChapterDescription}
                    onChange={(e) => setNewChapterDescription(e.target.value)}
                    placeholder="Chapter description (optional)"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateChapter}>Create</Button>
                    <Button variant="outline" onClick={() => setShowCreateChapter(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                    selectedChapter?.id === chapter.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectChapter(chapter)}
                >
                  {/* Edit and Delete buttons - only show when selected */}
                  {selectedChapter?.id === chapter.id && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditChapter(chapter);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteChapter(chapter.id);
                        }}
                        disabled={deletingChapterId === chapter.id}
                      >
                        {deletingChapterId === chapter.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h4 className="font-medium">{chapter.name}</h4>
                  {chapter.description && (
                    <p className="text-sm text-gray-600 mt-1">{chapter.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(chapter.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SubChapter Tab */}
        {activeTab === "subchapter" && selectedChapter && selectedSubject && selectedGroup && selectedCourse && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                SubChapters for {selectedChapter.name} ({selectedSubject.name} - {selectedGroup.name} - {selectedCourse.name})
              </h3>
              <Button onClick={() => setShowCreateSubChapter(!showCreateSubChapter)}>
                {showCreateSubChapter ? "Cancel" : "Add New SubChapter"}
              </Button>
            </div>
            
            {showCreateSubChapter && (
              <div className="mb-6 p-4 border rounded-lg">
                <h4 className="text-md font-medium mb-3">Create New SubChapter</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Course</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedCourse?.id || ""}
                        disabled
                      >
                        <option value={selectedCourse?.id}>{selectedCourse?.name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Group</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedGroup?.id || ""}
                        disabled
                      >
                        <option value={selectedGroup?.id}>{selectedGroup?.name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Subject</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedSubject?.id || ""}
                        disabled
                      >
                        <option value={selectedSubject?.id}>{selectedSubject?.name}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Chapter</label>
                      <select
                        className="w-full p-2 border rounded"
                        value={selectedChapter?.id || ""}
                        disabled
                      >
                        <option value={selectedChapter?.id}>{selectedChapter?.name}</option>
                      </select>
                    </div>
                  </div>
                  <Input
                    value={newSubChapterName}
                    onChange={(e) => setNewSubChapterName(e.target.value)}
                    placeholder="SubChapter name"
                  />
                  <Textarea
                    value={newSubChapterDescription}
                    onChange={(e) => setNewSubChapterDescription(e.target.value)}
                    placeholder="SubChapter description (optional)"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleCreateSubChapter}>Create</Button>
                    <Button variant="outline" onClick={() => setShowCreateSubChapter(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subChapters.map((subChapter) => (
                <div
                  key={subChapter.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                    selectedSubChapter?.id === subChapter.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectSubChapter(subChapter)}
                >
                  {/* Edit and Delete buttons - only show when selected */}
                  {selectedSubChapter?.id === subChapter.id && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditSubChapter(subChapter);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubChapter(subChapter.id);
                        }}
                        disabled={deletingSubChapterId === subChapter.id}
                      >
                        {deletingSubChapterId === subChapter.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h4 className="font-medium">{subChapter.name}</h4>
                  {subChapter.description && (
                    <p className="text-sm text-gray-600 mt-1">{subChapter.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Created: {new Date(subChapter.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Question Tab */}
        {activeTab === "question" && selectedSubChapter && selectedChapter && selectedSubject && selectedGroup && selectedCourse && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Questions for {selectedSubChapter.name} ({selectedChapter.name} - {selectedSubject.name} - {selectedGroup.name} - {selectedCourse.name})
              </h3>
              <Button onClick={() => setShowCreateQuestion(!showCreateQuestion)}>
                {showCreateQuestion ? "Cancel" : "Add New Question"}
              </Button>
            </div>
            
            {showCreateQuestion && (
              <div className="mb-6">
                <QuestionForm 
                  onSuccess={handleQuestionCreated}
                  onCancel={() => setShowCreateQuestion(false)}
                  // Pass default values based on current selections
                  defaultCourseId={selectedCourse?.id}
                  defaultGroupId={selectedGroup?.id}
                  defaultSubjectId={selectedSubject?.id}
                  defaultChapterId={selectedChapter?.id}
                  defaultSubChapterId={selectedSubChapter?.id}
                />
              </div>
            )}
            
            <div className="space-y-4">
              {questions.map((question) => (
                <div
                  key={question.id}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 relative ${
                    selectedQuestion?.id === question.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleSelectQuestion(question)}
                >
                  {/* Edit and Delete buttons - only show when selected */}
                  {selectedQuestion?.id === question.id && (
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditQuestion(question);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteQuestion(question.id);
                        }}
                        disabled={deletingQuestionId === question.id}
                      >
                        {deletingQuestionId === question.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <h4 className="font-medium">{question.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{question.questionText}</p>
                  <div className="mt-2 flex items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Correct: {question.correctAnswer}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      Created: {new Date(question.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              
              {questions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No questions found. Add your first question to get started.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}