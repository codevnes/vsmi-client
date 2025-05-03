import { Currency, CurrencyPrice, CurrencyPriceResponse, CurrencyQueryParams, CurrencyResponse } from '../types/currency';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.vsmi.com/api/v1";

/**
 * Fetches the list of all currencies
 */
export async function fetchCurrencies(
  params?: CurrencyQueryParams
): Promise<CurrencyResponse> {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params?.search) {
    queryParams.append('search', params.search);
  }
  
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  
  if (params?.offset) {
    queryParams.append('offset', params.offset.toString());
  }
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const url = `${API_BASE_URL}/currencies${queryString}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching currencies: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as CurrencyResponse;
  } catch (error) {
    console.error('Error fetching currencies:', error);
    throw error;
  }
}

/**
 * Fetches all price data for a specific currency
 */
export async function fetchCurrencyPrices(
  currencyCode: string
): Promise<CurrencyPriceResponse> {
  const url = `${API_BASE_URL}/currencies/prices/all?code=${encodeURIComponent(currencyCode)}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching currency prices: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as CurrencyPriceResponse;
  } catch (error) {
    console.error(`Error fetching currency prices for ${currencyCode}:`, error);
    throw error;
  }
}

/**
 * Converts API currency price data to chart-compatible format
 * and ensures data is sorted in ascending order by date
 */
export function mapCurrencyPricesToChartData(prices: CurrencyPrice[]) {
  // Create a copy of the array to avoid mutating the original
  const sortedPrices = [...prices];
  
  // Sort by date in ascending order (oldest first)
  sortedPrices.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  return sortedPrices.map(price => ({
    date: price.date.split('T')[0], // Convert ISO date to YYYY-MM-DD
    open: parseFloat(price.open.toString()),
    high: parseFloat(price.high.toString()),
    low: parseFloat(price.low.toString()),
    close: parseFloat(price.close.toString()),
    trendQ: parseFloat(price.trendQ.toString()),
    fq: parseFloat(price.fq.toString())
  }));
} 