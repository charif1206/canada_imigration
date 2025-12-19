import { Post } from '@prisma/client';
import { BlogPostResponse, BlogPostWithLikeStatus } from '../interfaces/blog.interface';

/**
 * Transform database post to response with computed fields
 */
export function transformPostToResponse(post: Post): BlogPostResponse {
  return {
    ...post,
    likesCount: post.likes.length,
  };
}

/**
 * Transform database post to response with like status for a user
 */
export function transformPostWithLikeStatus(
  post: Post,
  userId: string,
): BlogPostWithLikeStatus {
  return {
    ...post,
    likesCount: post.likes.length,
    isLiked: post.likes.includes(userId),
  };
}

/**
 * Toggle user's like on a post
 */
export function toggleUserLike(currentLikes: string[], userId: string): string[] {
  const hasLiked = currentLikes.includes(userId);
  
  if (hasLiked) {
    // Remove like
    return currentLikes.filter(id => id !== userId);
  } else {
    // Add like
    return [...currentLikes, userId];
  }
}

/**
 * Check if user has liked a post
 */
export function hasUserLiked(likes: string[], userId: string): boolean {
  return likes.includes(userId);
}
