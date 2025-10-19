import axios from 'axios';
import { API_BASE_URL } from '@/config/configURL';

export interface CloudinaryUploadResult {
  url: string;
  public_id: string;
  secure_url: string;
}

export class CloudinaryService {
  /**
   * Upload an image file through the backend proxy
   * @param file - The image file to upload
   * @returns Promise with upload result
   */
  static async uploadImage(file: File): Promise<CloudinaryUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use axios to make the request with proper headers
      const response = await axios.post<CloudinaryUploadResult>(
        `${API_BASE_URL}/api/cloudinary/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to upload image: ${error}`);
    }
  }

  /**
   * Upload an image from a URL through the backend proxy
   * @param url - The URL of the image to upload
   * @returns Promise with upload result
   */
  static async uploadImageFromUrl(url: string): Promise<CloudinaryUploadResult> {
    try {
      const response = await axios.post<CloudinaryUploadResult>(
        `${API_BASE_URL}/api/cloudinary/upload-url`,
        { url },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to upload image from URL: ${error}`);
    }
  }
}

export default CloudinaryService;