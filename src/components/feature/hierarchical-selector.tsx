"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupService } from "@/services/question/group.service";
import { subjectService } from "@/services/question/subject.service";
import { chapterService } from "@/services/question/chapter.service";
import { subChapterService } from "@/services/question/subchapter.service";
import examCourseService from "@/services/question/course.service";
import { ExamCourse } from "@/interface/examCourse";
import { Group } from "@/interface/group";
import { Subject } from "@/interface/subject";
import { Chapter } from "@/interface/chapter";
import { SubChapter } from "@/interface/subchapter";

interface HierarchicalSelectorProps {
  onSelectionChange: (selection: {
    courseId: number | null;
    groupId: number | null;
    subjectId: number | null;
    chapterId: number | null;
    subChapterId: number | null;
  }) => void;
}

export function HierarchicalSelector({ onSelectionChange }: HierarchicalSelectorProps) {
  // Data states
  const [courses, setCourses] = useState<ExamCourse[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [subChapters, setSubChapters] = useState<SubChapter[]>([]);

  // Selection states
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [selectedSubChapter, setSelectedSubChapter] = useState<number | null>(null);

  // Creation form states
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateChapter, setShowCreateChapter] = useState(false);
  const [showCreateSubChapter, setShowCreateSubChapter] = useState(false);

  // Form input states
  const [newCourseName, setNewCourseName] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newChapterName, setNewChapterName] = useState("");
  const [newSubChapterName, setNewSubChapterName] = useState("");

  const handleSelectionChangeCallback = useCallback(onSelectionChange, [onSelectionChange]);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    // Notify parent of selection changes
    handleSelectionChangeCallback({
      courseId: selectedCourse,
      groupId: selectedGroup,
      subjectId: selectedSubject,
      chapterId: selectedChapter,
      subChapterId: selectedSubChapter
    });
  }, [selectedCourse, selectedGroup, selectedSubject, selectedChapter, selectedSubChapter, handleSelectionChangeCallback]);

  useEffect(() => {
    if (selectedCourse) {
      loadGroups(selectedCourse);
    } else {
      setGroups([]);
      setSelectedGroup(null);
    }
  }, [selectedCourse]);

  useEffect(() => {
    if (selectedGroup) {
      loadSubjects(selectedGroup);
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedSubject) {
      loadChapters(selectedSubject);
    } else {
      setChapters([]);
      setSelectedChapter(null);
    }
  }, [selectedSubject]);

  useEffect(() => {
    if (selectedChapter) {
      loadSubChapters(selectedChapter);
    } else {
      setSubChapters([]);
      setSelectedSubChapter(null);
    }
  }, [selectedChapter]);

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

  const handleCreateCourse = async () => {
    if (!newCourseName.trim()) return;
    
    try {
      const newCourse = await examCourseService.createExamCourse({
        name: newCourseName
      });
      
      setCourses([...courses, newCourse]);
      setSelectedCourse(newCourse.id);
      setNewCourseName("");
      setShowCreateCourse(false);
    } catch (error) {
      console.error("Failed to create course:", error);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim() || !selectedCourse) return;
    
    try {
      const newGroup = await groupService.createGroup({
        name: newGroupName,
        courseId: selectedCourse
      });
      
      setGroups([...groups, newGroup]);
      setSelectedGroup(newGroup.id);
      setNewGroupName("");
      setShowCreateGroup(false);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  const handleCreateSubject = async () => {
    if (!newSubjectName.trim() || !selectedCourse || !selectedGroup) return;
    
    try {
      const newSubject = await subjectService.createSubject({
        name: newSubjectName,
        courseId: selectedCourse,
        groupId: selectedGroup
      });
      
      setSubjects([...subjects, newSubject]);
      setSelectedSubject(newSubject.id);
      setNewSubjectName("");
      setShowCreateSubject(false);
    } catch (error) {
      console.error("Failed to create subject:", error);
    }
  };

  const handleCreateChapter = async () => {
    if (!newChapterName.trim() || !selectedCourse || !selectedGroup || !selectedSubject) return;
    
    try {
      const newChapter = await chapterService.createChapter({
        name: newChapterName,
        courseId: selectedCourse,
        groupId: selectedGroup,
        subjectId: selectedSubject
      });
      
      setChapters([...chapters, newChapter]);
      setSelectedChapter(newChapter.id);
      setNewChapterName("");
      setShowCreateChapter(false);
    } catch (error) {
      console.error("Failed to create chapter:", error);
    }
  };

  const handleCreateSubChapter = async () => {
    if (!newSubChapterName.trim() || !selectedChapter || !selectedCourse || !selectedGroup || !selectedSubject) return;
    
    try {
      const newSubChapter = await subChapterService.createSubChapter({
        name: newSubChapterName,
        chapterId: selectedChapter,
        courseId: selectedCourse,
        groupId: selectedGroup,
        subjectId: selectedSubject
      });
      
      setSubChapters([...subChapters, newSubChapter]);
      setSelectedSubChapter(newSubChapter.id);
      setNewSubChapterName("");
      setShowCreateSubChapter(false);
    } catch (error) {
      console.error("Failed to create subchapter:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Course Selector */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium">Course</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => setShowCreateCourse(true)}
          >
            +
          </Button>
        </div>
        
        {showCreateCourse ? (
          <div className="flex gap-2 mb-2">
            <Input
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              placeholder="Course name"
              className="flex-1"
            />
            <Button onClick={handleCreateCourse} size="sm">Create</Button>
            <Button onClick={() => setShowCreateCourse(false)} variant="outline" size="sm">Cancel</Button>
          </div>
        ) : null}
        
        <select 
          className="w-full p-2 border rounded"
          value={selectedCourse || ""}
          onChange={(e) => setSelectedCourse(Number(e.target.value) || null)}
        >
          <option value="">Select a Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.name}</option>
          ))}
        </select>
      </div>
      
      {/* Group Selector */}
      {selectedCourse && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Group</label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateGroup(true)}
            >
              +
            </Button>
          </div>
          
          {showCreateGroup ? (
            <div className="flex gap-2 mb-2">
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group name"
                className="flex-1"
              />
              <Button onClick={handleCreateGroup} size="sm">Create</Button>
              <Button onClick={() => setShowCreateGroup(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          ) : null}
          
          <select 
            className="w-full p-2 border rounded"
            value={selectedGroup || ""}
            onChange={(e) => setSelectedGroup(Number(e.target.value) || null)}
          >
            <option value="">Select a Group</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Subject Selector */}
      {selectedGroup && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Subject</label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateSubject(true)}
            >
              +
            </Button>
          </div>
          
          {showCreateSubject ? (
            <div className="flex gap-2 mb-2">
              <Input
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                placeholder="Subject name"
                className="flex-1"
              />
              <Button onClick={handleCreateSubject} size="sm">Create</Button>
              <Button onClick={() => setShowCreateSubject(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          ) : null}
          
          <select 
            className="w-full p-2 border rounded"
            value={selectedSubject || ""}
            onChange={(e) => setSelectedSubject(Number(e.target.value) || null)}
          >
            <option value="">Select a Subject</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.id}>{subject.name}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Chapter Selector */}
      {selectedSubject && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Chapter</label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateChapter(true)}
            >
              +
            </Button>
          </div>
          
          {showCreateChapter ? (
            <div className="flex gap-2 mb-2">
              <Input
                value={newChapterName}
                onChange={(e) => setNewChapterName(e.target.value)}
                placeholder="Chapter name"
                className="flex-1"
              />
              <Button onClick={handleCreateChapter} size="sm">Create</Button>
              <Button onClick={() => setShowCreateChapter(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          ) : null}
          
          <select 
            className="w-full p-2 border rounded"
            value={selectedChapter || ""}
            onChange={(e) => setSelectedChapter(Number(e.target.value) || null)}
          >
            <option value="">Select a Chapter</option>
            {chapters.map(chapter => (
              <option key={chapter.id} value={chapter.id}>{chapter.name}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* SubChapter Selector */}
      {selectedChapter && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">SubChapter</label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => setShowCreateSubChapter(true)}
            >
              +
            </Button>
          </div>
          
          {showCreateSubChapter ? (
            <div className="flex gap-2 mb-2">
              <Input
                value={newSubChapterName}
                onChange={(e) => setNewSubChapterName(e.target.value)}
                placeholder="SubChapter name"
                className="flex-1"
              />
              <Button onClick={handleCreateSubChapter} size="sm">Create</Button>
              <Button onClick={() => setShowCreateSubChapter(false)} variant="outline" size="sm">Cancel</Button>
            </div>
          ) : null}
          
          <select 
            className="w-full p-2 border rounded"
            value={selectedSubChapter || ""}
            onChange={(e) => setSelectedSubChapter(Number(e.target.value) || null)}
          >
            <option value="">Select a SubChapter</option>
            {subChapters.map(subChapter => (
              <option key={subChapter.id} value={subChapter.id}>{subChapter.name}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}