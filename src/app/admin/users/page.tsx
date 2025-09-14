'use client';

import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';

export default function userManagement() {
  return (
    <RoleGuard
      requiredPermissions={[Permission.MANAGE_USERS]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">User Settings</h1>
          <Button>Create User Settings</Button>
        </div>

        <div className="flex justify-center items-center h-40">
          <div className="text-lg">Loading all Users...</div>
        </div>
      </div>
    </RoleGuard>
  );
}
