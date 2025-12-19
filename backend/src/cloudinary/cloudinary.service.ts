import { Injectable, Inject, Logger } from '@nestjs/common';
import { UploadApiResponse, UploadApiErrorResponse, v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import * as fs from 'fs';
import * as path from 'path';

/**
 * CloudinaryService - Handles file uploads to Cloudinary CDN
 * 
 * Used For:
 * 1. Blog post images (uploadFromBuffer)
 * 2. Form attachments like portfolios, CVs (uploadFromPath)
 * 3. Client documents (PDFs, images, etc.)
 * 
 * Real Usage Examples in This Project:
 * 
 * ✅ BLOGS MODULE (blogs.service.ts):
 *    - Upload blog post images when creating/updating posts
 *    - Delete old images when updating posts
 * 
 * ✅ FORMS MODULE (forms.service.ts):
 *    - Upload equivalence form portfolios (PDF files)
 *    - Upload residence form documents
 * 
 * Flow Example:
 * 1. User uploads file via frontend form
 * 2. Multer middleware receives file (temp storage or buffer)
 * 3. CloudinaryService uploads to cloud
 * 4. Returns secure URL (https://res.cloudinary.com/...)
 * 5. URL saved to database
 * 6. Temp file deleted from server
 */
@Injectable()
export class CloudinaryService {
  private logger = new Logger(CloudinaryService.name);

  constructor(@Inject('CLOUDINARY') private cloudinaryInstance: typeof cloudinary) {}

  /**
   * Upload file from memory buffer to Cloudinary
   * 
   * USE CASE: Blog post images uploaded via form (file in memory)
   * 
   * Example Usage in blogs.service.ts:
   * ```typescript
   * const uploadResult = await this.cloudinaryService.uploadFromBuffer(
   *   imageFile.buffer,           // File buffer from Multer
   *   'blog-posts',               // Cloudinary folder
   *   imageFile.originalname      // Original filename
   * );
   * const imageUrl = uploadResult.secure_url;
   * // Save imageUrl to database: Post.imgUrl = imageUrl
   * ```
   * 
   * @param fileBuffer - File content in memory (from Multer)
   * @param folder - Cloudinary folder path (e.g., 'blog-posts', 'forms/equivalence')
   * @param fileName - Original file name (used for public_id)
   * @returns Upload result with secure_url property
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
   * Upload file from disk (temp storage) to Cloudinary
   * 
   * USE CASE: Form documents (PDFs, portfolios) saved temporarily to disk
   * 
   * Example Usage in forms.service.ts:
   * ```typescript
   * // Multer saves file to: uploads/forms/portfolio.pdf
   * const uploadResult = await this.cloudinaryService.uploadFromPath(
   *   file.path,              // 'uploads/forms/portfolio.pdf'
   *   'forms/equivalence'     // Cloudinary folder
   * );
   * const documentUrl = uploadResult.secure_url;
   * // Save to Client: client.folderEquivalence = documentUrl
   * // Temp file automatically deleted after upload
   * ```
   * 
   * Special Features:
   * - Converts PDFs to PNG for better web preview
   * - Auto-deletes local file after successful upload
   * - Generates unique public_id with timestamp
   * 
   * @param filePath - Local file path (e.g., 'uploads/forms/file.pdf')
   * @param folder - Cloudinary folder path
   * @returns Upload result with secure_url
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
   * Upload multiple files at once to Cloudinary
   * 
   * USE CASE: Batch upload of multiple documents (not currently used but available)
   * 
   * Example Usage:
   * ```typescript
   * const filePaths = [
   *   'uploads/passport.pdf',
   *   'uploads/cv.pdf',
   *   'uploads/diploma.pdf'
   * ];
   * const results = await this.cloudinaryService.uploadMultipleFromPath(
   *   filePaths,
   *   'forms/residence'
   * );
   * const urls = results.map(r => r.secure_url);
   * ```
   * 
   * @param filePaths - Array of local file paths
   * @param folder - Cloudinary folder path
   * @returns Array of upload results
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
   * Delete a file from Cloudinary
   * 
   * USE CASE: Remove old blog images when updating posts
   * 
   * Example Usage in blogs.service.ts:
   * ```typescript
   * // When updating blog post with new image:
   * const oldUrl = "https://res.cloudinary.com/.../blog-posts/12345-image.png";
   * const publicId = this.cloudinaryService.extractPublicId(oldUrl);
   * // publicId = "blog-posts/12345-image"
   * 
   * await this.cloudinaryService.deleteFile(publicId);
   * // Old image deleted from Cloudinary
   * ```
   * 
   * @param publicId - Cloudinary public ID (extracted from URL)
   * @returns Deletion result
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
   * Extract Cloudinary public_id from URL
   * 
   * USE CASE: Get public_id to delete files
   * 
   * Example:
   * ```typescript
   * const url = "https://res.cloudinary.com/demo/image/upload/v1234567890/blog-posts/my-image.png";
   * const publicId = extractPublicId(url);
   * // Returns: "blog-posts/my-image"
   * 
   * // Use for deletion:
   * await this.cloudinaryService.deleteFile(publicId);
   * ```
   * 
   * @param url - Full Cloudinary URL
   * @returns Public ID without version and extension
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
