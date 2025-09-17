"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
        // In a real implementation, you would fetch from your backend API
        // For now, we'll use mock data with existing images
        const courseImages = [
          "/img/courses/hsc1.png",
          "/img/courses/medi.png",
          "/img/courses/varcity.png",
          "/img/courses/ing.png",
          "/img/courses/hsc2.jpg",
          "/img/courses/versity2.png"
        ];
        
        const courseTitles = [
          "HSC Preparation Course",
          "Advanced Medical Entrance Prep",
          "University Admission Guide",
          "English Language Mastery",
          "HSC Science Stream",
          "University Success Strategies"
        ];
        
        const courseDescriptions = [
          "Comprehensive preparation course for Higher Secondary Certificate examination. Cover all subjects with expert guidance and practice materials.\n\nThe course includes:\n1. Complete syllabus coverage\n2. Weekly model tests\n3. Personalized feedback\n4. Study materials and resources\n5. Doubt clearing sessions\n6. Exam strategy sessions\n\nBy the end of this course, you'll be fully prepared for your HSC examination with confidence and knowledge.",
          "Specialized preparation course for medical college entrance examinations. Focus on biology, chemistry, and physics with practice tests.\n\nCourse modules:\n1. Biology fundamentals and advanced concepts\n2. Chemistry principles and problem-solving\n3. Physics concepts and numerical problems\n4. Medical entrance exam patterns\n5. Time management strategies\n6. Practice tests and mock exams\n\nThis intensive course will prepare you thoroughly for medical college entrance examinations.",
          "Complete guide for university admissions including application processes, essay writing, and interview preparation for top universities.\n\nWhat you'll learn:\n1. University selection strategies\n2. Application form completion\n3. Personal statement writing\n4. Interview preparation techniques\n5. Scholarship applications\n6. Financial planning for education\n\nGet expert guidance for your university admission journey.",
          "Master English language skills for academic and professional success. Focus on grammar, vocabulary, writing, and communication skills.\n\nCourse content:\n1. Grammar fundamentals and advanced rules\n2. Vocabulary building techniques\n3. Writing skills development\n4. Reading comprehension\n5. Speaking and presentation skills\n6. Business communication\n\nEnhance your English proficiency for academic and career success.",
          "Specialized course for HSC science stream students. Cover physics, chemistry, biology, and mathematics with practical examples.\n\nSubjects covered:\n1. Physics - Mechanics, Thermodynamics, Electromagnetism\n2. Chemistry - Organic, Inorganic, Physical Chemistry\n3. Biology - Botany, Zoology, Genetics\n4. Mathematics - Algebra, Calculus, Statistics\n5. Practical applications\n6. Problem-solving techniques\n\nExcel in your science stream with expert guidance.",
          "Learn strategies for success in university life including time management, study techniques, and career planning for future success.\n\nKey topics:\n1. Time management and productivity\n2. Effective study techniques\n3. Research and writing skills\n4. Networking and relationship building\n5. Career planning and goal setting\n6. Stress management and wellness\n\nNavigate university life successfully with proven strategies."
        ];
        
        const courseHighlights = [
          "Complete HSC preparation with model tests and expert guidance",
          "Targeted preparation for medical college entrance exams",
          "Step-by-step guide for university admissions and scholarships",
          "Improve your English for academic and professional success",
          "Complete science stream preparation for HSC examination",
          "Essential strategies for university success and career planning"
        ];
        
        const courseId = parseInt(id as string);
        const imageIndex = (courseId - 1) % courseImages.length;
        
        const mockCourse: Course = {
          id: courseId,
          title: courseTitles[imageIndex] || "Course Title",
          description: courseDescriptions[imageIndex] || "Course description will be available soon.",
          highlight: courseHighlights[imageIndex] || "Course highlight information",
          imageUrl: courseImages[imageIndex],
          createdAt: "2023-05-15T10:30:00Z",
          createdBy: {
            firstName: "Expert",
            lastName: "Instructor"
          }
        };
        
        setCourse(mockCourse);
        setLoading(false);
      } catch {
        setError("Failed to load course details");
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
            <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-4">
              {course.title}
            </h1>
            
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-700 p-4 mb-6 rounded-r-lg">
              <p className="text-red-700 dark:text-red-300 font-medium">
                {course.highlight}
              </p>
            </div>
            
            <div className="prose prose-slate dark:prose-invert max-w-none mb-8">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">Course Description</h2>
              <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                {course.description}
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