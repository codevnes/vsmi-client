export interface StockPrice {
  id: string;
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  trendQ: number;
  fq: number;
  bandDown?: number;
  bandUp?: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockPriceResponse {
  success: boolean;
  message: string;
  data: {
    stockPrices: StockPrice[];
    total: number;
    page: number;
    limit: number | null;
    totalPages: number;
  };
}

export interface StockPriceQueryParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortDirection?: 'asc' | 'desc';
}

export interface PriceHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface LatestSelectedStocks {
  date: string;
  close: number;
  return: number | null;
  qIndex: number;
  volume: number;
}

export interface Stock {
  symbol: string;
  stockName: string;
  exchange: string;
  industry: string;
  latestSelectedStocks: LatestSelectedStocks;
  priceHistory: PriceHistory[];
}

export interface StocksData {
  stocks: Stock[];
  total: number;
  page: number;
  limit: number | null;
  totalPages: number;
}

export interface StocksResponse {
  success: boolean;
  message: string;
  data: StocksData;
}

export interface StockQueryParams {
  page?: number;
  limit?: number;
  exchange?: string;
  industry?: string;
} 