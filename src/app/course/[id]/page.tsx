"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { courseService, Course } from '@/services/course.service';

export default function CourseDetailPage() {
  const params = useParams();
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch course details from the backend
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        // Fetch from the backend API
        const courseId = parseInt(id as string);
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load course details:", err);
        setError("Failed to load course details: " + (err as Error).message);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-slate-700 dark:text-slate-300">Loading course details...</p>
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
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-slate-700 dark:text-slate-300">Course not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Header />
      <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-white/50 dark:border-slate-700/50">
          {course.imageUrl ? (
            <div className="relative h-64 w-full md:h-96">
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed w-full h-64 md:h-96 flex items-center justify-center">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-red-700">
                {course.title}
              </h1>
              <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                Course ID: {course.id}
              </div>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-700 p-4 mb-6 rounded-r-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">
                {course.highlight}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-2">
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Course Description</h2>
                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                    {course.description}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Course Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Created By</p>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {course.createdBy.firstName} {course.createdBy.lastName || ''}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Created At</p>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {course.editedAt && (
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Last Updated</p>
                      <p className="font-medium text-slate-800 dark:text-white">
                        {new Date(course.editedAt).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-red-700 hover:bg-[#9a0000] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Enroll Now
              </Button>
              <Button variant="outline" className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Download Syllabus
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}