"use client";

import React, { useState, useEffect, useCallback } from 'react';
import CourseCard from './CourseCard';
import { courseService, Course } from '@/services/course.service';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function TopCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses({
          page: 1,
          limit: 4,
          sortBy: 'createdAt',
          sortOrder: 'DESC'
        });
        setCourses(response.courses);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses: " + (err as Error).message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Check if we're on a medium screen or larger
  const isMediumScreen = useCallback(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768; // md breakpoint
    }
    return false;
  }, []);

  // Auto rotate courses every 10 seconds (only on md screens and above)
  useEffect(() => {
    if (courses.length === 0) return;
    
    // Don't auto-rotate on small screens
    if (!isMediumScreen()) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [courses.length, isMediumScreen]);

  // Handle window resize to enable/disable auto-rotation
  useEffect(() => {
    const handleResize = () => {
      // Reset index when screen size changes
      setCurrentIndex(0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const goToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-slate-700 dark:text-slate-300">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-white/50 dark:border-slate-700/50 p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
                <BookOpen className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">No Courses Available</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              We don&#39;t have any courses available at the moment. Check back soon for exciting new courses!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/course">
                <Button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium">
                  Browse All Courses
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-6 py-3 rounded-lg font-medium">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Get visible courses for medium screens and above
  const visibleCourses = isMediumScreen() 
    ? [
        courses[currentIndex],
        courses[(currentIndex + 1) % courses.length],
        courses[(currentIndex + 2) % courses.length]
      ]
    : courses;

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 relative">
        {/* Course display area - responsive grid */}
        <div className={`grid gap-6 ${
          isMediumScreen() 
            ? 'grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2'
        }`}>
          {isMediumScreen() ? (
            // On medium screens and above, show only 3 courses with animation
            visibleCourses.map((course) => (
              <div key={course.id} className="w-full">
                <CourseCard course={course} />
              </div>
            ))
          ) : (
            // On small screens, show all 4 courses in a 2x2 grid
            courses.map((course) => (
              <div key={course.id} className="w-full">
                <CourseCard course={course} />
              </div>
            ))
          )}
        </div>
        
        {/* Navigation dots - only show on md screens and above */}
        {isMediumScreen() && (
          <div className="flex justify-center mt-8 space-x-2">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-red-700' 
                    : 'bg-gray-300 dark:bg-slate-600'
                }`}
                aria-label={`Go to course set starting with ${courses[index].title}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}