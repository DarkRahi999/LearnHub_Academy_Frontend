"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layouts/Header";
import RoleGuard from "@/components/auth/RoleGuard";
import RoleBadge from "@/components/auth/RoleBadge";
import { UserRole, Permission, UserProfile } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/auth.service";
import {
  Shield,
  Users,
  FileText,
  Settings,
  BookOpen,
  NotebookText,
} from "lucide-react";

export default function AdminDashboard() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <RoleGuard
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <Header />
        <div className="container mx-auto py-6">
          <div className="mb-6 mx-4">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            {user && (
              <div className="flex items-center gap-2">
                <span>Welcome, {user.firstName}!</span>
                <RoleBadge role={user.role} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Admin Actions */}
            <RoleGuard requiredPermissions={[Permission.CREATE_NOTICE]}>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                  <h3 className="text-xl font-semibold">Notice Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Create and manage notices for users
                </p>
                <Button asChild>
                  <a href="/admin/notices">Manage Notices</a>
                </Button>
              </div>
            </RoleGuard>

            <RoleGuard
              requiredPermissions={[
                Permission.CREATE_BOOK,
                Permission.UPDATE_BOOK,
                Permission.DELETE_BOOK,
              ]}
            >
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <NotebookText className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold">Book Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Create and manage books</p>
                <Button asChild>
                  <a href="/admin/books">Manage Books</a>
                </Button>
              </div>
            </RoleGuard>

            <RoleGuard
              requiredPermissions={[
                Permission.CREATE_COURSE,
                Permission.UPDATE_COURSE,
                Permission.DELETE_COURSE,
              ]}
            >
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                  <h3 className="text-xl font-semibold">Course Management</h3>
                </div>
                <p className="text-gray-600 mb-4">Create and manage courses</p>
                <Button asChild>
                  <a href="/admin/courses">Manage Courses</a>
                </Button>
              </div>
            </RoleGuard>

            <RoleGuard requiredPermissions={[Permission.MANAGE_USERS]}>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="h-6 w-6 text-green-600" />
                  <h3 className="text-xl font-semibold">User Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  View and manage user accounts
                </p>
                <Button asChild>
                  <a href="/admin/users">Manage Users</a>
                </Button>
              </div>
            </RoleGuard>

            <RoleGuard requiredPermissions={[Permission.MANAGE_ADMINS]}>
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-6 w-6 text-yellow-600" />
                  <h3 className="text-xl font-semibold">Admin Management</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Manage admin roles and permissions
                </p>
                <Button asChild>
                  <a href="/admin/admins">Manage Admins</a>
                </Button>
              </div>
            </RoleGuard>

            <RoleGuard
              allowedRoles={[UserRole.SUPER_ADMIN]}
              requiredPermissions={[Permission.SYSTEM_SETTINGS]}
            >
              <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="h-6 w-6 text-red-600" />
                  <h3 className="text-xl font-semibold">System Settings</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Configure system-wide settings
                </p>
                <Button asChild>
                  <a href="/admin/system-settings">System Settings</a>
                </Button>
              </div>
            </RoleGuard>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
