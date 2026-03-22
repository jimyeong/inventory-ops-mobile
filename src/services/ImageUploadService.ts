import { uploadApiClient } from './ApiService';
import { OptimizedImage } from './ImageOptimizationService';
import {ServiceResponse}  from './ApiService';

export interface ImageUploadResult {
  image_id: string;
  image_path: string;
  message: string;
  success: boolean;
  timestamp: string;
  file_name: string;
}

class ImageUploadService {
  async uploadImage(optimizedImage: OptimizedImage): Promise<ServiceResponse<ImageUploadResult>> {
    try {
      const formData = new FormData();

      formData.append('image', {
        uri: optimizedImage.uri,
        type: 'image/jpeg',
        name: optimizedImage.fileName,
      } as any);

      formData.append('metadata', JSON.stringify({
        originalSize: optimizedImage.fileSize,
        width: optimizedImage.width,
        height: optimizedImage.height,
        uploadedAt: new Date().toISOString(),
      }));

      const response = await uploadApiClient.post('/api/v1/upload/image', formData);

      if (response.data && response.data.success) {
        return response.data;
      } else {
        return response.data;
      }
    } catch (error: any) {
      console.error('Image upload error:', error);

      let errorMessage = 'Upload failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return error.response.data;
    }
  }

  async uploadMultipleImages(images: OptimizedImage[]): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];

    for (const image of images) {
      const result = await this.uploadImage(image);
      // results.push(result);
    }

    return results;
  }

  async deleteImage(imagePath: string): Promise<ServiceResponse<{ success: boolean; error?: string }> > {
    try {
      const response = await uploadApiClient.delete(`/api/v1/delete/image?imagePath=${imagePath}`);
      return response.data;
    } catch (error: any) {
      console.error('Image delete error:', error);
      return error.response.data;
    }
  }
}

export default new ImageUploadService();