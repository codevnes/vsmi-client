'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { postsApi, handleApiError } from '@/app/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useCallback } from 'react';

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Number of items to display per view
  const itemsPerViewPC = 4;
  const itemsPerViewMobile = 2;
  
  // Calculate total number of slides
  const totalSlides = Math.ceil(newsWithTime.length / itemsPerViewPC);
  
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
  
  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (newsWithTime.length > 0) {
        setCurrentSlide((current) => 
          current === totalSlides - 1 ? 0 : current + 1
        );
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [newsWithTime.length, totalSlides]);
  
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((current) => 
      current === totalSlides - 1 ? 0 : current + 1
    );
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((current) => 
      current === 0 ? totalSlides - 1 : current - 1
    );
  }, [totalSlides]);
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Lỗi: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-primary">Tin tức mới nhất</h2>
        <Link href="/tin-tuc" className="text-sm text-primary hover:underline flex items-center group">
          Xem tất cả
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {/* Slider container */}
      <div className="relative overflow-hidden" ref={sliderRef}>
        <div 
          className="transition-transform duration-500 ease-in-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            display: 'flex',
            width: `${totalSlides * 100}%`
          }}
        >
          {loading ? (
            // Show skeleton loaders while loading
            <div className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, index) => (
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
            // Render slides in groups
            [...Array(totalSlides)].map((_, slideIndex) => {
              const startIdx = slideIndex * itemsPerViewPC;
              const slideItems = newsWithTime.slice(startIdx, startIdx + itemsPerViewPC);
              
              return (
                <div key={slideIndex} className="w-full flex-shrink-0 p-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {slideItems.map((item, index) => (
                      <div key={`${slideIndex}-${index}`} className="border shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow">
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
                        </div>
                        <div className="p-4">
                          <Link href={`/tin-tuc/${item.slug}`}>
                            <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 hover:text-primary transition-colors">
                              {item.headline}
                            </h3>
                          </Link>
                          <p className="text-xs md:text-sm text-muted-foreground mb-3 line-clamp-2">{item.excerpt}</p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {item.date}
                            </span>
                            <span className="flex items-center">
                              <svg className="w-3 h-3 mr-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {item.readTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Navigation arrows */}
      <button 
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/80 hover:bg-background text-primary p-2 rounded-full shadow-md z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/80 hover:bg-background text-primary p-2 rounded-full shadow-md z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Dots navigation */}
      <div className="flex justify-center mt-4 gap-2">
        {!loading && totalSlides > 0 && [...Array(totalSlides)].map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide ? 'bg-primary w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 