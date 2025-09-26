"use client";

import Header from "@/components/layouts/Header";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import BannerCarousel from "@/components/own/BannerCarousel";
import Link from "next/link";
import Title from "@/components/own/Title";
import TopCourses from "@/components/own/TopCourses";
import Footer from "@/components/layouts/Footer";
import BooksSlider from "@/components/own/BooksSlider";
import WhyChooseUs from "@/components/own/WhyChooseUs";
import SuccessStories from "@/components/own/SuccessStories";

export default function HomePage() {
  const instituteDetails = {
    name: "ADMiSSION CHALLENGE",
    description:
      "Premier online education platform providing quality courses and training for students across Bangladesh.",
    shortHeadings: [
      "Join 5000+ Students Today",
      "Expert Instructors Available 24/7",
      "Certified Courses with Lifetime Access",
      "Affordable Pricing for All Students",
      "Interactive Learning Experience",
    ],
    features: [
      "Expert Instructors",
      "Interactive Learning",
      "24/7 Support",
      "Certified Courses",
    ],
    testimonials: [
      {
        id: 1,
        name: "Ahmed Rahman",
        role: "Computer Science Student",
        content:
          "Learnhub Academy transformed my understanding of programming.",
      },
      {
        id: 2,
        name: "Fatima Khatun",
        role: "Business Management",
        content:
          "The flexibility of online learning at Learnhub allowed me to balance my studies with work.",
      },
    ],
    contact: {
      phone: "+880 1729-249260",
      email: "info@learnhubacademy.com",
      address: "Rajshahi, Bangladesh",
    },
  };

  // Banner images
  const bannerImages = ["/img/banner/banner1.jpg", "/img/banner/banner2.jpg"];

  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);
  const [showHeadings, setShowHeadings] = useState(true);

  // Auto rotate short headings every 8 seconds (slower)
  useEffect(() => {
    const headingInterval = setInterval(() => {
      setCurrentHeadingIndex((prevIndex) =>
        prevIndex === instituteDetails.shortHeadings.length - 1
          ? 0
          : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(headingInterval);
  }, [instituteDetails.shortHeadings.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <Header />
      <div className="px-2 xs:px-6 sm:px-8">
        {showHeadings && (
          <div className="bg-red-600 text-white rounded-lg dark:bg-red-900 dark:border dark:border-red-800 mt-4 mb-6 animate-pulse">
            <div className="px-4 py-2 flex items-center justify-between">
              <div className="overflow-hidden flex items-center w-full">
                <div className="w-full">
                  <p className="text-sm font-semibold whitespace-nowrap overflow-hidden">
                    🎉 {instituteDetails.shortHeadings[currentHeadingIndex]}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHeadings(false)}
                className="text-white hover:text-gray-200 focus:outline-none p-1 ml-2"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto px-5">
        <div className="">
          <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
            {/* Right Column - Banner Details */}
            <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col pt-4 xl:pt-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-4">
                {instituteDetails.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">
                {instituteDetails.description}
              </p>

              {/* Reduced margin */}
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Why Choose Us?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instituteDetails.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center p-2 bg-red-50/50 dark:bg-slate-700/50 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                      <span className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reduced gap */}
              <div className="flex flex-wrap gap-3">
                <Link href="/course">
                  <Button className="bg-red-700 hover:bg-[#9a0000] text-white px-6 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    Explore Courses
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-2 border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-6 py-3 rounded-xl text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Contact Now
                </Button>
              </div>
            </div>
            {/* Left Column - Banner Carousel */}
            <div className="relative w-full md:w-1/2 lg:w-3/5 aspect-video md:min-h-[460px] lg:aspect-video rounded-2xl overflow-hidden shadow-2xl">
              <BannerCarousel images={bannerImages} />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Component */}
      <div className="px-4 pt-6 sm:pt-20">
        <Title
          title="Our Top Courses"
          description="Explore our most popular and recently added courses"
        />
      </div>
      <TopCourses />

      {/* This is the book list */}
      <div className="container mx-auto px-4 pt-6 sm:pt-20">
        <Title
          title="Our Top Books"
          description="Explore our most popular and recently added books"
        />
      </div>
      <BooksSlider />

      {/* This is the book list */}
      <div className="container mx-auto px-4 pt-6 sm:pt-20">
        <Title title="Why Choose Us?" description="" />
      </div>
      <WhyChooseUs />

      {/* Success Stories component here */}
      <div className="container mx-auto px-4 pt-6 sm:pt-20">
        <Title
          title="Success Students"
          description=""
        />
      </div>
      <SuccessStories />

      <Footer />
    </div>
  );
}
