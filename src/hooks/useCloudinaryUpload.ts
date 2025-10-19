import CloudinaryService, { CloudinaryUploadResult } from '@/services/cloudinary.service';
import { useState } from 'react';

export interface UseCloudinaryUploadReturn {
  uploadImage: (file: File) => Promise<CloudinaryUploadResult>;
  uploadImageFromUrl: (url: string) => Promise<CloudinaryUploadResult>;
  uploading: boolean;
  error: string | null;
}

export const useCloudinaryUpload = (): UseCloudinaryUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<CloudinaryUploadResult> => {
    setUploading(true);
    setError(null);
    
    try {
      const result = await CloudinaryService.uploadImage(file);
      setUploading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      setUploading(false);
      throw err;
    }
  };

  const uploadImageFromUrl = async (url: string): Promise<CloudinaryUploadResult> => {
    setUploading(true);
    setError(null);
    
    try {
      const result = await CloudinaryService.uploadImageFromUrl(url);
      setUploading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image from URL';
      setError(errorMessage);
      setUploading(false);
      throw err;
    }
  };

  return {
    uploadImage,
    uploadImageFromUrl,
    uploading,
    error,
  };
};