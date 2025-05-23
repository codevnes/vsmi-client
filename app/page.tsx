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
      <section className="py-12 space-y-6">
        <Card className="p-6 shadow-sm">
          <NewsSlider />
        </Card>
      </section>

      {/* Section 2: Biểu đồ VNINDEX và Tin tức dạng text tự động chạy */}
      <section className="py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8 bg-card rounded-lg border p-4 shadow-sm">
            <MultiChartView symbol='VNINDEX' />
          </div>
          <div className="col-span-12 md:col-span-4 bg-card rounded-lg border p-4 shadow-sm h-[720px]">
            <NewsTicker />
          </div>
        </div>
      </section>

      {/* Section 3: Mã Chứng Khoán - Giá - Lợi nhuận - Chỉ số Q-index - KLGD - Biểu đồ */}
      <section className="py-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold mb-4">Mã Chứng Khoán Phổ Biến</h2>
            <StockTable />
          </CardContent>
        </Card>
      </section>

      {/* Section 4: Thị trường tiền tệ và Tin tức tiền tệ */}
      <section className="py-6">
        <Card className="overflow-hidden border-none shadow-md">
          <div className="bg-gradient-to-r from-blue-900/10 to-emerald-900/10 px-6 py-4 border-b">
            <h2 className="text-2xl font-bold">Thị Trường Tiền Tệ</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Tỷ giá hối đoái quốc tế và tin tức thị trường tiền tệ mới nhất
            </p>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-7">
                <CurrencyChart />
              </div>
              <div className="col-span-12 md:col-span-5 md:border-l md:pl-6">
                <CurrencyNews />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 5: Tài sản - Bất động sản - Cổ phiếu - Trái phiếu - Crypto */}
    </div>
  );
} 