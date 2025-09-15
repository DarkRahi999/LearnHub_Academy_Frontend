'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import RoleBadge from '@/components/auth/RoleBadge';
import { UserRole, Permission, UserProfile } from '@/interface/user';
import { getCurrentUser } from '@/services/auth.service';
import { Button } from '@/components/ui/button';

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
      <Header />
      <div className="container mx-auto py-6">
        <div className="mb-6">
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
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Notice Management</h3>
              <p className="text-gray-600 mb-4">Create and manage notices for users</p>
              <Button asChild>
                <a href="/admin/notices">Manage Notices</a>
              </Button>
            </div>
          </RoleGuard>

          <RoleGuard requiredPermissions={[Permission.MANAGE_USERS]}>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">User Management</h3>
              <p className="text-gray-600 mb-4">View and manage user accounts</p>
              <Button asChild>
                <a href="/admin/users">Manage Users</a>
              </Button>
            </div>
          </RoleGuard>

          <RoleGuard requiredPermissions={[Permission.CREATE_POST]}>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Post Management</h3>
              <p className="text-gray-600 mb-4">Create and manage posts</p>
              <Button asChild>
                <a href="/admin/posts">Manage Posts</a>
              </Button>
            </div>
          </RoleGuard>

          <RoleGuard requiredPermissions={[Permission.MANAGE_ADMINS]}>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Admin Management</h3>
              <p className="text-gray-600 mb-4">Manage admin roles and permissions</p>
              <Button asChild>
                <a href="/admin/admins">Manage Admins</a>
              </Button>
            </div>
          </RoleGuard>

          <RoleGuard requiredPermissions={[Permission.SYSTEM_SETTINGS]}>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">System Settings</h3>
              <p className="text-gray-600 mb-4">Configure system-wide settings</p>
              <Button asChild>
                <a href="/admin/system-settings">System Settings</a>
              </Button>
            </div>
          </RoleGuard>
        </div>
      </div>
    </RoleGuard>
  );
}
