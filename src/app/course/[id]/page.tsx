"use client";

import instituteDetails from "@/app/db/institute";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { courseService, Course } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import Header from "@/components/layouts/Header";
import Image from "next/image";
import Loading from "@/components/layouts/Loading";

export default function CourseDetailPage() {
  const params = useParams();
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  //W---------={ Fetch courses from the backend }=----------
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseId = parseInt(id as string);
        const courseData = await courseService.getCourseById(courseId);
        setCourse(courseData);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load course details:", err);
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  if (loading) {
    return <Loading title="Course Details" />;
  }

  //W---------={ If course empty or just pass a id }=----------
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto px-4 xs:px-6 sm:px-10 lg:px-20 py-8">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-slate-700 dark:text-slate-300">
              Course not found
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-xl border border-white/50 dark:border-slate-700/50">
        {/* -=> display Image */}
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

        {/* -=> display Title */}
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold text-red-700">
              {course.title}
            </h1>
          </div>

          {/* -=> display highlight text */}
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-700 p-4 mb-6 rounded-r-lg">
            <p className="text-red-700 dark:text-red-300 font-medium">
              {course.highlight}
            </p>
          </div>

          {/* -=> display Description */}
          <div className="prose prose-slate dark:prose-invert mb-4">
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4">
              Course Description
            </h2>
            <div className="whitespace-pre-line text-slate-700 dark:text-slate-300 text-justify">
              {course.description}
            </div>
          </div>

          {/* -=> display pointed Text */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mt-4">Course Features</h2>
              <ul className="space-y-1 text-lg text-slate-700 dark:text-slate-300 p-2">
                {course.pointedText.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* -=> display Price */}
              <div className="flex flex-wrap gap-4 mt-2 px-2">
                <div className="font-bold relative inline-block mb-4">
                  <span className="text-6xl relative inline-block opacity-60 mr-2">
                    {course.price}tk
                    <span className="absolute inset-0 rotate-[-12deg] border-t-5 border-black  dark:border-white translate-y-[28px]"></span>
                  </span>
                  <span className="px-2 text-3xl text-red-600">
                    {course.discountPrice}tk
                  </span>
                </div>
              </div>
            </div>

            {/* -=> Course info */}
            <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl h-52">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                Course Info
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Created By
                  </p>
                  <p className="font-medium text-slate-800 dark:text-white">
                    {instituteDetails.name || ""}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    lunched At
                  </p>
                  <p className="font-medium text-slate-800 dark:text-white">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {course.editedAt && (
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Last Updated
                    </p>
                    <p className="font-medium text-slate-800 dark:text-white">
                      {new Date(course.editedAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* -=> Add to cart and purchase buttons */}
          <div className="flex flex-wrap gap-4">
            <Button className="bg-red-700 hover:bg-[#9a0000] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Enroll Now
            </Button>
            <Button
              variant="outline"
              className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Download Syllabus
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
