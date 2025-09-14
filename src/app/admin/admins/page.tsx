'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';

export default function AdminManagement() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch notices
    setLoading(false);
  }, []);

  return (
    <RoleGuard
      requiredPermissions={[Permission.MANAGE_ADMINS]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <Button>Create New Admin</Button>
        </div>

        <div className="flex justify-center items-center h-40">
          {loading ? (
            <div className="text-lg">Loading all admins...</div>
          ) : (
            <div className="text-lg text-gray-500">No admins found. Feature coming soon!</div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
