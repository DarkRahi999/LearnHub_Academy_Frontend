'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserRole, Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { useRouter, useParams } from 'next/navigation';
import { courseService, Course, UpdateCourseDto } from '@/services/course.service';
import { useToast } from '@/hooks/use-toast';

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    highlight: '',
    imageUrl: '',
    price: '',
    discountPrice: '',
  });

  // Fetch course data when component mounts
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (id) {
          const courseId = parseInt(id as string);
          const course: Course = await courseService.getCourseById(courseId);
          setFormData({
            title: course.title,
            description: course.description,
            highlight: course.highlight,
            imageUrl: course.imageUrl || '',
            price: course.price?.toString() || '',
            discountPrice: course.discountPrice?.toString() || '',
          });
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch course data",
          variant: "destructive",
        });
        router.push('/admin/courses');
      } finally {
        setFetching(false);
      }
    };

    fetchCourse();
  }, [id, router, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        const courseId = parseInt(id as string);
        
        // Prepare data for submission
        const submitData: Partial<UpdateCourseDto> = {
          title: formData.title,
          description: formData.description,
          highlight: formData.highlight,
          imageUrl: formData.imageUrl || undefined,
        };

        // Only include price fields if they have values
        if (formData.price) {
          submitData.price = parseFloat(formData.price);
        } else {
          submitData.price = undefined; // Use undefined instead of null
        }
        
        if (formData.discountPrice) {
          submitData.discountPrice = parseFloat(formData.discountPrice);
        } else {
          submitData.discountPrice = undefined; // Use undefined instead of null
        }

        await courseService.updateCourse(courseId, submitData);
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
        router.push('/admin/courses');
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to update course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading course data...</div>
      </div>
    );
  }

  return (
    <RoleGuard
      allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}
      requiredPermissions={[Permission.UPDATE_COURSE]}
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-500">Access Denied</div>
        </div>
      }
    >
      <Header />
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
          <p className="text-gray-600">Update the course details</p>
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
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (Optional)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter course price (optional)"
              />
            </div>

            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Price (Optional)
              </label>
              <input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter discount price (optional)"
              />
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
                {loading ? 'Updating...' : 'Update Course'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </RoleGuard>
  );
}