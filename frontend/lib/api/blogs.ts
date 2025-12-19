/**
 * Blog API
 * Functions for fetching blog posts
 */

import { axiosInstance } from '../axios';

export interface Post {
  id: string;
  title: string;
  content: string;
  imgUrl: string;
  likes: string[];
  likesCount: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostsResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

/**
 * Get published posts (public access)
 */
export const getPublishedPosts = async (page = 1, limit = 10): Promise<PostsResponse> => {
  const response = await axiosInstance.get<PostsResponse>('/posts/published', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get single post by ID (public access)
 */
export const getPostById = async (id: string): Promise<Post> => {
  const response = await axiosInstance.get<Post>(`/posts/${id}`);
  return response.data;
};

/**
 * Toggle like on a post (requires authentication)
 */
export const toggleLikePost = async (postId: string, userId: string): Promise<Post> => {
  const response = await axiosInstance.post<Post>(`/posts/${postId}/like`, { userId });
  return response.data;
};
