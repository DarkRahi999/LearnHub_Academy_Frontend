'use client';

import { useState, useEffect } from 'react';
import RoleGuard from '@/components/auth/RoleGuard';
import { Button } from '@/components/ui/button';
import { Permission } from '@/interface/permission';

export default function SystemSettings() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <RoleGuard
      requiredPermissions={[Permission.SYSTEM_SETTINGS]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6 mx-4">
          <h1 className="text-3xl font-bold">System Settings</h1>
          <Button>Access Settings</Button>
        </div>

        <div className="flex justify-center items-center h-40">
          {loading ? (
            <div className="text-lg">Loading all Permissions...</div>
          ) : (
            <div className="text-lg text-gray-500">No settings found. Feature coming soon!</div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
