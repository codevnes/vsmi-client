export interface Currency {
  code: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyResponse {
  success: boolean;
  data: Currency[];
  total: number;
  message: string;
}

export interface CurrencyQueryParams {
  search?: string;
  limit?: number;
  offset?: number;
}

export interface CurrencyPrice {
  id: string;
  currencyCode: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  trendQ: number;
  fq: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyPriceResponse {
  success: boolean;
  data: CurrencyPrice[];
  total: number;
  message: string;
} 