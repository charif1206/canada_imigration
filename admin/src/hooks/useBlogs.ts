/**
 * Custom hooks for blog posts management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import * as blogsApi from '../api/blogs.api';

/**
 * Get all posts
 */
export const useAllPosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['posts', page, limit],
    queryFn: () => blogsApi.getAllPosts(page, limit),
  });
};

/**
 * Get single post by ID
 */
export const usePostById = (id: string) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => blogsApi.getPostById(id),
    enabled: !!id,
  });
};

/**
 * Create new post
 */
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, imageFile }: { data: blogsApi.CreatePostData; imageFile: File }) =>
      blogsApi.createPost(data, imageFile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create post';
      toast.error(message);
    },
  });
};

/**
 * Update post
 */
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
      imageFile,
    }: {
      id: string;
      data: blogsApi.UpdatePostData;
      imageFile?: File;
    }) => blogsApi.updatePost(id, data, imageFile),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
      toast.success('Post updated successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update post';
      toast.error(message);
    },
  });
};

/**
 * Delete post
 */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => blogsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast.success('Post deleted successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete post';
      toast.error(message);
    },
  });
};
