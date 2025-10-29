'use client';

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { useToast } from '@/hooks/use-toast';

export interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  accept?: string;
  onUploadStart?: () => void;
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export interface ImageUploadRef {
  triggerUpload: () => void;
}

const ImageUpload = forwardRef<ImageUploadRef, ImageUploadProps>(({
  value,
  onChange,
  placeholder = "Upload an image",
  disabled = false,
  accept = "image/*",
  onUploadStart,
  onUploadComplete,
  onUploadError,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { uploadImage, uploading } = useCloudinaryUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUploadStart?.();
    
    try {
      const result = await uploadImage(file);
      onChange?.(result.secure_url);
      onUploadComplete?.(result.secure_url);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      onUploadError?.(errorMessage);
      
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  useImperativeHandle(ref, () => ({
    triggerUpload,
  }));

  return (
    <div className="flex items-center gap-4">
      <Input
        value={value || ''}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        disabled={disabled || uploading}
      />
      <Button
        type="button"
        onClick={triggerUpload}
        disabled={disabled || uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </Button>
    </div>
  );
});

ImageUpload.displayName = 'ImageUpload';

export { ImageUpload };