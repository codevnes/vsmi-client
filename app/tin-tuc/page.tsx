'use client';

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag, TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { categoriesApi, postsApi, Post, Category, handleApiError } from "@/app/services/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredNews, setFeaturedNews] = useState<Post | null>(null);
  const [recentNews, setRecentNews] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await categoriesApi.getAllCategories({
          limit: 10,
          sortBy: 'title',
          sortDirection: 'asc'
        });
        
        if (categoriesResponse.success && categoriesResponse.data.categories) {
          setCategories(categoriesResponse.data.categories);
        }
        
        // Fetch featured post (latest published)
        const featuredResponse = await postsApi.getAllPosts({
          limit: 1,
          published: true,
          sortBy: 'createdAt',
          sortDirection: 'desc'
        });
        
        if (featuredResponse.success && featuredResponse.data.posts && featuredResponse.data.posts.length > 0) {
          setFeaturedNews(featuredResponse.data.posts[0]);
        }
        
        // Fetch recent posts
        const recentResponse = await postsApi.getAllPosts({
          limit: 6,
          published: true,
          sortBy: 'createdAt',
          sortDirection: 'desc',
          // Skip the featured post
          offset: 1
        });
        
        if (recentResponse.success && recentResponse.data.posts) {
          setRecentNews(recentResponse.data.posts);
        }
        
        setError(null);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.message);
        console.error('Error fetching news data:', apiError);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNewsData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };
  
  // Helper function to estimate read time
  const calculateReadTime = (content: string): string => {
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / 200); // Assuming 200 words per minute reading speed
    return `${minutes} phút đọc`;
  };
  
  // Helper to get primary category of a post
  const getPrimaryCategory = (post: Post): Category | undefined => {
    return post.categories && post.categories.length > 0 ? 
      post.categories[0] as unknown as Category : undefined;
  };
  
  if (error) {
    return (
      <div className="space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tin tức chứng khoán</h1>
          <p className="text-muted-foreground text-lg">
            Cập nhật tin tức, phân tích và nhận định mới nhất về thị trường chứng khoán Việt Nam
          </p>
        </header>
        
        <div className="p-6 bg-red-50 text-red-700 rounded-lg">
          <p className="font-medium">Lỗi khi tải dữ liệu tin tức:</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Tin tức chứng khoán</h1>
        <p className="text-muted-foreground text-lg">
          Cập nhật tin tức, phân tích và nhận định mới nhất về thị trường chứng khoán Việt Nam
        </p>
      </header>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Main content */}
        <div className="flex-1 space-y-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {loading ? (
              Array(6).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-9 w-32 rounded-full" />
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tin-tuc/category/${category.slug}`}
                  className="px-3 py-1.5 bg-secondary/50 hover:bg-secondary text-sm rounded-full transition-colors flex items-center gap-1"
                >
                  <Tag className="h-3.5 w-3.5" />
                  {category.title}
                </Link>
              ))
            )}
          </div>

          {/* Featured news */}
          {loading ? (
            <div className="relative rounded-xl overflow-hidden border bg-card shadow-sm h-80">
              <Skeleton className="h-full w-full" />
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                <Skeleton className="h-6 w-36 mb-3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <div className="flex gap-3 mt-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          ) : featuredNews ? (
            <div className="relative rounded-xl overflow-hidden border bg-card shadow-sm group hover:shadow-md transition-all">
              <div className="relative h-80 w-full">
                <Image
                  src={featuredNews.thumbnail?.url || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format"}
                  alt={featuredNews.title}
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <Link
                  href="/tin-tuc/featured"
                  className="text-xs font-medium px-3 py-1 bg-primary/90 rounded-full inline-flex items-center gap-1 mb-3"
                >
                  <TrendingUp className="h-3 w-3" />
                  Tin nổi bật
                </Link>
                <h2 className="text-2xl font-bold mb-2 line-clamp-2">{featuredNews.title}</h2>
                <p className="text-white/80 line-clamp-2 mb-3">{featuredNews.excerpt}</p>
                <div className="flex items-center text-xs text-white/70 gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(featuredNews.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {calculateReadTime(featuredNews.content)}
                  </span>
                </div>
                <Link
                  href={`/tin-tuc/${featuredNews.slug}`}
                  className="absolute inset-0"
                  aria-label={featuredNews.title}
                />
              </div>
            </div>
          ) : null}

          {/* Recent news */}
          <div>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Tin mới nhất
            </h2>
            
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="rounded-lg overflow-hidden border bg-card">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-24 rounded-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                recentNews.map((news) => {
                  const primaryCategory = getPrimaryCategory(news);
                  
                  return (
                    <div 
                      key={news.id} 
                      className="rounded-lg overflow-hidden border bg-card hover:shadow-md transition-all relative group"
                    >
                      <div className="relative h-48">
                        <Image
                          src={news.thumbnail?.url || "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500&auto=format"}
                          alt={news.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-4">
                        {primaryCategory && (
                          <Link
                            href={`/tin-tuc/category/${primaryCategory.slug}`}
                            className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full inline-block mb-2"
                          >
                            {primaryCategory.title}
                          </Link>
                        )}
                        <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{news.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground gap-3">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDate(news.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {calculateReadTime(news.content)}
                            </span>
                          </div>
                          <Link
                            href={`/tin-tuc/${news.slug}`}
                            className="text-primary text-xs font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Đọc tiếp
                            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                      <Link
                        href={`/tin-tuc/${news.slug}`}
                        className="absolute inset-0"
                        aria-label={news.title}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:w-80 space-y-6">
          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Danh mục tin tức</h3>
            <div className="space-y-1">
              {loading ? (
                Array(6).fill(0).map((_, index) => (
                  <div key={index} className="py-2 px-3">
                    <Skeleton className="h-5 w-full" />
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/tin-tuc/category/${category.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-secondary/50 transition-colors text-sm"
                  >
                    <span>{category.title}</span>
                    <ArrowUpRight className="h-4 w-4 opacity-50" />
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-card p-5 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Tin nổi bật</h3>
            <div className="space-y-4">
              {loading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex gap-3">
                    <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))
              ) : (
                recentNews.slice(0, 3).map((news) => (
                  <div key={news.id} className="flex gap-3 group">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={news.thumbnail?.url || "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500&auto=format"}
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <Link href={`/tin-tuc/${news.slug}`}>
                        <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
                          {news.title}
                        </h4>
                      </Link>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(news.createdAt)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 