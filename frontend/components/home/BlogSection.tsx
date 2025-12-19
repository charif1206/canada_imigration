import React from 'react';
import { BlogPostCard } from '@/components/blog';
import { usePublishedPosts } from '@/lib/hooks/useBlogs';
import Link from 'next/link';

export default function BlogSection() {
  const { data, isLoading } = usePublishedPosts(1, 6);

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              📰 Latest from Our Blog
            </h2>
            <p className="text-lg text-gray-600">
              Stay informed with immigration news, tips, and success stories
            </p>
          </div>
          
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!data || data.posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📰 Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest immigration news, tips, and success stories
          </p>
        </div>

        {/* Blog Feed - Vertical Layout */}
        <div className="max-w-3xl mx-auto space-y-6 mb-12">
          {data.posts.slice(0, 6).map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            View All Posts
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
