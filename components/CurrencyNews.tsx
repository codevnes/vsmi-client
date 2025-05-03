'use client';

import { useEffect, useState } from 'react';
import { postsApi, Post, handleApiError } from '@/app/services/api';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

// Currency icons/colors mapping
const currencyStyles = {
  'USD': { color: '#4CAF50', symbol: '$' },
  'EUR': { color: '#2196F3', symbol: '€' },
  'VND': { color: '#F44336', symbol: '₫' },
  'JPY': { color: '#9C27B0', symbol: '¥' },
  'GBP': { color: '#FF9800', symbol: '£' },
  'Global': { color: '#607D8B', symbol: '🌐' },
};

// Map category slugs to currency types
const categoryCurrencyMap: Record<string, string> = {
  'tien-te-usd': 'USD',
  'tien-te-eur': 'EUR',
  'tien-te-vnd': 'VND',
  'tien-te-jpy': 'JPY',
  'tien-te-gbp': 'GBP',
  'tien-te-quoc-te': 'Global',
};

interface CategoryWithSlug {
  id: string;
  title: string;
  slug?: string;
}

interface CurrencyNewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  summary: string;
  url: string;
  category: string;
  slug: string;
}

export function CurrencyNews() {
  const [newsData, setNewsData] = useState<CurrencyNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCurrencyNews = async () => {
      try {
        setLoading(true);
        // Get currency-related news by filtering for specific categories
        const response = await postsApi.getAllPosts({
          limit: 8,
          published: true,
          // Categories parameter would be used here if the API supports it
          // For now, we'll fetch all posts and filter on the client
          sortBy: 'createdAt',
          sortDirection: 'desc'
        });
        
        if (response.success && response.data.posts) {
          // Filter and format the posts data
          const currencyNews = response.data.posts
            .filter(post => {
              // Check if any category is currency-related
              return post.categories && post.categories.some(category => {
                const cat = category as CategoryWithSlug;
                return cat.slug?.includes('tien-te') || 
                  cat.title?.toLowerCase().includes('tiền tệ');
              });
            })
            .map(post => {
              // Format the date
              const date = new Date(post.createdAt);
              const formattedDate = date.toLocaleDateString('vi-VN');
              
              // Find a currency-related category
              const currencyCategory = post.categories?.find(category => {
                const cat = category as CategoryWithSlug;
                return cat.slug?.includes('tien-te') || 
                  cat.title?.toLowerCase().includes('tiền tệ');
              }) as CategoryWithSlug | undefined;
              
              // Determine the currency type based on the category
              let currencyType = 'Global';
              if (currencyCategory) {
                for (const [categorySlug, currency] of Object.entries(categoryCurrencyMap)) {
                  if (currencyCategory.slug?.includes(categorySlug)) {
                    currencyType = currency;
                    break;
                  }
                  
                  // Check by title if no match by slug
                  if (currencyCategory.title?.toLowerCase().includes('usd') || 
                      currencyCategory.title?.toLowerCase().includes('đô la')) {
                    currencyType = 'USD';
                  } else if (currencyCategory.title?.toLowerCase().includes('eur') || 
                      currencyCategory.title?.toLowerCase().includes('euro')) {
                    currencyType = 'EUR';
                  } else if (currencyCategory.title?.toLowerCase().includes('vnd') || 
                      currencyCategory.title?.toLowerCase().includes('việt nam')) {
                    currencyType = 'VND';
                  }
                }
              }
              
              return {
                id: post.id,
                title: post.title,
                source: post.author?.fullName || 'VSMI',
                date: formattedDate,
                summary: post.excerpt || '',
                url: `/tin-tuc/${post.slug}`,
                category: currencyType,
                slug: post.slug
              };
            });
            
          // Take only first 8 items
          setNewsData(currencyNews.slice(0, 8));
          setError(null);
        } else {
          setError('Không thể tải tin tức tiền tệ');
        }
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        console.error('Error fetching currency news:', apiError);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrencyNews();
  }, []);
  
  if (error) {
    return (
      <div className="w-full">
        <h3 className="text-xl font-semibold mb-6 mt-2">Tin Tức Thị Trường Tiền Tệ</h3>
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          <p>Lỗi: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-6 mt-2">Tin Tức Thị Trường Tiền Tệ</h3>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          // Show skeleton loaders while loading
          Array(4).fill(0).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 bg-card/50">
              <div className="flex justify-between items-start mb-2 gap-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-3" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))
        ) : (
          newsData.length > 0 ? (
            newsData.map((news) => {
              const currencyInfo = currencyStyles[news.category as keyof typeof currencyStyles] || currencyStyles['Global'];
              
              return (
                <div key={news.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors bg-card/50 overflow-hidden relative group">
                  {/* Currency indicator */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ backgroundColor: currencyInfo.color }}
                  />
                  
                  <div className="ml-2">
                    <div className="flex justify-between items-start mb-2 gap-3">
                      <h4 className="font-medium text-base line-clamp-1 flex-1">{news.title}</h4>
                      <div 
                        className="text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1 whitespace-nowrap"
                        style={{ backgroundColor: `${currencyInfo.color}20`, color: currencyInfo.color }}
                      >
                        <span className="mr-0.5">{currencyInfo.symbol}</span>
                        {news.category}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed pr-2">{news.summary}</p>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="font-medium">{news.source}</span>
                      <span>{news.date}</span>
                    </div>
                  </div>
                  
                  {/* Hover overlay with "Read more" */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end justify-center pb-3">
                    <span className="text-xs font-medium text-primary px-3 py-1 rounded-full bg-primary/10">
                      Xem chi tiết
                    </span>
                  </div>
                  
                  <Link href={news.url} className="absolute inset-0" aria-label={news.title} />
                </div>
              );
            })
          ) : (
            <div className="border rounded-lg p-4 bg-card/50 text-center text-muted-foreground">
              Không có tin tức tiền tệ nào
            </div>
          )
        )}
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
} 