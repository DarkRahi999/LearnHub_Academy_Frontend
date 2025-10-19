"use client";

import { useState, useEffect, useRef } from "react";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole, Permission } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import {
  courseService,
  Course,
  UpdateCourseDto,
} from "@/services/course.service";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";

export default function EditCourse() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    highlight: "",
    imageUrl: "",
    price: "",
    discountPrice: "",
  });
  const [pointedTexts, setPointedTexts] = useState(["", "", ""]); // Minimum 3 items
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();

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
            imageUrl: course.imageUrl || "",
            price: course.price?.toString() || "",
            discountPrice: course.discountPrice?.toString() || "",
          });

          // Set pointedTexts if they exist in the course data
          if (course.pointedText && Array.isArray(course.pointedText)) {
            setPointedTexts(course.pointedText);
          }
        }
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch course data",
          variant: "destructive",
        });
        router.push("/admin/courses");
      } finally {
        setFetching(false);
      }
    };

    fetchCourse();
  }, [id, router, toast]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePointedTextChange = (index: number, value: string) => {
    const newPointedTexts = [...pointedTexts];
    newPointedTexts[index] = value;
    setPointedTexts(newPointedTexts);
  };

  const addPointedText = () => {
    if (pointedTexts.length < 5) {
      setPointedTexts([...pointedTexts, ""]);
    }
  };

  const removePointedText = (index: number) => {
    if (pointedTexts.length > 3) {
      const newPointedTexts = pointedTexts.filter((_, i) => i !== index);
      setPointedTexts(newPointedTexts);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        imageUrl: result.secure_url
      }));
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Validate that we have at least 3 non-empty pointedTexts
    const nonEmptyPointedTexts = pointedTexts.filter(
      (text) => text.trim() !== ""
    );
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
      if (id) {
        const courseId = parseInt(id as string);

        // Prepare data for submission
        const submitData: Partial<UpdateCourseDto> = {
          title: formData.title,
          description: formData.description,
          highlight: formData.highlight,
          pointedText: nonEmptyPointedTexts,
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
        router.push("/admin/courses");
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
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Edit Course</h1>
            <p className="text-gray-600">Update the course details</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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
                <p className="mt-1 text-sm text-gray-500">
                  Minimum 10 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="highlight"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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
                <p className="text-sm text-gray-500 mb-3">
                  Add 3-5 key points about the course (minimum 3 required)
                </p>

                <div className="space-y-3">
                  {pointedTexts.map((text, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        type="text"
                        value={text}
                        onChange={(e) =>
                          handlePointedTextChange(index, e.target.value)
                        }
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
                  {pointedTexts.length}/5 items ({5 - pointedTexts.length} more
                  can be added)
                </p>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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
                <label
                  htmlFor="discountPrice"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
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

              {/* Image Upload Section - Modified to keep only file upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Image Upload
                </label>
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    value={formData.imageUrl || "Image will be uploaded automatically"}
                    placeholder="Image will be uploaded automatically"
                    className="flex-1"
                    readOnly
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || cloudinaryUploading}
                  >
                    {uploading || cloudinaryUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
                {uploadError && (
                  <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={() => router.push("/admin/courses")}
                  variant="outline"
                  disabled={loading || uploading || cloudinaryUploading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || uploading || cloudinaryUploading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Updating..." : "Update Course"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}