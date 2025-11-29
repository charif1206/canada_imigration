import { Injectable, Inject, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);

  constructor(@Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary) {}

  /**
   * Upload file from buffer to Cloudinary
   * @param fileBuffer File buffer
   * @param folder Cloudinary folder path (e.g., 'forms/equivalence')
   * @param fileName Original file name
   * @returns Upload result with URL
   */
  async uploadFromBuffer(
    fileBuffer: Buffer,
    folder: string,
    fileName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinaryInstance.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'auto',
          public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`, // Remove extension
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            this.logger.error(`Cloudinary upload error: ${error.message}`);
            return reject(error);
          }
          this.logger.log(`File uploaded to Cloudinary: ${result?.secure_url}`);
          resolve(result!);
        },
      );

      streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Upload file from disk to Cloudinary
   * @param filePath Local file path
   * @param folder Cloudinary folder path (e.g., 'forms/equivalence')
   * @returns Upload result with URL
   */
  async uploadFromPath(
    filePath: string,
    folder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      const fileName = path.basename(filePath);
      const fileExtension = path.extname(filePath).toLowerCase();
      
      // For PDFs, upload as image with first page conversion
      const uploadOptions: any = {
        folder: folder,
        public_id: `${Date.now()}-${fileName.replace(/\.[^/.]+$/, '')}`,
        access_mode: 'public',
        overwrite: true,
        invalidate: true,
      };

      // If PDF, convert to image format for better accessibility
      if (fileExtension === '.pdf') {
        uploadOptions.resource_type = 'image';
        uploadOptions.format = 'png';
        uploadOptions.quality = 'auto';
      } else {
        uploadOptions.resource_type = 'auto';
      }
      
      const result = await this.cloudinaryInstance.uploader.upload(filePath, uploadOptions);

      this.logger.log(`File uploaded to Cloudinary: ${result.secure_url}`);
      
      // Delete local file after successful upload
      this.deleteLocalFile(filePath);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to upload file to Cloudinary: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Upload multiple files from disk to Cloudinary
   * @param filePaths Array of local file paths
   * @param folder Cloudinary folder path
   * @returns Array of upload results with URLs
   */
  async uploadMultipleFromPath(
    filePaths: string[],
    folder: string,
  ): Promise<(UploadApiResponse | UploadApiErrorResponse)[]> {
    const uploadPromises = filePaths.map((filePath) =>
      this.uploadFromPath(filePath, folder),
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from Cloudinary by public_id
   * @param publicId Cloudinary public ID
   */
  async deleteFile(publicId: string): Promise<any> {
    try {
      const result = await this.cloudinaryInstance.uploader.destroy(publicId);
      this.logger.log(`File deleted from Cloudinary: ${publicId}`);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to delete file from Cloudinary: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Delete local file after successful upload
   * @param filePath Local file path
   */
  private deleteLocalFile(filePath: string): void {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.logger.log(`Local file deleted: ${filePath}`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to delete local file: ${errorMessage}`);
    }
  }

  /**
   * Extract public_id from Cloudinary URL
   * @param url Cloudinary URL
   * @returns Public ID
   */
  extractPublicId(url: string): string | null {
    try {
      const regex = /\/v\d+\/(.+)\.\w+$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to extract public_id from URL: ${errorMessage}`);
      return null;
    }
  }
}
