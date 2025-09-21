import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Course } from '@/services/course.service';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 h-full flex flex-col">
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
      
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h2>
        
        {/* Price display */}
        <div className="mb-3">
          {course.discountPrice !== undefined && course.discountPrice !== null && course.price && course.discountPrice < course.price ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-700 dark:text-red-400">
                {course.discountPrice} <span className="text-lg">TK</span>
              </span>
              <span className="text-lg text-gray-500 line-through">
                {course.price} TK
              </span>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                {Math.round(((course.price - course.discountPrice) / course.price) * 100)}% OFF
              </span>
            </div>
          ) : course.price ? (
            <div className="text-2xl font-bold text-red-700 dark:text-red-400">
              {course.price} <span className="text-lg">TK</span>
            </div>
          ) : (
            <div className="text-lg font-medium text-green-600 dark:text-green-400">
              Free
            </div>
          )}
        </div>
        
        <p className="text-red-700 dark:text-red-400 font-medium mb-3 line-clamp-2">
          {course.highlight}
        </p>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
          {course.description}
        </p>
        
        <div className="flex gap-3 mt-auto">
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
  );
}