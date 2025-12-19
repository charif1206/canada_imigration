import React from 'react';
import { useDeletePost } from '@/src/hooks/useBlogs';
import { Post } from '@/src/api/blogs.api';

interface DeletePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
}

export default function DeletePostModal({ isOpen, onClose, post }: DeletePostModalProps) {
  const deletePost = useDeletePost();

  const handleDelete = async () => {
    await deletePost.mutateAsync(post.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Confirm Delete</h2>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete this post?
          </p>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-800">{post.title}</p>
            <p className="text-sm text-gray-500 mt-1">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={deletePost.isPending}
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
            disabled={deletePost.isPending}
          >
            {deletePost.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
