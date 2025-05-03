'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, BarChart3, BookOpen, Building, ChevronRight, PieChart, Newspaper, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function IntroductionPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero section */}
      <section className="mb-16 text-center">
        <div className="mb-6 inline-block p-2 bg-primary/10 rounded-full">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          VSMI - Hệ thống thông tin chứng khoán
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Thông tin thị trường, phân tích kỹ thuật và tin tức chứng khoán cập nhật liên tục giúp bạn đưa ra quyết định đầu tư sáng suốt.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/tin-tuc">
              Tin tức thị trường
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/ma-chung-khoan/VNM">
              Xem thử mã VNM
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Key features section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tính năng chính</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            VSMI cung cấp đầy đủ các công cụ cần thiết để theo dõi và phân tích thị trường chứng khoán Việt Nam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Biểu đồ kỹ thuật</CardTitle>
              <CardDescription>
                Biểu đồ phân tích kỹ thuật với nhiều chỉ báo và công cụ phân tích
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Phân tích biểu đồ giá với các chỉ báo kỹ thuật phổ biến như MACD, RSI, Bollinger Bands và nhiều công cụ vẽ khác.
              </p>
              <Link 
                href="/ma-chung-khoan/VNM" 
                className="text-primary flex items-center hover:underline"
              >
                Xem biểu đồ mẫu
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <Newspaper className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Tin tức thị trường</CardTitle>
              <CardDescription>
                Tin tức thị trường chứng khoán cập nhật liên tục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Cập nhật tin tức thị trường, phân tích từ chuyên gia, tin tức doanh nghiệp và các sự kiện quan trọng ảnh hưởng đến thị trường.
              </p>
              <Link 
                href="/tin-tuc" 
                className="text-primary flex items-center hover:underline"
              >
                Xem tin tức
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <Building className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Thông tin doanh nghiệp</CardTitle>
              <CardDescription>
                Dữ liệu và thông tin chi tiết về doanh nghiệp niêm yết
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Thông tin tổng quan về doanh nghiệp, chỉ số tài chính, báo cáo phân tích và lịch sử giao dịch cổ phiếu.
              </p>
              <Link 
                href="/ma-chung-khoan/VNM" 
                className="text-primary flex items-center hover:underline"
              >
                Xem thông tin doanh nghiệp
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <PieChart className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Phân tích cơ bản</CardTitle>
              <CardDescription>
                Dữ liệu và phân tích cơ bản về cổ phiếu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Chỉ số tài chính, báo cáo kết quả kinh doanh, các chỉ số định giá và so sánh với doanh nghiệp cùng ngành.
              </p>
              <Link 
                href="/ma-chung-khoan/VNM" 
                className="text-primary flex items-center hover:underline"
              >
                Xem phân tích
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <DollarSign className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Tỷ giá và hàng hóa</CardTitle>
              <CardDescription>
                Thông tin về tỷ giá, vàng và các hàng hóa khác
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Theo dõi biến động của tỷ giá, giá vàng, dầu và các hàng hóa khác ảnh hưởng đến thị trường chứng khoán.
              </p>
              <Link 
                href="/" 
                className="text-primary flex items-center hover:underline"
              >
                Xem tỷ giá
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-all hover:shadow-md">
            <CardHeader>
              <Users className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Cộng đồng đầu tư</CardTitle>
              <CardDescription>
                Kết nối với cộng đồng nhà đầu tư
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Trao đổi, chia sẻ thông tin và học hỏi kinh nghiệm từ cộng đồng nhà đầu tư trên VSMI.
              </p>
              <Link 
                href="/lien-he" 
                className="text-primary flex items-center hover:underline"
              >
                Tham gia ngay
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Demo section with tabs */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Khám phá các tính năng</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Trải nghiệm các tính năng mạnh mẽ của VSMI để đưa ra quyết định đầu tư thông minh
          </p>
        </div>

        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chart">Biểu đồ</TabsTrigger>
            <TabsTrigger value="news">Tin tức</TabsTrigger>
            <TabsTrigger value="analysis">Phân tích</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video relative overflow-hidden rounded-lg border mb-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1642543348745-268b5b8662ff?q=80&w=1200&auto=format" 
                    alt="Biểu đồ phân tích kỹ thuật"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Biểu đồ phân tích kỹ thuật</h3>
                <p className="text-muted-foreground mb-4">
                  Công cụ biểu đồ chuyên nghiệp với đầy đủ các chỉ báo kỹ thuật và công cụ vẽ để phân tích thị trường chứng khoán.
                </p>
                <Button asChild>
                  <Link href="/ma-chung-khoan/VNM">
                    Xem biểu đồ mẫu
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="news" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video relative overflow-hidden rounded-lg border mb-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format" 
                    alt="Tin tức thị trường"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Tin tức thị trường cập nhật</h3>
                <p className="text-muted-foreground mb-4">
                  Cập nhật tin tức thị trường chứng khoán trong nước và quốc tế, giúp bạn nắm bắt thông tin nhanh chóng và chính xác.
                </p>
                <Button asChild>
                  <Link href="/tin-tuc">
                    Xem tin tức
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analysis" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="aspect-video relative overflow-hidden rounded-lg border mb-4">
                  <Image 
                    src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format" 
                    alt="Phân tích cơ bản"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Phân tích cơ bản doanh nghiệp</h3>
                <p className="text-muted-foreground mb-4">
                  Công cụ phân tích cơ bản giúp đánh giá hiệu quả hoạt động của doanh nghiệp thông qua các chỉ số tài chính và so sánh ngành.
                </p>
                <Button asChild>
                  <Link href="/ma-chung-khoan/VNM">
                    Xem phân tích
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Categories */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Danh mục tin tức</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Khám phá tin tức thị trường theo các danh mục chuyên biệt
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link 
            href="/thi-truong-chung"
            className="p-6 border rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Thị trường chung</h3>
              <p className="text-sm text-muted-foreground">Thông tin chung về thị trường</p>
            </div>
          </Link>
          
          <Link 
            href="/co-phieu"
            className="p-6 border rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Cổ phiếu</h3>
              <p className="text-sm text-muted-foreground">Thông tin về cổ phiếu</p>
            </div>
          </Link>
          
          <Link 
            href="/phan-tich-ky-thuat"
            className="p-6 border rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <PieChart className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Phân tích kỹ thuật</h3>
              <p className="text-sm text-muted-foreground">Phân tích biểu đồ kỹ thuật</p>
            </div>
          </Link>
          
          <Link 
            href="/nhan-dinh-chuyen-gia"
            className="p-6 border rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Nhận định chuyên gia</h3>
              <p className="text-sm text-muted-foreground">Ý kiến từ các chuyên gia</p>
            </div>
          </Link>
          
          <Link 
            href="/tai-chinh-quoc-te"
            className="p-6 border rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Tài chính quốc tế</h3>
              <p className="text-sm text-muted-foreground">Tin tức tài chính toàn cầu</p>
            </div>
          </Link>
          
          <Link 
            href="/doanh-nghiep"
            className="p-6 border rounded-lg hover:bg-primary/5 transition-colors flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Building className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Doanh nghiệp</h3>
              <p className="text-sm text-muted-foreground">Thông tin về doanh nghiệp</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Call to action */}
      <section className="text-center py-12 px-4 bg-primary/5 rounded-xl">
        <h2 className="text-3xl font-bold mb-4">Bắt đầu ngay hôm nay</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Trải nghiệm hệ thống thông tin chứng khoán toàn diện nhất để đưa ra quyết định đầu tư thông minh
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/tin-tuc">
              Xem tin tức
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/lien-he">
              Liên hệ hỗ trợ
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
} 