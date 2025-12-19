/**
 * Custom hooks for blog posts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import * as blogsApi from '../api/blogs';

/**
 * Get published posts with pagination
 */
export const usePublishedPosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['published-posts', page, limit],
    queryFn: () => blogsApi.getPublishedPosts(page, limit),
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
 * Toggle like on a post
 */
export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      blogsApi.toggleLikePost(postId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['published-posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.postId] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to update like';
      toast.error(message);
    },
  });
};
