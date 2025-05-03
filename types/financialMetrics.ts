export interface FinancialMetricsQueryParams {
  type: 'year' | 'quarter';
  page?: number;
  limit?: number;
}

export interface FinancialMetricRecord {
  id: string;
  symbol: string;
  year: number;
  quarter: number | null;
  eps: number;
  epsIndustry: number;
  pe: number;
  peIndustry: number;
  roa: number;
  roe: number;
  roaIndustry: number;
  roeIndustry: number;
  revenue: number;
  margin: number;
  totalDebtToEquity: number;
  totalAssetsToEquity: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialMetricsResponseData {
  symbol: string;
  stockName: string;
  type: 'year' | 'quarter';
  records: FinancialMetricRecord[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FinancialMetricsResponse {
  success: boolean;
  message: string;
  data: FinancialMetricsResponseData;
}

// Chart-specific types for TechnicalAnalysisCharts
export interface EPSDataItem {
  quarter?: string;
  year?: string;
  EPS: number;
  EPSNganh?: number;
}

export interface PEDataItem {
  quarter?: string;
  year?: string;
  PE: number;
  PENganh?: number;
}

export interface PerformanceDataItem {
  quarter?: string;
  year?: string;
  ROA: number;
  ROE: number;
  ROANganh?: number;
  ROENganh?: number;
}

export interface FinancialDataItem {
  quarter?: string;
  year?: string;
  NoPP: number;
  VonCSH: number;
}

export interface RevenueDataItem {
  quarter?: string;
  year?: string;
  Revenue: number;
  Margin: number;
}

export interface ChartDataMapped {
  eps: EPSDataItem[];
  pe: PEDataItem[];
  performance: PerformanceDataItem[];
  financial: FinancialDataItem[];
  revenue: RevenueDataItem[];
} 