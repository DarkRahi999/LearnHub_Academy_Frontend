"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminReportsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.replace("/admin/reports/dashboard");
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-center items-center h-64">
        <p className="text-lg">Redirecting to reports dashboard...</p>
      </div>
    </div>
  );
}