import { BadRequestException } from '@nestjs/common';
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES, ERROR_MESSAGES } from '../constants/blog.constants';

/**
 * Validate image file size and type
 */
export function validateImageFile(file: Express.Multer.File): void {
  if (!file) {
    throw new BadRequestException(ERROR_MESSAGES.IMAGE_REQUIRED);
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new BadRequestException(ERROR_MESSAGES.IMAGE_TOO_LARGE);
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(ERROR_MESSAGES.INVALID_IMAGE_TYPE);
  }
}

/**
 * Validate optional image file (for updates)
 */
export function validateOptionalImageFile(file?: Express.Multer.File): void {
  if (!file) {
    return; // No file to validate
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new BadRequestException(ERROR_MESSAGES.IMAGE_TOO_LARGE);
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    throw new BadRequestException(ERROR_MESSAGES.INVALID_IMAGE_TYPE);
  }
}
