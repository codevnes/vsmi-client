'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { postsApi, Post, handleApiError } from '@/app/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface FormattedNews {
  id: string;
  headline: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  slug: string;
  category?: string;
}

export function LatestNews() {
  const [newsWithTime, setNewsWithTime] = useState<FormattedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        // Get latest published posts, sorted by createdAt
        const response = await postsApi.getAllPosts({
          limit: 4,
          published: true,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        });
        
        if (response.success && response.data.posts) {
          // Format the posts data
          const formattedNews = response.data.posts.map(post => {
            // Calculate estimated read time based on content length
            const readTimeMinutes = Math.ceil(post.content.split(' ').length / 200); // Avg reading speed ~200 words/min
            const readTime = `${readTimeMinutes} phút đọc`;
            
            // Format the date
            const date = new Date(post.createdAt);
            const formattedDate = date.toLocaleDateString('vi-VN');
            
            // Get primary category if exists
            const primaryCategory = post.categories && post.categories.length > 0 ? 
              post.categories[0] : undefined;
              
            return {
              id: post.id,
              headline: post.title,
              excerpt: post.excerpt || '',
              date: formattedDate,
              readTime,
              image: post.thumbnail?.url || 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=250&auto=format',
              slug: post.slug,
              category: primaryCategory?.title
            };
          });
          
          setNewsWithTime(formattedNews);
          setError(null);
        } else {
          setError('Không thể tải tin tức');
        }
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        console.error('Error fetching latest news:', apiError);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestNews();
  }, []);
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Lỗi: {error}</p>
      </div>
    );
  }
  
  return (
      <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-primary">Tin tức mới nhất</h2>
        <Link href="/tin-tuc" className="text-sm text-primary hover:underline flex items-center group">
          Xem tất cả
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      <div className="space-y-4">
        {loading ? (
          // Show skeleton loaders while loading
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
              <Skeleton className="size-24 min-w-24 rounded-md" />
              <div className="flex flex-col justify-between flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-20" />
                  <span className="text-gray-400">•</span>
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : (
          newsWithTime.map((item, index) => (
            <div key={item.id || index} className="flex gap-4 border-b border-border pb-4 last:border-0 last:pb-0 transition-all p-2 hover:shadow-md rounded-lg">
              <div className="relative size-24 min-w-24 overflow-hidden rounded-md">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <Image 
                  src={item.image} 
                  alt={item.headline}
                  fill
                  className="object-cover rounded-md transition-all duration-500"
                  sizes="(max-width: 768px) 96px, 96px"
                  onError={(e) => {
                    // Fallback image if the provided one fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=250&auto=format';
                  }}
                />
              </div>
              <div className="flex flex-col justify-between">
                <Link href={`/tin-tuc/${item.slug}`}>
                  <h3 className="font-medium text-sm cursor-pointer line-clamp-3 hover:text-primary transition-colors">
                    {item.headline}
                  </h3>
                </Link>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {item.date}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {item.readTime}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      </>
  );
} 