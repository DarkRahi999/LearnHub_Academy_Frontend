'use client';

import { useState } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserRole, Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { courseService } from '@/services/course.service';
import { useToast } from '@/hooks/use-toast';

export default function CreateCourse() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    highlight: '',
    imageUrl: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await courseService.createCourse(formData);
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      router.push('/admin/courses');
    } catch {
      toast({
        title: "Error",
        description: "Failed to create course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
      <Header />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-gray-600">Fill in the details to create a new course</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter course title"
              />
              <p className="mt-1 text-sm text-gray-500">5-200 characters</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter course description"
              />
              <p className="mt-1 text-sm text-gray-500">Minimum 10 characters</p>
            </div>

            <div>
              <label htmlFor="highlight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Highlight
              </label>
              <textarea
                id="highlight"
                name="highlight"
                value={formData.highlight}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={300}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter course highlight"
              />
              <p className="mt-1 text-sm text-gray-500">5-300 characters</p>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter image URL"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={() => router.push('/admin/courses')}
                variant="outline"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Creating...' : 'Create Course'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}