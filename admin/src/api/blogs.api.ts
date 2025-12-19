/**
 * Blog Posts API
 * CRUD operations for managing blog posts
 */

import { api } from './axios.config';

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

export interface CreatePostData {
  title: string;
  content: string;
  published?: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  published?: boolean;
}

/**
 * Get all posts (admin only)
 */
export const getAllPosts = async (page = 1, limit = 10): Promise<PostsResponse> => {
  const response = await api.get<PostsResponse>('/posts', {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Get single post by ID
 */
export const getPostById = async (id: string): Promise<Post> => {
  const response = await api.get<Post>(`/posts/${id}`);
  return response.data;
};

/**
 * Create new post with image
 */
export const createPost = async (data: CreatePostData, imageFile: File): Promise<Post> => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('content', data.content);
  if (data.published !== undefined) {
    formData.append('published', String(data.published));
  }
  formData.append('image', imageFile);

  const response = await api.post<Post>('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update post (with optional image replacement)
 */
export const updatePost = async (
  id: string,
  data: UpdatePostData,
  imageFile?: File
): Promise<Post> => {
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.content) formData.append('content', data.content);
  if (data.published !== undefined) {
    formData.append('published', String(data.published));
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await api.put<Post>(`/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Delete post
 */
export const deletePost = async (id: string): Promise<{ message: string; id: string }> => {
  const response = await api.delete<{ message: string; id: string }>(`/posts/${id}`);
  return response.data;
};
