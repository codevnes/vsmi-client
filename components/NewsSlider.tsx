'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { postsApi, handleApiError } from '@/app/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import type { Swiper as SwiperType } from 'swiper';

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

export function NewsSlider() {
  const [newsWithTime, setNewsWithTime] = useState<FormattedNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const swiperRef = useRef<SwiperType | null>(null);
  
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setLoading(true);
        // Get latest published posts, sorted by createdAt
        const response = await postsApi.getAllPosts({
          limit: 12, // Get more posts for the slider
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
    <div className="relative news-slider">
     
      
      {loading ? (
        // Show skeleton loaders while loading
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="border shadow-sm rounded-xl overflow-hidden">
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6 mb-3" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Swiper carousel
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={16}
          slidesPerView={2.5}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 16 },
          }}
          pagination={{ 
            clickable: true,
            el: '.news-slider-pagination',
            bulletClass: 'inline-block w-2 h-2 bg-gray-300 rounded-full transition-all mx-1 cursor-pointer hover:bg-gray-400',
            bulletActiveClass: '!w-6 !bg-primary',
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          className="rounded-xl"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          navigation={false} // Disable default navigation to use custom buttons
        >
          {newsWithTime.map((item) => (
            <SwiperSlide key={item.id}>
              <div className="rounded-xl bg-white overflow-hidden hover:shadow-md transition-shadow h-full">
                <div className="relative aspect-[16/9] w-full">
                  <Image 
                    src={item.image} 
                    alt={item.headline}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    onError={(e) => {
                      // Fallback image if the provided one fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=250&auto=format';
                    }}
                  />
                  {/* Category badge if available */}
                  {item.category && (
                    <span className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded">
                      {item.category}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <Link href={`/tin-tuc/${item.slug}`}>
                    <h3 className="font-semibold text-xs md:text-base mb-2 line-clamp-2 hover:text-primary transition-colors">
                      {item.headline}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {item.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      
      {/* Custom pagination container */}
      <div className="news-slider-pagination flex justify-center mt-4"></div>
      
    </div>
  );
}