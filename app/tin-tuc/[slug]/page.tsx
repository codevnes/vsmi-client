'use client';

import React, { useEffect, useState } from 'react';
import { postsApi, Post, handleApiError } from '@/app/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2, Tag } from 'lucide-react';

export default function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        setLoading(true);
        const response = await postsApi.getPostBySlug(slug);
        
        if (response.success && response.data) {
          setPost(response.data);
          setError(null);
        } else {
          setError('Không tìm thấy bài viết');
        }
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        console.error('Error fetching post detail:', apiError);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPostDetail();
    }
  }, [slug]);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Helper function to estimate read time
  const calculateReadTime = (content: string): string => {
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
    return `${minutes} phút đọc`;
  };

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="p-6 bg-red-50 text-red-700 rounded-lg">
          <h1 className="text-xl font-bold mb-2">Lỗi</h1>
          <p>{error}</p>
          <Link href="/tin-tuc" className="mt-4 inline-flex items-center text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang tin tức
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {/* Back button */}
      <Link href="/tin-tuc" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại tin tức
      </Link>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4 rounded-lg" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-6 w-32 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-80 w-full rounded-lg" />
          <div className="space-y-4 mt-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      ) : post ? (
        <article className="prose prose-lg max-w-none">
          {/* Title and meta */}
          <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              {calculateReadTime(post.content)}
            </span>
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.categories.map(category => (
                  <Link 
                    key={category.id} 
                    href={`/tin-tuc/category/${category.id}`}
                    className="flex items-center bg-secondary/50 hover:bg-secondary text-xs px-2 py-1 rounded-full"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {category.title}
                  </Link>
                ))}
              </div>
            )}
            <button 
              className="ml-auto flex items-center text-primary hover:underline"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                  });
                } else {
                  // Fallback
                  navigator.clipboard.writeText(window.location.href);
                  alert('Đã sao chép đường dẫn!');
                }
              }}
            >
              <Share2 className="mr-1 h-4 w-4" />
              Chia sẻ
            </button>
          </div>
          
          {/* Featured image */}
          {post.thumbnail && (
            <div className="relative w-full h-80 mb-8 overflow-hidden rounded-lg">
              <Image
                src={post.thumbnail.url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          
          {/* Content */}
          <div 
            className="mt-8"
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
          
          {/* Author */}
          {post.author && post.author.fullName && (
            <div className="mt-12 pt-8 border-t">
              <h2 className="text-xl font-bold mb-4">Tác giả</h2>
              <div className="flex items-center">
                <div className="bg-primary/10 text-primary font-bold text-xl w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  {post.author.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium">{post.author.fullName}</h3>
                  <p className="text-sm text-muted-foreground">Tác giả</p>
                </div>
              </div>
            </div>
          )}
        </article>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Không tìm thấy bài viết</h2>
          <p className="text-muted-foreground mb-6">Bài viết này có thể đã bị xóa hoặc không tồn tại.</p>
          <Link 
            href="/tin-tuc" 
            className="inline-flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại trang tin tức
          </Link>
        </div>
      )}
    </div>
  );
} 