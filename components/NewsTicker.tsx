'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Import Swiper components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade, Grid } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/grid';

interface ChatGPTResponse {
  id: number;
  response: string;
  processedAt: string;
}

interface NewsItem {
  id: number;
  title: string;
  ChatGPTResponses: ChatGPTResponse[];
  publishedAt: string;
}

export function NewsTicker() {
  const [gptResponses, setGptResponses] = useState<{response: string, id: number, date: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);
  
  useEffect(() => {
    const fetchMarketNews = async () => {
      try {
        setLoading(true);
        // Using our internal API proxy route
        const response = await fetch('/api/articles?page=1&pageSize=15');
        const result = await response.json();
        
        if (result && result.data && Array.isArray(result.data)) {
          // Extract all ChatGPT responses from the articles
          const extractedResponses: {response: string, id: number, date: string}[] = [];
          
          result.data.forEach((article: NewsItem) => {
            if (article.ChatGPTResponses && article.ChatGPTResponses.length > 0) {
              article.ChatGPTResponses.forEach(gptResponse => {
                extractedResponses.push({
                  response: gptResponse.response,
                  id: gptResponse.id,
                  date: formatDate(gptResponse.processedAt || article.publishedAt)
                });
              });
            }
          });
          
          setGptResponses(extractedResponses);
          setError(null);
        } else {
          setError('Không thể tải dữ liệu phân tích');
        }
      } catch (err) {
        console.error('Error fetching market analysis:', err);
        setError('Lỗi kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarketNews();
  }, []);
  
  // Add custom styles for mobile grid layout
  useEffect(() => {
    const styles = `
      @media (max-width: 767px) {
        .news-ticker .swiper-wrapper {
          height: auto !important;
        }
        
        .news-ticker .swiper-slide {
          height: auto !important;
          margin-top: 0 !important;
        }
      }
    `;
    
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  
  // Format date from API (ISO string) to local date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Lỗi: {error}</p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col news-ticker">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Tin tức thị trường</h2>
        <div className="flex items-center gap-4">
          <Link href="/tin-tuc" className="text-sm text-primary hover:underline flex items-center group">
            Xem tất cả
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
      
      {/* News ticker container with enhanced styling */}
      <div className="flex-1 min-h-[500px] md:min-h-0">
        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array(3).fill(0).map((_, index) => (
              <div 
                key={index} 
                className="p-5 border border-border rounded-lg bg-card/50 w-full h-fit"
              >
                <Skeleton className="h-5 w-3/4 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : gptResponses.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade, Grid]}
            spaceBetween={16}
            slidesPerView={1}
            slidesPerGroup={1}
            grid={{
              rows: 3,
              fill: "row"
            }}
            breakpoints={{
              // When screen width is >= 768px (tablet/desktop)
              768: {
                grid: {
                  rows: 1
                },
                slidesPerView: 1,
                centeredSlides: true
              }
            }}
            centeredSlides={false}
            loop={false}
            pagination={{ 
              clickable: true,
              el: '.news-ticker-pagination',
              bulletClass: 'inline-block w-2 h-2 bg-gray-300 rounded-full transition-all mx-1 cursor-pointer hover:bg-gray-400',
              bulletActiveClass: '!w-6 !bg-primary',
            }}
            autoplay={{ delay: 10000, disableOnInteraction: false }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.activeIndex);
            }}
            navigation={false}
            className="h-full"
          >
            {gptResponses.map((item) => (
              <SwiperSlide className='mb-2' key={item.id}>
                <div className="p-5 bg-white border rounded-lg border-primary/50 bg-primary/5 transition-all duration-300 h-full flex flex-col">
                  <p className="text-sm whitespace-pre-line line-clamp-4 md:line-clamp-none flex-grow">{item.response}</p>
                  <div className="flex justify-end mt-2">
                    <span className="text-xs text-muted-foreground">
                      {item.date}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Không có dữ liệu phân tích</p>
          </div>
        )}
      </div>
      
      {/* Custom pagination container */}
      {!loading && gptResponses.length > 1 && (
        <div className="news-ticker-pagination flex justify-center mt-4"></div>
      )}
      
    </div>
  );
} 