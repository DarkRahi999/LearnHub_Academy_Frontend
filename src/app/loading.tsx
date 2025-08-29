"use client";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-100 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
      <p className="text-xl text-slate-700 dark:text-slate-200">Loading...</p>
    </div>
  );
}
