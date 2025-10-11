"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/layouts/Header";
import CourseCard from "@/components/own/CourseCard";
import { Button } from "@/components/ui/button";
import { courseService, Course } from "@/services/course.service";
import Footer from "@/components/layouts/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Search, X } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchCourses = useCallback(async (search = "") => {
    try {
      setLoading(true);
      // Fetch from the backend API instead of using mock data
      const response = await courseService.getAllCourses({
        page: 1,
        limit: 10,
        search: search,
      });
      console.log("Courses response:", response);
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
    setSearchTerm("");
    fetchCourses();
    // Focus back on the input field after clearing
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      fetchCourses(searchTerm);
    }
  };

  if (loading && courses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
          <h1 className="text-3xl font-bold text-red-700 mb-8">Our Courses</h1>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Loading courses...
            </p>
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
    <div className=" bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Header />
      <div className="container mx-auto p-5">
        <h1 className="text-3xl font-bold text-red-700 mb-4">Our Course</h1>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button 
                type="submit" 
                size="icon"
                className="bg-red-700 hover:bg-red-800 text-white md:hidden"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>

        {courses.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-900">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <BookOpen className="w-12 h-12 mx-auto text-red-700 opacity-70" />
                <h3 className="text-xl font-semibold mb-2">Our Courses</h3>
                <p>No courses available at this moment.</p>
                <p>Check back later for new Courses.</p>
              </div>
            </CardContent>
          </Card>
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