import ImageResizer from '@bam.tech/react-native-image-resizer';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Alert, PermissionsAndroid, Platform } from 'react-native';

export interface OptimizedImage {
  uri: string;
  base64?: string;
  fileName: string;
  fileSize: number;
  width: number;
  height: number;
  
}

export interface ImagePickerResult {
  success: boolean;
  image?: OptimizedImage;
  error?: string;
}

class ImageOptimisationUtil {
  private readonly MAX_FILE_SIZE = 50 * 1024; // 50KB
  private readonly MAX_WIDTH = 800;
  private readonly MAX_HEIGHT = 600;
  private readonly QUALITY = 70;

  async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to camera to take pictures of items.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.error('Camera permission error:', err);
        return false;
      }
    }
    return true;
  }

  async pickImageFromCamera(): Promise<ImagePickerResult> {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      return {
        success: false,
        error: 'Camera permission denied',
      };
    }

    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: this.MAX_WIDTH,
        maxHeight: this.MAX_HEIGHT,
        includeBase64: false,
      };

      launchCamera(options as any, async (response) => {
        if (response.didCancel || response.errorMessage) {
          resolve({
            success: false,
            error: response.errorMessage || 'Camera cancelled',
          });
          return;
        }

        if (response.assets && response.assets[0]) {
          const optimizedImage = await this.optimizeImage(response.assets[0]);
          resolve(optimizedImage);
        } else {
          resolve({
            success: false,
            error: 'No image selected',
          });
        }
      });
    });
  }

  async pickImageFromGallery(): Promise<ImagePickerResult> {
    return new Promise((resolve) => {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: this.MAX_WIDTH,
        maxHeight: this.MAX_HEIGHT,
        includeBase64: false,
      };

      launchImageLibrary(options as any, async (response) => {
        if (response.didCancel || response.errorMessage) {
          resolve({
            success: false,
            error: response.errorMessage || 'Gallery selection cancelled',
          });
          return;
        }

        if (response.assets && response.assets[0]) {
          const optimizedImage = await this.optimizeImage(response.assets[0]);
          resolve(optimizedImage);
        } else {
          resolve({
            success: false,
            error: 'No image selected',
          });
        }
      });
    });
  }

  async optimizeImage(imageAsset: any): Promise<ImagePickerResult> {
    try {
      const { uri, fileName, fileSize, width, height } = imageAsset;

      if (!uri) {
        return {
          success: false,
          error: 'Invalid image URI',
        };
      }

      // If already under 50KB, return as is
      if (fileSize && fileSize <= this.MAX_FILE_SIZE) {
        return {
          success: true,
          image: {
            uri,
            fileName: fileName || `image_${Date.now()}.jpg`,
            fileSize: fileSize || 0,
            width: width || 0,
            height: height || 0,
          },
        };
      }

      // Resize and compress the image
      let quality = this.QUALITY;
      let resizedImage;
      let attempts = 0;
      const maxAttempts = 5;

      do {
        attempts++;

        // Calculate dimensions while maintaining aspect ratio
        const aspectRatio = width && height ? width / height : 1;
        let targetWidth = this.MAX_WIDTH;
        let targetHeight = this.MAX_HEIGHT;

        if (aspectRatio > 1) {
          // Landscape
          targetHeight = Math.round(targetWidth / aspectRatio);
        } else {
          // Portrait or square
          targetWidth = Math.round(targetHeight * aspectRatio);
        }

        resizedImage = await ImageResizer.createResizedImage(
          uri,
          targetWidth,
          targetHeight,
          'JPEG',
          quality,
          0, // rotation
          undefined, // outputPath
          false, // keepMeta
          {
            mode: 'contain',
            onlyScaleDown: true,
          }
        );

        // Reduce quality for next attempt if file is still too large
        quality = Math.max(20, quality - 15);

      } while (resizedImage.size > this.MAX_FILE_SIZE && attempts < maxAttempts);

      // Final check - if still too large, try more aggressive compression
      if (resizedImage.size > this.MAX_FILE_SIZE) {
        resizedImage = await ImageResizer.createResizedImage(
          uri,
          400, // Very small dimensions
          300,
          'JPEG',
          20, // Very low quality
          0,
          undefined,
          false,
          {
            mode: 'contain',
            onlyScaleDown: true,
          }
        );
      }

      return {
        success: true,
        image: {
          uri: resizedImage.uri,
          fileName: fileName || `optimized_${Date.now()}.jpg`,
          fileSize: resizedImage.size,
          width: resizedImage.width,
          height: resizedImage.height,
        },
      };

    } catch (error) {
      console.error('Image optimization error:', error);
      return {
        success: false,
        error: `Image optimization failed: ${error}`,
      };
    }
  }

  showImagePickerOptions(onCamera: () => void, onGallery: () => void) {
    Alert.alert(
      'Select Image',
      'Choose an option to add item image',
      [
        { text: 'Camera', onPress: onCamera },
        { text: 'Gallery', onPress: onGallery },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

export default new ImageOptimisationUtil();