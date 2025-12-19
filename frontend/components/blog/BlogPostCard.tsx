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

      {/* Footer - Likes & Actions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors group">
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">{post.likesCount}</span>
            </button>
            
            <Link 
              href={`/blog/${post.id}`}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-semibold">Comment</span>
            </Link>

            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="font-semibold">Share</span>
            </button>
          </div>

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
