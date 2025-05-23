'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

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
  const tickerRef = useRef<HTMLDivElement>(null);
  
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

  // Item-by-item scrolling animation
  useEffect(() => {
    if (!loading && gptResponses.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => {
          // Move to the next response
          return (prevIndex + 1) % gptResponses.length;
        });
      }, 10000); // Change every 10 seconds
      
      return () => clearInterval(interval);
    }
  }, [loading, gptResponses]);
  
  // Scroll to the active item
  useEffect(() => {
    if (tickerRef.current && !loading && gptResponses.length > 0) {
      const activeItem = document.getElementById(`ticker-item-${activeIndex}`);
      if (activeItem) {
        // Scroll with smooth animation
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [activeIndex, loading]);
  
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
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-primary">Thị trường chứng khoán</h2>
        <Link href="/tin-tuc" className="text-sm text-primary hover:underline flex items-center group">
          Xem tất cả
          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {/* News ticker container with enhanced styling */}
      <div 
        className="flex-1 overflow-hidden border border-border rounded-lg relative bg-gradient-to-b from-card/90 to-card/50"
        style={{ 
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)'
        }}
      >
        {/* Add a subtle animated gradient overlay for visual interest */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-indigo-500/5 animate-pulse pointer-events-none opacity-70"></div>
        
        {/* Inner news container that scrolls */}
        <div 
          ref={tickerRef}
          className="h-full overflow-hidden py-4 relative z-10 px-4 space-y-4"
        >
          {loading ? (
            <div className="space-y-8">
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="p-5 border border-border rounded-lg bg-card/50">
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
            gptResponses.map((item, index) => (
              <div 
                id={`ticker-item-${index}`}
                key={item.id} 
                className={`p-5 border rounded-lg transition-all duration-700 ${
                  index === activeIndex 
                    ? 'border-primary/50 bg-primary/5 shadow-lg scale-100 opacity-100'
                    : 'border-border bg-card/50 opacity-60 scale-95'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{item.response}</p>
                <div className="flex justify-end mt-2">
                  <span className="text-xs text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Không có dữ liệu phân tích</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation dots */}
      {!loading && gptResponses.length > 0 && (
        <div className="flex justify-center mt-4 gap-1.5">
          {gptResponses.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeIndex ? 'bg-primary w-6' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Hiển thị phân tích số ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 