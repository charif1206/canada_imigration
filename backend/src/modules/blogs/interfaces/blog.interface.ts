import { Post } from '@prisma/client';

/**
 * Blog post with computed fields
 */
export interface BlogPostResponse extends Omit<Post, 'likes'> {
  likesCount: number;
  likes: string[];
}

/**
 * Blog post with like status for a specific user
 */
export interface BlogPostWithLikeStatus extends BlogPostResponse {
  isLiked: boolean;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Paginated blog posts response
 */
export interface PaginatedBlogsResponse {
  posts: BlogPostResponse[];
  pagination: PaginationMetadata;
}

/**
 * Delete blog post response
 */
export interface DeleteBlogResponse {
  message: string;
  id: string;
}

/**
 * Image upload result
 */
export interface ImageUploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}
