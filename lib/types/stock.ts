export interface Stock {
  id: string;
  symbol: string;
  name: string;
  exchange: string;
  industry: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockPrice {
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  marketCap: string;
  volume: string;
  value10Days: string;
  pe: string;
  pb: string;
  eps: string;
  roe: string;
  roa: string;
  bookValue: string;
}

export interface StockSearchParams {
  search?: string;
  exchange?: string;
  industry?: string;
  page?: number;
  limit?: number;
  sortBy?: 'symbol' | 'name' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
}

export interface StockSearchResponse {
  status: string;
  data: {
    stocks: Stock[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message: string;
} 