"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/interface/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { courseService, UpdateCourseDto } from "@/services/course.service";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { Permission } from "@/interface/permission";

export default function EditCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    highlight: "",
    imageUrl: "",
    price: "",
    discountPrice: "",
    pointedText: [''] as string[],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');
  const { toast } = useToast();
  const { uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (courseId) {
          const course = await courseService.getCourseById(parseInt(courseId));
          setFormData({
            title: course.title,
            description: course.description,
            highlight: course.highlight,
            imageUrl: course.imageUrl || "",
            price: course.price?.toString() || "",
            discountPrice: course.discountPrice?.toString() || "",
            pointedText: course.pointedText || [''],
          });
        }
      } catch {
        setError("Failed to fetch course data");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

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
    const newPointedTexts = [...formData.pointedText];
    newPointedTexts[index] = value;
    setFormData(prev => ({ ...prev, pointedText: newPointedTexts }));
  };

  const addPointedText = () => {
    if (formData.pointedText.length < 5) {
      setFormData(prev => ({ ...prev, pointedText: [...prev.pointedText, ""] }));
    }
  };

  const removePointedText = (index: number) => {
    if (formData.pointedText.length > 3) {
      const newPointedTexts = formData.pointedText.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, pointedText: newPointedTexts }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    // Validate that we have at least 3 non-empty pointedTexts
    const nonEmptyPointedTexts = formData.pointedText.filter(
      (text) => text.trim() !== ""
    );
    if (nonEmptyPointedTexts.length < 3) {
      toast({
        title: "Error",
        description: "Please provide at least 3 pointed text items",
        variant: "destructive",
      });
      setSaving(false);
      return;
    }

    try {
      if (courseId) {
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

        await courseService.updateCourse(parseInt(courseId), submitData);
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
      setSaving(false);
    }
  };

  if (loading) {
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
    >
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-rose-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="container mx-auto py-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Edit Course</h1>
                <p className="text-gray-600 dark:text-gray-400">Update course details</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Course Title</Label>
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
                    <Label htmlFor="description">Description</Label>
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
                    <Label htmlFor="highlight">Highlight</Label>
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
                    <Label>Pointed Text Items</Label>
                    <p className="text-sm text-gray-500 mb-3">
                      Add 3-5 key points about the course (minimum 3 required)
                    </p>

                    <div className="space-y-3">
                      {formData.pointedText.map((text, index) => (
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
                          {formData.pointedText.length > 3 && (
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

                    {formData.pointedText.length < 5 && (
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
                      {formData.pointedText.length}/5 items ({5 - formData.pointedText.length} more
                      can be added)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="price">Price (Optional)</Label>
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
                    <Label htmlFor="discountPrice">Discount Price (Optional)</Label>
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
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                      placeholder="Click to upload course image"
                      disabled={saving || cloudinaryUploading || loading}
                    />
                    {uploadError && (
                      <p className="text-sm text-red-500 mt-1">{uploadError}</p>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      onClick={() => router.push("/admin/courses")}
                      variant="outline"
                      disabled={saving || cloudinaryUploading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving || cloudinaryUploading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {saving ? "Updating..." : "Update Course"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}