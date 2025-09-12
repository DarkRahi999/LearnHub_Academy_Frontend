'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';

interface Post {
  id: number;
  title: string;
  content: string;
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
  };
}

export default function PostManagement() {
  const [posts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Implement API call to fetch posts
    setLoading(false);
  }, []);

  return (
    <RoleGuard 
      requiredPermissions={[Permission.CREATE_POST]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied - Super Admin Only</div>
        </div>
      }
    >
      <Header />
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Post Management</h1>
          <Button>Create New Post</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-lg">Loading posts...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No posts found</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{post.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        post.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{post.content}</p>
                  <div className="text-sm text-gray-500">
                    Created by {post.createdBy.firstName} {post.createdBy.lastName} on{' '}
                    {new Date(post.createdAt).toLocaleDateString()}
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
