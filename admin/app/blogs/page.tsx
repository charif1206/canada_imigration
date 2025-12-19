'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/src/stores/auth.store';
import { useAllPosts } from '@/src/hooks/useBlogs';
import { Post } from '@/src/api/blogs.api';
import PostCard from '@/src/components/blogs/PostCard';
import CreatePostModal from '@/src/components/blogs/CreatePostModal';
import UpdatePostModal from '@/src/components/blogs/UpdatePostModal';
import DeletePostModal from '@/src/components/blogs/DeletePostModal';

export default function BlogsManagementPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [updateModalState, setUpdateModalState] = useState<{
    isOpen: boolean;
    post: Post | null;
  }>({ isOpen: false, post: null });
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    post: Post | null;
  }>({ isOpen: false, post: null });

  const { data, isLoading } = useAllPosts(currentPage, 12);

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Blog Posts Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage your blog posts, create new content, and moderate existing posts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.username}</span>
              </span>
              <Link
                href="/"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            {data && (
              <span>
                Showing <span className="font-semibold">{data.posts.length}</span> of{' '}
                <span className="font-semibold">{data.pagination.totalCount}</span> posts
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Create New Post
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading posts...</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && data && data.posts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onUpdate={(post) => setUpdateModalState({ isOpen: true, post })}
                onDelete={(post) => setDeleteModalState({ isOpen: true, post })}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data && data.posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-6">Create your first blog post to get started</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Create First Post
            </button>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && data && data.pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!data.pagination.hasPrevPage}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    page === currentPage
                      ? 'bg-purple-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!data.pagination.hasNextPage}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {updateModalState.post && (
        <UpdatePostModal
          isOpen={updateModalState.isOpen}
          onClose={() => setUpdateModalState({ isOpen: false, post: null })}
          post={updateModalState.post}
        />
      )}

      {deleteModalState.post && (
        <DeletePostModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ isOpen: false, post: null })}
          post={deleteModalState.post}
        />
      )}
    </div>
  );
}
