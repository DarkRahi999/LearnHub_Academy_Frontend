"use client";

import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { courseService, Course } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function TopCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await courseService.getAllCourses({
          page: 1,
          limit: 4,
          sortBy: "createdAt",
          sortOrder: "DESC",
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-slate-700 dark:text-slate-300">
          Loading courses...
        </p>
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
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
              No Courses Available
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
              We don&#39;t have any courses available at the moment. Check back
              soon for exciting new courses!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/course">
                <Button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium">
                  Browse All Courses
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-6 py-3 rounded-lg font-medium"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-5">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent>
            {courses?.slice(0,4).map((course) => (
              <CarouselItem
                key={course.id}
                className="lg:basis-1/3 md:basis-1/2 basis-full"
              >
                <CourseCard course={course} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
