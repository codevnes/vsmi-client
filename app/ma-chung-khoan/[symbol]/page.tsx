import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import { MultiChartView } from '@/components/ui/multi-chart';
import TechnicalAnalysisCharts from '@/components/charts/TechnicalAnalysisCharts';
import { getStockBySymbol } from '@/lib/services/stockService';
import StockProfile from '@/components/StockProfile';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ComponentProps } from 'react';
import FScoreRadarChart from '@/app/components/charts/FScoreRadarChart';

// Type definitions
type Props = {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Financial recommendation data type
type FinancialRecommendation = {
  symbol: string;
  f_score: number;
  z_score: number;
  industry_rank: number;
  financial_health: string;
  industry_comparison: string;
  risk_warnings: string;
  investment_recommendation: string;
}

// Function to fetch financial recommendation data
async function getFinancialRecommendation(symbol: string): Promise<FinancialRecommendation | null> {
  try {
    const response = await fetch(`http://103.162.21.193:4000/api/stocks/${symbol}`);
    const result = await response.json();

    if (result.success && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch financial recommendation:", error);
    return null;
  }
}

// Function to process markdown content
function processMarkdown(content: string): string {
  if (!content) return '';

  // Remove the trailing "###" markers used as section separators
  return content.replace(/###\s*$/, '').trim();
}

// Function to fetch financial data for F-Score analysis
async function getFinancialData(symbol: string): Promise<any> {
  try {
    // This would normally fetch from an API or database
    // Using demo data for now based on the example:
    // ROA>0 CFO>0 ΔROA>0 CFO>LNST ΔNợ dài hạn<0 ΔCurrent Ratio>0 Không phát hành CP ΔGross Margin>0 ΔAsset Turnover>0
    // 1    0    0      0        0             1                 1                  0               0
    return {
      roaPositive: true,            // ROA > 0 = 1
      cfoPositive: false,           // CFO > 0 = 0
      roaGrowth: false,             // ΔROA > 0 = 0
      cfoGreaterThanLNST: false,    // CFO > LNST = 0
      longTermDebtDecreased: false, // ΔNợ dài hạn < 0 = 0
      currentRatioIncreased: true,  // ΔCurrent Ratio > 0 = 1
      noShareIssuance: true,        // Không phát hành CP = 1
      grossMarginIncreased: false,  // ΔGross Margin > 0 = 0
      assetTurnoverIncreased: false // ΔAsset Turnover > 0 = 0
    };
  } catch (error) {
    console.error("Failed to fetch financial data:", error);
    return null;
  }
}

// Generate metadata for the page
export async function generateMetadata(
  props: Props
): Promise<Metadata> {
  // Unwrap params asynchronously
  const unwrappedParams = await props.params;
  const symbol = unwrappedParams?.symbol?.toUpperCase() || '';
  const stockData = await getStockBySymbol(symbol);

  return {
    title: `${stockData.symbol} - ${stockData.name} | Thông tin cổ phiếu`,
    description: `Xem thông tin chi tiết về cổ phiếu ${stockData.symbol} (${stockData.exchange}) - ${stockData.name}. Biểu đồ, tin tức và phân tích kỹ thuật.`,
    keywords: [`${stockData.symbol}`, 'cổ phiếu', 'chứng khoán', `${stockData.exchange}`, 'phân tích kỹ thuật', 'đầu tư'],
    openGraph: {
      title: `${stockData.symbol} - ${stockData.name}`,
      description: `${stockData.industry} - ${stockData.description?.substring(0, 100)}...`,
      type: 'website',
      siteName: 'VSMI - Hệ thống thông tin chứng khoán',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${stockData.symbol} - ${stockData.name}`,
      description: `${stockData.industry} - ${stockData.description?.substring(0, 100)}...`
    }
  };
}

// Main page component
export default function StockDetailPage(props: Props) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(props.params);
  const searchParams = React.use(props.searchParams);
  const symbol = unwrappedParams?.symbol?.toUpperCase() || '';
  const stockDataPromise = getStockBySymbol(symbol);
  const stockData = React.use(stockDataPromise);

  // Fetch financial recommendation data
  const financialRecommendationPromise = getFinancialRecommendation(symbol);
  const financialRecommendation = React.use(financialRecommendationPromise);

  // Fetch F-Score data
  const financialDataPromise = getFinancialData(symbol);
  const financialData = React.use(financialDataPromise);

  // Format date once to ensure consistent rendering between server and client
  const formattedDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  // Markdown rendering components with custom styling
  const MarkdownComponent = ({ content }: { content: string }) => {
    const processedContent = processMarkdown(content);

    // Component types
    type ComponentType = Partial<ComponentProps<typeof ReactMarkdown>['components']>;

    // Define custom components with proper typing
    const components: ComponentType = {
      strong: ({ children }) => <span className="font-bold text-blue-400">{children}</span>,
      h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-100">{children}</h3>,
      ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 my-3">{children}</ul>,
      li: ({ children }) => <li className="my-1">{children}</li>,
      p: ({ children }) => <p className="my-2">{children}</p>
    };

    return (
      <div className="prose dark:prose-invert max-w-none dark:text-gray-300">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  };

  // Structured data for improved SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FinancialProduct',
    'name': `${stockData.symbol} - ${stockData.name}`,
    'description': stockData.description,
    'category': 'Stock',
    'offers': {
      '@type': 'Offer',
      'priceCurrency': 'VND'
    },
    'additionalProperty': [
      {
        '@type': 'PropertyValue',
        'name': 'Exchange',
        'value': stockData.exchange
      },
      {
        '@type': 'PropertyValue',
        'name': 'Industry',
        'value': stockData.industry
      }
    ]
  };

  return (
    <>
      {/* Add structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 py-6 min-h-screen dark:bg-gray-900">
        <div className="space-y-6">

          <StockProfile symbol={symbol} />

          {/* Section 1: Khuyến nghị tài chính */}
          {financialRecommendation && (
            <section aria-labelledby="financial-recommendation-heading">
              <Card className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="pt-6">
                  <h2 id="financial-recommendation-heading" className="text-2xl font-bold mb-4 dark:text-white">Khuyến nghị tài chính</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Dữ liệu được cập nhật đến ngày {formattedDate}</p>

                  {/* Part 1: F-Score */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">1. Tổng quan sức khỏe tài chính (F-Score)</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 dark:text-gray-400">F-Score</span>
                        <div className="text-2xl font-bold dark:text-white">{financialRecommendation.f_score}/9</div>
                      </div>
                      <div className={`text-lg font-semibold ${financialRecommendation.f_score >= 7 ? 'text-green-500' :
                        financialRecommendation.f_score >= 5 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                        {financialRecommendation.f_score >= 7 ? 'Khỏe mạnh' :
                          financialRecommendation.f_score >= 5 ? 'Trung bình' : 'Yếu'}
                      </div>
                    </div>
                    <div className="mt-4">
                      <MarkdownComponent content={financialRecommendation.financial_health} />
                    </div>
                  </div>

                  {/* Part 2: Z-Score */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">2. So sánh doanh nghiệp với ngành (Z-Score)</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Z-Score</span>
                        <div className="text-2xl font-bold dark:text-white">{financialRecommendation.z_score.toFixed(2)}</div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Xếp hạng ngành</span>
                        <div className="text-2xl font-bold dark:text-white">{financialRecommendation.industry_rank}/100</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <MarkdownComponent content={financialRecommendation.industry_comparison} />
                    </div>
                  </div>

                  {/* Part 3: Risk Warnings */}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">3. Cảnh báo rủi ro</h3>
                    <div className="mt-4">
                      <MarkdownComponent content={financialRecommendation.risk_warnings} />
                    </div>
                  </div>

                  {/* Part 4: Investment Recommendation */}
                  <div className="mb-2">
                    <h3 className="text-xl font-semibold mb-2 dark:text-gray-100">4. Khuyến nghị đầu tư</h3>
                    <div className="mt-4">
                      <MarkdownComponent content={financialRecommendation.investment_recommendation} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Section 2: Biểu đồ phân tích giá */}
          <section aria-labelledby="technical-analysis-heading">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <h2 id="technical-analysis-heading" className="text-2xl font-bold mb-4 dark:text-white">Biểu đồ phân tích kỹ thuật</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Dữ liệu được cập nhật đến ngày {formattedDate}</p>
                <MultiChartView symbol={symbol} />
              </CardContent>
            </Card>
          </section>

          {/* Section: Phân tích cơ bản */}
          <section>
            <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="bg-blue-600 dark:bg-blue-800 p-6">
                  <h2 id="basic-analysis-heading" className="text-2xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Phân tích cơ bản
                  </h2>
                  <p className="text-blue-100 mt-2">Dữ liệu được cập nhật đến ngày {formattedDate}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Left column: Financial indicators */}
                  <div className="lg:col-span-5 border-r border-gray-200 dark:border-gray-700">
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Chỉ số tài chính
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr>
                              <th className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 text-left rounded-tl-lg">CHỈ TIÊU</th>
                              <th className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-3 px-4 text-right rounded-tr-lg">GIÁ TRỊ</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td colSpan={2} className="font-medium py-3 px-4 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300">A. KHẢ NĂNG SINH LỢI</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Tỷ suất lợi nhuận trên tổng tài sản (%)</td>
                              <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{3}%</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Dòng tiền từ hoạt động kinh doanh (Tỷ VND)</td>
                              <td className="py-3 px-4 text-right font-medium text-red-500">-{1.415}</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Tăng trưởng ROA so với năm trước (%)</td>
                              <td className="py-3 px-4 text-right font-medium text-green-500">{2.46}%</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• So sánh dòng tiền KD với LNST (Tỷ VND)</td>
                              <td className="py-3 px-4 text-right font-medium text-red-500">-{1.930}</td>
                            </tr>

                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td colSpan={2} className="font-medium py-3 px-4 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300">B. ĐÒN BẨY VÀ THANH KHOẢN</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Nợ dài hạn so với năm trước (Tỷ VND)</td>
                              <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{0}</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Biến động hệ số thanh toán ngắn hạn (%)</td>
                              <td className="py-3 px-4 text-right font-medium text-red-500">-{7}%</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Số lượng CP phát hành thêm (Tr)</td>
                              <td className="py-3 px-4 text-right font-medium text-gray-500 dark:text-gray-400">-</td>
                            </tr>

                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td colSpan={2} className="font-medium py-3 px-4 bg-gray-50 dark:bg-gray-750 text-gray-700 dark:text-gray-300">C. HIỆU QUẢ HOẠT ĐỘNG</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300">• Tăng trưởng biên lợi nhuận gộp</td>
                              <td className="py-3 px-4 text-right font-medium text-green-500">{1}%</td>
                            </tr>
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 rounded-b-lg">
                              <td className="py-3 px-4 text-gray-700 dark:text-gray-300 rounded-bl-lg">• Tăng trưởng vòng quay tài sản</td>
                              <td className="py-3 px-4 text-right font-medium text-green-500 rounded-br-lg">{18}%</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Middle and Right columns in a unified container */}
                  <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-850">
                    <div className="p-6">
                      {/* F-Score Model */}
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                          </svg>
                          Mô hình F-Score
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Radar Chart */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="w-full h-64">
                              <FScoreRadarChart indicators={financialData} />
                            </div>
                          </div>

                          {/* F-Score Scoring */}
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <div className="mb-4">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr>
                                    <th colSpan={2} className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-3 text-center rounded-t-lg">
                                      Mô hình chấm điểm F-Score
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Sinh lợi</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{2}</td>
                                  </tr>
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Đòn bẩy</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{1}</td>
                                  </tr>
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">Hiệu quả</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">{2}</td>
                                  </tr>
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300 font-medium">Tổng điểm</td>
                                    <td className="py-3 px-4 text-right font-bold bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-br-lg">{5}/{9}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div>
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr>
                                    <th colSpan={2} className="bg-blue-600 dark:bg-blue-700 text-white py-2 px-3 text-center rounded-t-lg">
                                      Định giá
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">P/E</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white"></td>
                                  </tr>
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300">P/E ngành</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white"></td>
                                  </tr>
                                  <tr className="bg-white dark:bg-gray-800">
                                    <td className="py-3 px-4 text-gray-700 dark:text-gray-300 rounded-bl-lg">P/E dự phóng</td>
                                    <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white rounded-br-lg"></td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interpretation summary */}
                      <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-sm mt-6">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Kết luận
                        </h3>
                        <div className="prose dark:prose-invert max-w-none">
                          <p className="text-gray-700 dark:text-gray-300">
                            Doanh nghiệp có chỉ số F-Score đạt <span className="font-medium text-amber-600 dark:text-amber-400">5/9 điểm (trung bình)</span>.
                            Điểm mạnh ở khả năng sinh lời và không phát hành thêm cổ phiếu.
                            Tuy nhiên, dòng tiền từ hoạt động kinh doanh âm là dấu hiệu cần lưu ý.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section: Phân tích kỹ thuật */}
          <section>
            <Card className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden border-0 shadow-lg mb-6">
              <CardContent className="p-0">
                <div className="bg-blue-600 dark:bg-blue-800 p-6">
                  <h2 id="technical-analysis-heading" className="text-2xl font-bold text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Phân tích kỹ thuật
                  </h2>
                  <p className="text-blue-100 mt-2">Dữ liệu được cập nhật đến ngày {formattedDate}</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Table A: Nhóm chỉ báo dao động */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                      <span className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-7 h-7 rounded-full mr-2 text-sm font-bold">A</span>
                      NHÓM CHỈ BÁO DAO ĐỘNG
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 py-2 px-4 text-left">Chỉ báo</th>
                            <th className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 py-2 px-4 text-right">Giá trị</th>
                            <th className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 py-2 px-4 text-center">Tín hiệu</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Relative Strength Index (14)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">62</td>
                            <td className="py-2 px-4 text-center font-medium text-yellow-600 dark:text-yellow-400">Trung Lập</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Stochastic %K</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">93</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">BÁN</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Williams_%R</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">-4</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">BÁN</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Ultimate_Oscillator</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">60</td>
                            <td className="py-2 px-4 text-center font-medium text-yellow-600 dark:text-yellow-400">Trung Lập</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Commodity Channel Index (20)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">165</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">BÁN</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Stochastic RSI Fast</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">99</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">BÁN</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Table B: Nhóm chỉ báo xu hướng */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                      <span className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-7 h-7 rounded-full mr-2 text-sm font-bold">B</span>
                      NHÓM CHỈ BÁO XU HƯỚNG
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 py-2 px-4 text-left">Chỉ báo</th>
                            <th className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 py-2 px-4 text-right">Giá trị</th>
                            <th className="bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-100 py-2 px-4 text-center">Xu hướng</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MACD Level (12, 26)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">-5</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">GIẢM</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Average Directional Index (14)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">28</td>
                            <td className="py-2 px-4 text-center font-medium text-yellow-600 dark:text-yellow-400">Có xu hướng</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Momentum (10)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">2.300</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MA (10)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">14.850</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MA (20)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">14.145</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MA (30)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">14.535</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MA (50)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">15.854</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MA (100)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">16.607</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">GIẢM</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">MA (200)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">18.173</td>
                            <td className="py-2 px-4 text-center font-medium text-red-600 dark:text-red-400">GIẢM</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Hull Moving Average (9)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">15.615</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                          <tr className="bg-white dark:bg-gray-800">
                            <td className="py-2 px-4 text-gray-700 dark:text-gray-300">Ichimoku Base Line (9, 26, 52, 26)</td>
                            <td className="py-2 px-4 text-right font-medium text-gray-900 dark:text-white">14.250</td>
                            <td className="py-2 px-4 text-center font-medium text-green-600 dark:text-green-400">TĂNG</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Biểu đồ phân tích kỹ thuật */}
          <section aria-labelledby="related-news-heading">
            <TechnicalAnalysisCharts symbol={symbol} />
          </section>

        </div>
      </div>
    </>
  );
} 