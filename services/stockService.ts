import { StockPrice, StockPriceQueryParams, StockPriceResponse } from '../types/stock';
import { 
  FinancialMetricsResponse, 
  FinancialMetricsQueryParams,
  FinancialMetricRecord,
  ChartDataMapped
} from '@/types/financialMetrics';
import { Stock, StocksResponse, StockQueryParams } from "@/types/stock";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.vsmi.com/api/v1";

/**
 * Fetches stock price data for a specific symbol
 */
export async function fetchStockPrices(
  symbol: string,
  params?: StockPriceQueryParams
): Promise<StockPriceResponse> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params?.startDate) {
    queryParams.append('startDate', params.startDate);
  }
  
  if (params?.endDate) {
    queryParams.append('endDate', params.endDate);
  }
  
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.sortDirection) {
    queryParams.append('sortDirection', params.sortDirection);
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const url = `${API_BASE_URL}/stock-prices/symbol/${symbol}${queryString}`;
  
  // Make API request
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching stock prices: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle both old and new response formats
    if (data.success !== undefined) {
      // New format with success field
      return data as StockPriceResponse;
    } else if (data.status === 'success') {
      // Old format with status field
      // Convert to new format
      return {
        success: true,
        message: data.message,
        data: data.data
      } as StockPriceResponse;
    } else {
      throw new Error('Unknown API response format');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw error;
  }
}

/**
 * Converts API stock price data to chart-compatible format
 */
export function mapStockPricesToChartData(stockPrices: StockPrice[]) {
  return stockPrices.map(price => ({
    date: price.date.split('T')[0], // Convert ISO date to YYYY-MM-DD
    open: price.open,
    high: price.high,
    low: price.low,
    close: price.close,
    trendQ: price.trendQ,
    fq: price.fq,
    volume: price.volume,
    bandDown: price.bandDown,
    bandUp: price.bandUp
  }));
}

/**
 * Fetches financial metrics reports for a specific stock symbol
 */
export async function fetchFinancialMetrics(
  symbol: string,
  params: FinancialMetricsQueryParams
): Promise<FinancialMetricsResponse> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.type) {
    queryParams.append('type', params.type);
  }
  
  if (params.page) {
    queryParams.append('page', params.page.toString());
  }
  
  if (params.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const url = `${API_BASE_URL}/financial-metrics/stock/${symbol}/reports${queryString}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching financial metrics: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as FinancialMetricsResponse;
  } catch (error) {
    console.error('Error fetching financial metrics:', error);
    throw error;
  }
}

/**
 * Converts financial metrics data to chart-compatible format for TechnicalAnalysisCharts
 */
export function mapFinancialMetricsToChartData(data: FinancialMetricsResponse): ChartDataMapped {
  const { records } = data.data;
  const isQuarterly = data.data.type === 'quarter';
  
  if (isQuarterly) {
    // For quarterly data
    const epsData = records.map((record: FinancialMetricRecord) => ({
      quarter: `Q${record.quarter}/${record.year}`,
      EPS: record.eps,
    })).reverse();
    
    const performanceData = records.map((record: FinancialMetricRecord) => ({
      quarter: `Q${record.quarter}/${record.year}`,
      ROA: record.roa * 100, // Convert to percentage
      ROE: record.roe * 100, // Convert to percentage
    })).reverse();
    
    const revenueData = records.map((record: FinancialMetricRecord) => ({
      quarter: `Q${record.quarter}/${record.year}`,
      Revenue: record.revenue / 1000000000, // Convert to billions
      Margin: record.margin * 100, // Convert to percentage
    })).reverse();
    
    const financialData = records.map((record: FinancialMetricRecord) => ({
      quarter: `Q${record.quarter}/${record.year}`,
      NoPP: record.totalDebtToEquity,
      VonCSH: record.totalAssetsToEquity,
    })).reverse();
    
    return {
      eps: epsData,
      performance: performanceData,
      revenue: revenueData,
      financial: financialData,
      pe: [] // Not used in quarterly view
    };
  } else {
    // For yearly data
    const epsData = records.map((record: FinancialMetricRecord) => ({
      year: record.year.toString(),
      EPS: record.eps,
      EPSNganh: record.epsIndustry || 0
    })).reverse();
    
    const peData = records.map((record: FinancialMetricRecord) => ({
      year: record.year.toString(),
      PE: record.pe || 0,
      PENganh: record.peIndustry || 0
    })).reverse();
    
    const performanceData = records.map((record: FinancialMetricRecord) => ({
      year: record.year.toString(),
      ROA: record.roa * 100, // Convert to percentage
      ROE: record.roe * 100, // Convert to percentage
      ROANganh: record.roaIndustry ? record.roaIndustry * 100 : 0, // Convert to percentage
      ROENganh: record.roeIndustry ? record.roeIndustry * 100 : 0, // Convert to percentage
    })).reverse();
    
    const financialData = records.map((record: FinancialMetricRecord) => ({
      year: record.year.toString(),
      NoPP: record.totalDebtToEquity,
      VonCSH: record.totalAssetsToEquity,
    })).reverse();
    
    return {
      eps: epsData,
      pe: peData,
      performance: performanceData,
      financial: financialData,
      revenue: [] // Not used in yearly view
    };
  }
}

/**
 * Fetch selected stocks with price history
 */
export async function fetchSelectedStocksWithPriceHistory(
  params?: StockQueryParams
): Promise<Stock[]> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.exchange) queryParams.append("exchange", params.exchange);
  if (params?.industry) queryParams.append("industry", params.industry);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/selected-stocks/with-price-history${queryString}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch stocks: ${response.status} ${response.statusText}`);
    }
    
    const result = await response.json();
    
    // Check if response has the expected structure
    if (result && result.success && result.data && result.data.stocks) {
      return result.data.stocks as Stock[];
    } else if (result && result.stocks) {
      return result.stocks as Stock[];
    } else if (Array.isArray(result)) {
      return result as Stock[];
    } else {
      console.error('Unexpected API response format:', result);
      return [];
    }
  } catch (error) {
    console.error('Error fetching selected stocks:', error);
    throw error;
  }
}

/**
 * Fetch a single stock with price history by symbol
 */
export async function fetchStockBySymbol(symbol: string): Promise<Stock> {
  const response = await fetch(
    `${API_BASE_URL}/stocks/${symbol}/with-price-history`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch stock ${symbol}: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch available exchanges
 */
export async function fetchExchanges(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/exchanges`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch exchanges: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch available industries
 */
export async function fetchIndustries(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/industries`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch industries: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
} 