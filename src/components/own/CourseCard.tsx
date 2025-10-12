"use client";

import { Course } from "@/services/course.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const pointsToShow = course.pointedText.slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-800 scale-up rounded-2xl overflow-hidden border border-white/50 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-300 transform max-lg:hover:scale-105 h-[97%] flex flex-col my-3">

      {/* -=> Course  Card Image */}
      {course.imageUrl ? (
        <div className="relative md:h-[250px] w-full">
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover !relative"
          />
        </div>
      ) : (
        <div className="bg-gray-200 border-2 border-dashed rounded-t-2xl w-full h-48 flex items-center justify-center">
          <span className="text-gray-500">No Image</span>
        </div>
      )}

      {/* -=> Course  Card Title */}
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-2 line-clamp-2">
          {course.title}
        </h2>

        {/* -=> Course Card High Light Text */}
        <p className="text-red-700 dark:text-red-400 text-md mb-3 line-clamp-2">
          {course.highlight}
        </p>

        {/* -=> Course Card price */}
        <div className="font-bold relative inline-block mb-4">
          <span className="text-4xl relative inline-block opacity-60 mr-2">
            {course.price}tk
            <span className="absolute inset-0 rotate-[-12deg] border-t-3 border-black  dark:border-white translate-y-[17px]"></span>
          </span>
          <span className="px-2 text-2xl text-red-600">
            {course.discountPrice}tk
          </span>
        </div>

        {/* -=> Course Card pointedText */}
        <ul className="space-y-1 text-lg text-gray-700 mb-4">
          {pointsToShow.map((point, index) => (
            <li key={index} className="flex items-center gap-2">
              <span>•</span>
              {point}
              {index === 2 && course.pointedText.length > 3 && (
                <Link
                  href={`/course/${course.id}`}
                  className="text-sm text-red-400 ml-2 "
                >
                  <i className="hover:underline hover:underline-offset-2">
                    See more...
                  </i>
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* -=> Course Card Buttons */}
        <div className="flex gap-3 mt-auto">
          <Link href={`/course/${course.id}`} className="flex-1">
            <Button className="secondary-btn">
              See Details
            </Button>
          </Link>
          <Button className="flex-1 primary-btn">
            Enroll Now
          </Button>
        </div>
      </div>
    </div>
  );
}
