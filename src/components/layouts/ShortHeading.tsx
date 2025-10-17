"use client";

import { useEffect, useState } from "react";
import instituteDetails from "@/app/db/institute";
import { X } from "lucide-react";

const ShortHeading = () => {
  const [showHeadings, setShowHeadings] = useState(true);
  const [currentHeadingIndex, setCurrentHeadingIndex] = useState(0);

  //W---------={ Auto rotate short headings every 8 seconds (slower) }=----------
  useEffect(() => {
    const headingInterval = setInterval(() => {
      setCurrentHeadingIndex((prevIndex) =>
        prevIndex === instituteDetails.shortHeadings.length - 1
          ? 0
          : prevIndex + 1
      );
    }, 8000);

    return () => clearInterval(headingInterval);
  }, []);

  return (
    <>
      {showHeadings && (
        <div className="bg-red-600 text-white rounded-lg dark:bg-red-900 dark:border dark:border-red-800 mt-4 animate-pulse">
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
    </>
  );
};

export default ShortHeading;