"use client";

import { useState, useEffect } from 'react';
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

// Define the Course interface
interface Course {
  id: number;
  title: string;
  description: string;
  highlight: string;
  imageUrl?: string;
  createdAt: string;
  createdBy: {
    firstName: string;
    lastName?: string;
  };
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // In a real implementation, you would fetch from your backend API
        // For now, we'll use mock data with existing images
        const mockCourses: Course[] = [
          {
            id: 1,
            title: "HSC Preparation Course",
            description: "Comprehensive preparation course for Higher Secondary Certificate examination. Cover all subjects with expert guidance and practice materials.",
            highlight: "Complete HSC preparation with model tests and expert guidance",
            imageUrl: "/img/courses/hsc1.png",
            createdAt: "2023-05-15T10:30:00Z",
            createdBy: {
              firstName: "John",
              lastName: "Doe"
            }
          },
          {
            id: 2,
            title: "Advanced Medical Entrance Prep",
            description: "Specialized preparation course for medical college entrance examinations. Focus on biology, chemistry, and physics with practice tests.",
            highlight: "Targeted preparation for medical college entrance exams",
            imageUrl: "/img/courses/medi.png",
            createdAt: "2023-06-20T14:15:00Z",
            createdBy: {
              firstName: "Jane",
              lastName: "Smith"
            }
          },
          {
            id: 3,
            title: "University Admission Guide",
            description: "Complete guide for university admissions including application processes, essay writing, and interview preparation for top universities.",
            highlight: "Step-by-step guide for university admissions and scholarships",
            imageUrl: "/img/courses/varcity.png",
            createdAt: "2023-07-10T09:45:00Z",
            createdBy: {
              firstName: "Michael",
              lastName: "Johnson"
            }
          },
          {
            id: 4,
            title: "English Language Mastery",
            description: "Master English language skills for academic and professional success. Focus on grammar, vocabulary, writing, and communication skills.",
            highlight: "Improve your English for academic and professional success",
            imageUrl: "/img/courses/ing.png",
            createdAt: "2023-08-05T11:20:00Z",
            createdBy: {
              firstName: "Sarah",
              lastName: "Williams"
            }
          },
          {
            id: 5,
            title: "HSC Science Stream",
            description: "Specialized course for HSC science stream students. Cover physics, chemistry, biology, and mathematics with practical examples.",
            highlight: "Complete science stream preparation for HSC examination",
            imageUrl: "/img/courses/hsc2.jpg",
            createdAt: "2023-08-15T13:45:00Z",
            createdBy: {
              firstName: "David",
              lastName: "Brown"
            }
          },
          {
            id: 6,
            title: "University Success Strategies",
            description: "Learn strategies for success in university life including time management, study techniques, and career planning for future success.",
            highlight: "Essential strategies for university success and career planning",
            imageUrl: "/img/courses/versity2.png",
            createdAt: "2023-09-01T15:30:00Z",
            createdBy: {
              firstName: "Emily",
              lastName: "Davis"
            }
          }
        ];
        
        setCourses(mockCourses);
        setLoading(false);
      } catch {
        setError("Failed to load courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
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
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-slate-700 dark:text-slate-300">No courses available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300"
              >
                {course.imageUrl ? (
                  <div className="relative h-48 w-full">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl w-full h-48 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2">
                    {course.title}
                  </h2>
                  
                  <p className="text-red-700 dark:text-red-400 font-medium mb-4 line-clamp-2">
                    {course.highlight}
                  </p>
                  
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3">
                    {course.description}
                  </p>
                  
                  <div className="flex gap-3">
                    <Link href={`/course/${course.id}`} className="flex-1">
                      <Button className="w-full bg-red-700 hover:bg-[#9a0000] text-white rounded-lg">
                        See Details
                      </Button>
                    </Link>
                    <Button className="flex-1 border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white rounded-lg">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}