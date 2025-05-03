import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import { MultiChartView } from '@/components/ui/multi-chart';
import TechnicalAnalysisCharts from '@/components/charts/TechnicalAnalysisCharts';
import { getStockBySymbol } from '@/lib/services/stockService';
import StockProfile from '@/components/StockProfile';
// Type definitions
type Props = {
  params: Promise<{ symbol: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
  
  // Format date once to ensure consistent rendering between server and client
  const formattedDate = new Date().toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

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

      <div className="container mx-auto px-4 py-6 min-h-screen">
        <div className="space-y-6">


          <StockProfile symbol={symbol} />
         

          {/* Section 2: Biểu đồ phân tích giá */}
          <section aria-labelledby="technical-analysis-heading">
            <Card>
              <CardContent className="pt-6">
                <h2 id="technical-analysis-heading" className="text-2xl font-bold mb-4">Biểu đồ phân tích kỹ thuật</h2>
                <p className="text-gray-400 mb-4">Dữ liệu được cập nhật đến ngày {formattedDate}</p>
                <MultiChartView symbol={symbol} />
              </CardContent>
            </Card>
          </section>

          {/* Section 3: Biểu đồ phân tích kỹ thuật */}
          <section aria-labelledby="related-news-heading">
            <Card>
              <CardContent className="pt-6">
                <TechnicalAnalysisCharts symbol={symbol} />
              </CardContent>
            </Card>
          </section>

          {/* Section 4: Mô tả doanh nghiệp */}
          <section id="business-summary" aria-labelledby="business-summary-heading">
            <Card>
              <CardContent className="pt-6">
                <h2 id="business-summary-heading" className="text-2xl font-bold mb-4">Tóm tắt doanh nghiệp</h2>
                <div className="prose prose-invert max-w-none">
                  <p>{stockData.description || 'Chưa có thông tin mô tả.'}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-[#151B2E] p-3 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Ngành nghề</p>
                    <p className="font-medium">{stockData.industry}</p>
                  </div>
                  <div className="bg-[#151B2E] p-3 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Sàn giao dịch</p>
                    <p className="font-medium">{stockData.exchange}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 5: Cổ tức */}
          <section id="dividend-history" aria-labelledby="dividend-history-heading">
            <Card>
              <CardContent className="pt-6">
                <h2 id="dividend-history-heading" className="text-2xl font-bold mb-4">Lịch sử trả cổ tức</h2>
                <p className="text-gray-400 mb-4">Dữ liệu lịch sử trả cổ tức của {stockData.symbol}</p>
                <div className="space-y-4">
                  <p className="text-gray-500">Dữ liệu cổ tức đang cập nhật...</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </>
  );
} 