'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';

interface Notice {
  id: number;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
  };
}

export default function NoticeManagement() {
  const [notices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch notices
    setLoading(false);
  }, []);

  return (
    <RoleGuard 
      requiredPermissions={[Permission.CREATE_NOTICE]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Notice Management</h1>
          <Button>Create New Notice</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-lg">Loading notices...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {notices.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notices found</p>
              </div>
            ) : (
              notices.map((notice) => (
                <div key={notice.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{notice.title}</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{notice.content}</p>
                  <div className="text-sm text-gray-500">
                    Created by {notice.createdBy.firstName} {notice.createdBy.lastName} on{' '}
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
