/**
 * Blog module configuration constants
 */

// Pagination defaults
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// Image upload configuration
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const CLOUDINARY_FOLDER = 'blog-posts';

// Error messages
export const ERROR_MESSAGES = {
  IMAGE_REQUIRED: 'Image file is required',
  IMAGE_UPLOAD_FAILED: 'Failed to upload image to Cloudinary',
  IMAGE_TOO_LARGE: 'Image file size must be less than 5MB',
  INVALID_IMAGE_TYPE: 'Only JPEG, PNG, GIF, and WebP images are allowed',
  POST_NOT_FOUND: 'Blog post with ID {id} not found',
  CREATE_FAILED: 'Failed to create blog post',
  UPDATE_FAILED: 'Failed to update blog post',
  DELETE_FAILED: 'Failed to delete blog post',
  FETCH_FAILED: 'Failed to fetch blog posts',
  LIKE_TOGGLE_FAILED: 'Failed to toggle like',
};

// Success messages
export const SUCCESS_MESSAGES = {
  POST_DELETED: 'Blog post deleted successfully',
  POST_CREATED: 'Blog post created successfully',
  POST_UPDATED: 'Blog post updated successfully',
};
