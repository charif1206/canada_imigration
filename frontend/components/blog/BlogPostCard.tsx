import React from 'react';
import { Post } from '@/lib/api/blogs';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPostCardProps {
  post: Post;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Header - Date & Meta */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* Content */}
      <Link href={`/blog/${post.id}`}>
        <div className="cursor-pointer">
          {/* Title */}
          <div className="px-4 pt-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
              {post.title}
            </h3>
          </div>

          {/* Excerpt */}
          <div className="px-4 pb-3">
            <p className="text-gray-600 leading-relaxed">
              {truncateContent(post.content, 200)}
            </p>
          </div>

          {/* Image */}
          <div className="relative h-96 w-full bg-gradient-to-br from-purple-100 to-blue-100 overflow-hidden">
            <Image
              src={post.imgUrl}
              alt={post.title}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </Link>

      {/* Footer - Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-end">
          <Link 
            href={`/blog/${post.id}`}
            className="text-purple-600 font-semibold hover:text-purple-700 transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}
