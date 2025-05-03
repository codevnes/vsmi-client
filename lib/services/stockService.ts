import { Stock, StockSearchParams, StockSearchResponse, StockPrice } from "../types/stock";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.vsmi.com/api/v1";

export async function searchStocks(params: StockSearchParams): Promise<StockSearchResponse> {
  // Convert the params object to URLSearchParams
  const queryParams = new URLSearchParams();
  
  // Add each parameter to the query string if it exists
  if (params.search) queryParams.append("search", params.search);
  if (params.exchange) queryParams.append("exchange", params.exchange);
  if (params.industry) queryParams.append("industry", params.industry);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortDirection) queryParams.append("sortDirection", params.sortDirection);
  
  // Create the URL with query parameters
  const url = `${API_BASE_URL}/stocks?${queryParams.toString()}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      console.error(`Error searching stocks: ${response.status} ${response.statusText}`);
      // Return empty results instead of throwing
      return {
        status: "error",
        data: {
          stocks: [],
          total: 0,
          page: params.page || 1,
          limit: params.limit || 10,
          totalPages: 0
        },
        message: "Failed to search stocks. Please try again later."
      };
    }
    
    const data: StockSearchResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching stocks:", error);
    // Return empty results instead of throwing
    return {
      status: "error",
      data: {
        stocks: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 10,
        totalPages: 0
      },
      message: "Failed to search stocks. Please try again later."
    };
  }
}

export async function getStockBySymbol(symbol: string): Promise<Stock> {
  const url = `${API_BASE_URL}/stocks/symbol/${symbol}`;
  console.log('url', url);
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error(`Error fetching stock data: ${response.status} ${response.statusText}`);
      // Return fallback data instead of throwing
      return {
        id: "fallback-id",
        symbol: symbol,
        name: `${symbol} Stock`,
        exchange: "Unknown",
        industry: "Unknown",
        description: "Could not load stock description. Please try again later.",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching stock by symbol:", error);
    // Return fallback data instead of throwing
    return {
      id: "fallback-id",
      symbol: symbol,
      name: `${symbol} Stock`,
      exchange: "Unknown",
      industry: "Unknown",
      description: "Could not load stock description. Please try again later.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export async function getStockPrice(symbol: string): Promise<StockPrice> {
  const url = `${API_BASE_URL}/stocks/price/${symbol}`;
  
  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      console.error(`Error fetching stock price: ${response.status} ${response.statusText}`);
      // Return default placeholder data if the API fails
      return {
        currentPrice: 0,
        priceChange: 0,
        percentChange: 0,
        marketCap: 'N/A',
        volume: 'N/A',
        value10Days: 'N/A',
        pe: 'N/A',
        pb: 'N/A',
        eps: 'N/A',
        roe: '0%',
        roa: '0%',
        bookValue: 'N/A'
      };
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching stock price:", error);
    // Return default placeholder data if the API fails
    return {
      currentPrice: 0,
      priceChange: 0,
      percentChange: 0,
      marketCap: 'N/A',
      volume: 'N/A',
      value10Days: 'N/A',
      pe: 'N/A',
      pb: 'N/A',
      eps: 'N/A',
      roe: '0%',
      roa: '0%',
      bookValue: 'N/A'
    };
  }
}

// Interface cho dữ liệu cổ phiếu
export interface StockProfile {
  id: string;
  symbol: string;
  name: string;
  exchange: string | null;
  industry: string | null;
  description: string;
  createdAt: string;
  updatedAt: string;
  profile: {
    id: string;
    price: number;
    profit: number;
    volume: number;
    pe: number;
    eps: number;
    roa: number;
    roe: number;
    createdAt: string;
    updatedAt: string;
  };
}

// Interface phản hồi API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Hàm lấy dữ liệu chi tiết cổ phiếu
export async function getFullStockProfile(symbol: string): Promise<StockProfile> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/stock-profiles/full/symbol/${symbol}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stock profile for ${symbol}: ${response.status}`);
    }
    
    const result: ApiResponse<StockProfile> = await response.json();
    
    if (!result.success) {
      throw new Error('API returned unsuccessful response');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching stock profile:', error);
    // Trả về dữ liệu mặc định nếu có lỗi
    return {
      id: '',
      symbol: symbol,
      name: symbol,
      exchange: null,
      industry: null,
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profile: {
        id: '',
        price: 0,
        profit: 0,
        volume: 0,
        pe: 0,
        eps: 0,
        roa: 0,
        roe: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
  }
} 