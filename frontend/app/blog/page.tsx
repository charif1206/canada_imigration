'use client';

import React from 'react';
import { usePublishedPosts } from '@/lib/hooks/useBlogs';
import { BlogPostCard } from '@/components/blog';
import Link from 'next/link';

export default function BlogPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data, isLoading, error } = usePublishedPosts(currentPage, 10);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              📰 Our Blog
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest immigration news, tips, and guides for Canada
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-semibold">Loading posts...</p>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && data && data.posts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {data.posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {data.pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!data.pagination.hasPrevPage}
                  className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg disabled:hover:shadow-md"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2">
                  {Array.from({ length: data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-12 h-12 rounded-lg font-semibold transition-all ${
                        page === currentPage
                          ? 'bg-purple-600 text-white shadow-lg scale-110'
                          : 'bg-white text-gray-700 hover:bg-purple-50 border-2 border-gray-200'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!data.pagination.hasNextPage}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg disabled:hover:shadow-md"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center mt-6 text-gray-600">
              Showing <span className="font-semibold text-purple-600">{data.posts.length}</span> of{' '}
              <span className="font-semibold text-purple-600">{data.pagination.totalCount}</span> posts
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && data && data.posts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No posts available</h3>
            <p className="text-gray-600 mb-6">Check back soon for new content!</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
