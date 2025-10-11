'use client';

import { useState } from 'react';
import Header from '@/components/layouts/Header';
import RoleGuard from '@/components/auth/RoleGuard';
import { UserRole, Permission } from '@/interface/user';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { courseService } from '@/services/course.service';
import { useToast } from '@/hooks/use-toast';
import { CreateCourseDto } from '@/services/course.service';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function CreateCourse() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    highlight: '',
    imageUrl: '',
    price: '',
    discountPrice: '',
  });
  const [pointedTexts, setPointedTexts] = useState(['', '', '']); // Minimum 3 items

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePointedTextChange = (index: number, value: string) => {
    const newPointedTexts = [...pointedTexts];
    newPointedTexts[index] = value;
    setPointedTexts(newPointedTexts);
  };

  const addPointedText = () => {
    if (pointedTexts.length < 5) {
      setPointedTexts([...pointedTexts, '']);
    }
  };

  const removePointedText = (index: number) => {
    if (pointedTexts.length > 3) {
      const newPointedTexts = pointedTexts.filter((_, i) => i !== index);
      setPointedTexts(newPointedTexts);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate that we have at least 3 non-empty pointedTexts
    const nonEmptyPointedTexts = pointedTexts.filter(text => text.trim() !== '');
    if (nonEmptyPointedTexts.length < 3) {
      toast({
        title: "Error",
        description: "Please provide at least 3 pointed text items",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Prepare data for submission
      const submitData: CreateCourseDto = {
        title: formData.title,
        description: formData.description,
        highlight: formData.highlight,
        pointedText: nonEmptyPointedTexts,
        imageUrl: formData.imageUrl || undefined,
        price: formData.price ? parseFloat(formData.price) : undefined,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : undefined,
      };

      // Log the data being sent for debugging
      console.log('Sending course data:', submitData);

      await courseService.createCourse(submitData);
      toast({
        title: "Success",
        description: "Course created successfully",
      });
      router.push('/admin/courses');
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course: " + (error as Error).message,
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
              <Input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={200}
                placeholder="Enter course title"
              />
              <p className="mt-1 text-sm text-gray-500">5-200 characters</p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                minLength={10}
                rows={4}
                placeholder="Enter course description"
              />
              <p className="mt-1 text-sm text-gray-500">Minimum 10 characters</p>
            </div>

            <div>
              <label htmlFor="highlight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Highlight
              </label>
              <Textarea
                id="highlight"
                name="highlight"
                value={formData.highlight}
                onChange={handleChange}
                required
                minLength={5}
                maxLength={300}
                rows={2}
                placeholder="Enter course highlight"
              />
              <p className="mt-1 text-sm text-gray-500">5-300 characters</p>
            </div>

            {/* Pointed Text Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Pointed Text Items
              </label>
              <p className="text-sm text-gray-500 mb-3">Add 3-5 key points about the course (minimum 3 required)</p>
              
              <div className="space-y-3">
                {pointedTexts.map((text, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={text}
                      onChange={(e) => handlePointedTextChange(index, e.target.value)}
                      placeholder={`Pointed text item ${index + 1}`}
                      className="flex-1"
                    />
                    {pointedTexts.length > 3 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removePointedText(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              
              {pointedTexts.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPointedText}
                  className="mt-3"
                >
                  Add Pointed Text Item
                </Button>
              )}
              
              <p className="mt-2 text-sm text-gray-500">
                {pointedTexts.length}/5 items ({5 - pointedTexts.length} more can be added)
              </p>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price (Optional)
              </label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter course price (optional)"
              />
            </div>

            <div>
              <label htmlFor="discountPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Discount Price (Optional)
              </label>
              <Input
                type="number"
                id="discountPrice"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter discount price (optional)"
              />
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL (Optional)
              </label>
              <Input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
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