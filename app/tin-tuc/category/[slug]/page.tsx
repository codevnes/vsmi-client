'use client';

import React, { useEffect, useState } from 'react';
import { postsApi, categoriesApi, Post, Category, handleApiError } from '@/app/services/api';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Tag } from 'lucide-react';

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const { slug } = unwrappedParams;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Fetch category details
        const categoryResponse = await categoriesApi.getCategoryBySlug(slug);
        
        if (categoryResponse.success && categoryResponse.data) {
          setCategory(categoryResponse.data);
          
          // Fetch posts in this category
          const postsResponse = await postsApi.getAllPosts({
            limit: 12,
            published: true,
            categoryId: categoryResponse.data.id,
            sortBy: 'createdAt',
            sortDirection: 'desc'
          });
          
          if (postsResponse.success && postsResponse.data.posts) {
            setPosts(postsResponse.data.posts);
          }
          
          setError(null);
        } else {
          setError('Không tìm thấy danh mục');
        }
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        console.error('Error fetching category data:', apiError);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryData();
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
      <div className="container max-w-6xl mx-auto py-8 px-4">
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
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Back button */}
      <Link href="/tin-tuc" className="inline-flex items-center text-primary hover:underline mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại tin tức
      </Link>
      
      {/* Category header */}
      <div className="mb-8 border-b pb-6">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3 rounded-lg" />
            <Skeleton className="h-6 w-2/3 rounded-lg" />
          </div>
        ) : category ? (
          <>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {category.title}
            </h1>
            {category.description && (
              <p className="text-muted-foreground text-lg">{category.description}</p>
            )}
          </>
        ) : null}
      </div>
      
      {/* Posts grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          // Skeleton loaders
          Array(6).fill(0).map((_, index) => (
            <div key={index} className="rounded-lg overflow-hidden border bg-card">
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="rounded-lg overflow-hidden border bg-card hover:shadow-md transition-all relative group"
            >
              <div className="relative h-48">
                <Image
                  src={post.thumbnail?.url || "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500&auto=format"}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {calculateReadTime(post.content)}
                    </span>
                  </div>
                  <Link
                    href={`/tin-tuc/${post.slug}`}
                    className="text-primary text-xs font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Đọc tiếp
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <Link
                href={`/tin-tuc/${post.slug}`}
                className="absolute inset-0"
                aria-label={post.title}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <h2 className="text-xl font-bold mb-2">Không có bài viết nào</h2>
            <p className="text-muted-foreground mb-4">Chưa có bài viết nào trong danh mục này.</p>
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
      
      {/* Pagination can be added here if needed */}
    </div>
  );
} 