import { Logger } from '@nestjs/common';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { FileUploadResult } from '../interfaces/forms.interface';
import { LOG_MESSAGES } from '../constants/forms.constants';

const logger = new Logger('FileUploadHelper');

/**
 * Upload file to Cloudinary
 * @param file - Multer file object
 * @param cloudinaryService - Cloudinary service instance
 * @param folder - Cloudinary folder path
 * @returns Upload result with URL or null
 */
export async function uploadFileToCloudinary(
  file: any,
  cloudinaryService: CloudinaryService,
  folder: string,
): Promise<FileUploadResult> {
  if (!file || !file.path) {
    return { url: null, uploaded: false };
  }

  try {
    const uploadResult = await cloudinaryService.uploadFromPath(file.path, folder);
    const url = uploadResult.secure_url;
    
    logger.log(formatLogMessage(LOG_MESSAGES.FILE_UPLOADED, { url }));
    
    return { url, uploaded: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(formatLogMessage(LOG_MESSAGES.FILE_UPLOAD_FAILED, { error: errorMessage }));
    
    return { url: null, uploaded: false, error: errorMessage };
  }
}

/**
 * Format log message with placeholders
 * @param template - Message template with {placeholder}
 * @param values - Values to replace placeholders
 * @returns Formatted message
 */
export function formatLogMessage(template: string, values: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}
