import { NewsSlider } from '@/components/NewsSlider';
import { NewsTicker } from '@/components/NewsTicker';
import { MultiChartView } from '@/components/ui/multi-chart';
import { StockTable } from '@/components/StockTable';
import Link from 'next/link';
// import { CurrencyChart } from '@/components/CurrencyChart';
// import { CurrencyNews } from '@/components/CurrencyNews';

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Section 1: Danh sách bài viết dạng slider */}
      Trang chur
      <section className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-primary">Tin tức mới nhất</h2>
          <div className="flex items-center gap-4">

            <Link href="/tin-tuc" className="text-sm text-primary hover:underline flex items-center group">
              Xem tất cả
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
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

      {/* Section 1: Danh sách bài viết dạng slider */}
      <section className="py-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-primary">Kiến thức đầu tư</h2>
          <div className="flex items-center gap-4">

            <Link href="/tin-tuc" className="text-sm text-primary hover:underline flex items-center group">
              Xem tất cả
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
        <NewsSlider />
      </section>


    </div>
  );
} 