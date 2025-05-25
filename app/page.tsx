import { NewsSlider } from '@/components/NewsSlider';
import { NewsTicker } from '@/components/NewsTicker';
import { MultiChartView } from '@/components/ui/multi-chart';
import { StockTable } from '@/components/StockTable';
import { CurrencyChart } from '@/components/CurrencyChart';
import { CurrencyNews } from '@/components/CurrencyNews';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Section 1: Danh sách bài viết dạng slider */}
      <section className="py-6">
        <NewsSlider />
      </section>

      {/* Section 2: Biểu đồ VNINDEX và Tin tức dạng text tự động chạy */}
      <section className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <MultiChartView symbol='VNINDEX' />
          </div>
          <div className="col-span-12 md:col-span-4 h-auto lg:h-[720px]">
            <NewsTicker />
          </div>
        </div>
      </section>

      {/* Section 3: Mã Chứng Khoán - Giá - Lợi nhuận - Chỉ số Q-index - KLGD - Biểu đồ */}
      <section className="py-6">
        <h2 className="text-2xl font-bold mb-4">Top phiếu Q-index</h2>
        <StockTable />
      </section>


    </div>
  );
} 