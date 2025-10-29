'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { courseService } from '@/services/course.service';
import { useToast } from '@/hooks/use-toast';
import { CreateCourseDto } from '@/services/course.service';
import { Button } from '@/components/ui/button';
import { F1Input } from '@/components/feature/F1Input';
import { F1Textarea } from '@/components/feature/F1Textarea';
import { F1Amount } from '@/components/feature/F1Amount';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
} from "@/components/ui/form";
import { ImageUpload } from '@/components/ui/image-upload';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';

// Define validation schema using Zod
const courseSchema = z.object({
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(200, { message: "Title must be at most 200 characters" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters" }),
  highlight: z.string()
    .min(5, { message: "Highlight must be at least 5 characters" })
    .max(50, { message: "Highlight must be at most 50 characters" }),
  imageUrl: z.string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .or(z.literal("")),
  price: z.string()
    .optional(),
  discountPrice: z.string()
    .optional(),
});

type CourseFormValues = z.infer<typeof courseSchema>;

interface CourseCreateFormProps {
  onSuccess?: () => void;
}

export function CourseCreateForm({ onSuccess }: CourseCreateFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [pointedTexts, setPointedTexts] = useState(['', '', '']); // Minimum 3 items
  const { uploading: cloudinaryUploading, error: uploadError } = useCloudinaryUpload();

  // Initialize form with react-hook-form and Zod validation
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      highlight: "",
      imageUrl: "",
      price: "",
      discountPrice: "",
    },
  });

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

  const onSubmit = async (values: CourseFormValues) => {
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
        title: values.title,
        description: values.description,
        highlight: values.highlight,
        pointedText: nonEmptyPointedTexts,
        imageUrl: values.imageUrl || undefined,
        price: values.price ? parseFloat(values.price) : undefined,
        discountPrice: values.discountPrice ? parseFloat(values.discountPrice) : undefined,
      };

      await courseService.createCourse(submitData);
      toast({
        title: "Success",
        description: "Course created successfully",
        variant: "default", // This will use the default (green) styling
      });
      
      // Reset form
      form.reset();
      setPointedTexts(['', '', '']);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course: " + (error as Error).message,
        variant: "destructive", // This will use the destructive (red) styling
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <F1Input
          name="title"
          label="Course Title"
          star
          placeholder="Enter course title"
          note="5-200 characters"
        />

        <F1Textarea
          name="description"
          label="Description"
          star
          placeholder="Enter course description"
          note="Minimum 10 characters"
          rows={4}
        />

        <F1Textarea
          name="highlight"
          label="Highlight"
          star
          placeholder="Enter course highlight"
          note="5-50 characters"
          rows={2}
        />

        {/* Pointed Text Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Pointed Text Items
          </label>
          <p className="text-sm text-gray-500 mb-3">Add 3-5 key points about the course (minimum 3 required)</p>
          
          <div className="space-y-3">
            {pointedTexts.map((text, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => handlePointedTextChange(index, e.target.value)}
                  placeholder={`Pointed text item ${index + 1}`}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1"
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

        <F1Amount
          name="price"
          label="Price (Optional)"
          placeholder="Enter course price (optional)"
          note="Enter amount in decimal format"
        />

        <F1Amount
          name="discountPrice"
          label="Discount Price (Optional)"
          placeholder="Enter discount price (optional)"
          note="Enter amount in decimal format"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Image Upload
          </label>
          <ImageUpload
            value={form.watch('imageUrl') || ''}
            onChange={(url) => form.setValue('imageUrl', url)}
            placeholder="Click to upload course image"
            disabled={loading || cloudinaryUploading}
          />
          {uploadError && (
            <p className="text-sm text-red-500 mt-1">{uploadError}</p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={() => router.push('/admin/courses')}
            variant="outline"
            disabled={loading || cloudinaryUploading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || cloudinaryUploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Creating...' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Form>
  );
}