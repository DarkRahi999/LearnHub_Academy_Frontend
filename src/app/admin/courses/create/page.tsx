"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole, Permission } from "@/interface/user";
import { useRouter } from "next/navigation";
import { CourseCreateForm } from "@/components/feature/CourseCreateForm";

export default function CreateCourse() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/courses");
  };

  return (
    <RoleGuard
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[Permission.CREATE_COURSE]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
        <p className="text-gray-600">
          Fill in the details to create a new course
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <CourseCreateForm onSuccess={handleSuccess} />
      </div>
    </RoleGuard>
  );
}
