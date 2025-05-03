// API Service for fetching data from backend
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

// Define interface types for API responses
export interface Post {
  id: string;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    fullName: string;
  };
  categories: {
    id: string;
    title: string;
  }[];
  thumbnail?: {
    id: number;
    url: string;
  };
}

export interface Category {
  id: string;
  title: string;
  slug: string;
  description?: string;
  parentId?: string;
  thumbnailId?: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  parent?: {
    id: string;
    title: string;
  };
  thumbnail?: {
    id: number;
    url: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CategoriesResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedPostsResponse {
  success: boolean;
  message: string;
  data: PostsResponse;
}

export interface PaginatedCategoriesResponse {
  success: boolean;
  message: string;
  data: CategoriesResponse;
}

export interface ApiError {
  success: false;
  message: string;
  status: number;
  details: { field: string; message: string }[] | null;
}

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.vsmi.com/api/v1";

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to requests
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts API
export const postsApi = {
  // Get all posts with optional filters
  getAllPosts: async (params: Record<string, any> = {}) => {
    const response = await apiClient.get<PaginatedPostsResponse>('/posts', { params });
    return response.data;
  },
  
  // Get post by ID
  getPostById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/${id}`);
    return response.data;
  },
  
  // Get post by slug
  getPostBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Post>>(`/posts/slug/${slug}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  // Get all categories with optional filters
  getAllCategories: async (params: Record<string, any> = {}) => {
    const response = await apiClient.get<PaginatedCategoriesResponse>('/categories', { params });
    return response.data;
  },
  
  // Get category tree structure
  getCategoryTree: async () => {
    const response = await apiClient.get<ApiResponse<Category[]>>('/categories/tree');
    return response.data;
  },
  
  // Get category by ID
  getCategoryById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },
  
  // Get category by slug
  getCategoryBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data;
  },
};

// Helper for error handling
export const handleApiError = (error: unknown): ApiError => {
  const errorResponse: ApiError = {
    success: false,
    message: 'Đã xảy ra lỗi không xác định',
    status: 500,
    details: null,
  };

  if (axios.isAxiosError(error) && error.response) {
    const { data, status } = error.response;
    errorResponse.status = status;
    
    if (data && data.error) {
      errorResponse.message = data.error.message || 'Lỗi từ máy chủ';
      errorResponse.details = data.error.details || null;
    }
  } else if (axios.isAxiosError(error) && error.request) {
    // Request was made but no response received
    errorResponse.message = 'Không thể kết nối đến máy chủ';
    errorResponse.status = 0;
  }

  return errorResponse;
};

export default apiClient; 