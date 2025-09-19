"use client";

import { useState, useEffect, useCallback } from 'react';
import Header from "@/components/layouts/Header";
import CourseCard from "@/components/own/CourseCard";
import { Button } from "@/components/ui/button";
import { courseService, Course } from '@/services/course.service';
import Footer from '@/components/layouts/Footer';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCourses = useCallback(async (search = '') => {
    try {
      setLoading(true);
      // Fetch from the backend API instead of using mock data
      const response = await courseService.getAllCourses({
        page: 1,
        limit: 10,
        search: search
      });
      console.log('Courses response:', response);
      setCourses(response.courses);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load courses:", err);
      setError("Failed to load courses: " + (err as Error).message);
      setLoading(false);
    }
  }, []);

  // Fetch courses from the backend
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCourses(searchTerm);
  };

  const handleReset = () => {
    setSearchTerm('');
    fetchCourses();
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
          <h1 className="text-3xl font-bold text-red-700 mb-8">Our Courses</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-slate-700 dark:text-slate-300">Loading courses...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
          <h1 className="text-3xl font-bold text-red-700 mb-8">Our Courses</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Header />
      <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
        <h1 className="text-3xl font-bold text-red-700 mb-8">Our Courses</h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <Button type="submit" className="bg-red-700 hover:bg-red-800 text-white">
              Search
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleReset}
              className="border-red-700 text-red-700 hover:bg-red-700 hover:text-white"
            >
              Reset
            </Button>
          </form>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-700 dark:text-slate-300">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}