import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { Calendar, Clock, ArrowUpRight, TrendingUp, ChevronRight, Tag } from "lucide-react";

// Demo data for categories and articles
const categories = [
  { slug: "thi-truong-chung", name: "Thị trường chung" },
  { slug: "co-phieu", name: "Cổ phiếu" },
  { slug: "phan-tich-ky-thuat", name: "Phân tích kỹ thuật" },
  { slug: "nhan-dinh-chuyen-gia", name: "Nhận định chuyên gia" },
  { slug: "tai-chinh-quoc-te", name: "Tài chính quốc tế" },
  { slug: "doanh-nghiep", name: "Doanh nghiệp" },
];

// Demo articles mapping by category
const articlesByCategory = {
  "thi-truong-chung": [
    {
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format",
      title: "Thị trường chứng khoán Việt Nam đạt đỉnh mới với sự hậu thuẫn từ dòng vốn ngoại",
      summary: "VN-Index vượt mốc 1,500 điểm lần đầu tiên trong năm 2024, nhà đầu tư nước ngoài mua ròng hơn 5,000 tỷ đồng trong tuần qua.",
      date: "12/05/2024",
      readTime: "8 phút",
      slug: "thi-truong-chung-khoan-viet-nam-dat-dinh-moi"
    },
    {
      image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=1200&auto=format",
      title: "Nhóm vốn hóa lớn dẫn dắt thị trường, thanh khoản tăng mạnh",
      summary: "Các cổ phiếu vốn hóa lớn như VIC, VHM, VCB đã dẫn dắt đà tăng của thị trường với thanh khoản đạt hơn 25,000 tỷ đồng.",
      date: "11/05/2024",
      readTime: "6 phút",
      slug: "nhom-von-hoa-lon-dan-dat-thi-truong"
    },
    {
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1200&auto=format",
      title: "Khối ngoại mua ròng phiên thứ 10 liên tiếp, VN-Index vượt mốc 1,500",
      summary: "Nhà đầu tư nước ngoài tiếp tục mua ròng với giá trị hơn 800 tỷ đồng, tập trung vào các cổ phiếu ngân hàng và bất động sản.",
      date: "10/05/2024",
      readTime: "7 phút",
      slug: "khoi-ngoai-mua-rong-phien-thu-10-lien-tiep"
    },
    {
      image: "https://images.unsplash.com/photo-1642543348745-268b5b8662ff?q=80&w=1200&auto=format",
      title: "Nhận định thị trường: Dòng tiền có thể tiếp tục chảy vào nhóm cổ phiếu ngân hàng",
      summary: "Các chuyên gia nhận định dòng tiền có thể tiếp tục tập trung vào nhóm cổ phiếu ngân hàng và chứng khoán trong ngắn hạn.",
      date: "09/05/2024",
      readTime: "5 phút",
      slug: "nhan-dinh-thi-truong-dong-tien-co-the-tiep-tuc-chay-vao-nhom-co-phieu-ngan-hang"
    },
  ],
  "co-phieu": [
    {
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&auto=format",
      title: "NHNN điều chỉnh lãi suất điều hành, ảnh hưởng đến nhóm cổ phiếu ngân hàng",
      summary: "Lãi suất điều hành giảm 0.5% sẽ tạo động lực cho thị trường vốn và tác động tích cực đến nhóm cổ phiếu ngân hàng trong ngắn hạn.",
      date: "10/05/2024",
      readTime: "5 phút",
      slug: "nhnn-dieu-chinh-lai-suat-dieu-hanh"
    },
    {
      image: "https://images.unsplash.com/photo-1560264280-88b68371db39?q=80&w=500&auto=format",
      title: "Nhóm cổ phiếu công nghệ tăng mạnh sau khi công bố kết quả kinh doanh quý 1/2024",
      summary: "FPT, VNG và các cổ phiếu công nghệ khác tăng trưởng ấn tượng nhờ kết quả kinh doanh vượt kỳ vọng và triển vọng tích cực từ AI.",
      date: "08/05/2024",
      readTime: "4 phút",
      slug: "nhom-co-phieu-cong-nghe-tang-manh"
    },
    {
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format",
      title: "Cổ phiếu ngân hàng hút dòng tiền mạnh, VCB lập đỉnh lịch sử",
      summary: "Nhóm cổ phiếu ngân hàng tiếp tục hút dòng tiền mạnh trong phiên giao dịch 07/05, với VCB đạt mức giá cao nhất lịch sử.",
      date: "07/05/2024",
      readTime: "6 phút",
      slug: "co-phieu-ngan-hang-hut-dong-tien-manh"
    },
  ],
  "phan-tich-ky-thuat": [
    {
      image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?q=80&w=500&auto=format",
      title: "Phân tích kỹ thuật: VN-Index đang ở vùng kháng cự mạnh, nhà đầu tư nên thận trọng",
      summary: "Các chỉ báo kỹ thuật cho thấy thị trường đang tiếp cận vùng kháng cự mạnh, khả năng điều chỉnh ngắn hạn cao.",
      date: "09/05/2024",
      readTime: "6 phút",
      slug: "phan-tich-ky-thuat-vn-index-dang-o-vung-khang-cu-manh"
    },
  ],
  "nhan-dinh-chuyen-gia": [
    {
      image: "https://images.unsplash.com/photo-1642543348745-268b5b8662ff?q=80&w=500&auto=format",
      title: "Chuyên gia nhận định: Thị trường có thể đạt 1,600 điểm vào cuối năm 2024",
      summary: "Các chuyên gia từ SSI, VNDirect và HSC đều dự báo VN-Index có thể chạm mốc 1,600 điểm vào cuối năm nếu tăng trưởng kinh tế đạt kỳ vọng.",
      date: "05/05/2024",
      readTime: "6 phút",
      slug: "chuyen-gia-nhan-dinh-thi-truong-co-the-dat-1600-diem"
    },
  ],
  "tai-chinh-quoc-te": [
    {
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=500&auto=format",
      title: "Fed giữ nguyên lãi suất, thị trường chứng khoán toàn cầu phản ứng tích cực",
      summary: "Quyết định của Fed giữ nguyên lãi suất và khả năng sẽ cắt giảm trong các quý tới đã thúc đẩy các thị trường mới nổi, bao gồm Việt Nam.",
      date: "07/05/2024",
      readTime: "7 phút",
      slug: "fed-giu-nguyen-lai-suat"
    },
  ],
  "doanh-nghiep": [
    {
      image: "https://images.unsplash.com/photo-1621264448270-0d39584a5fb2?q=80&w=500&auto=format",
      title: "Vingroup công bố kế hoạch mở rộng thị trường ô tô điện sang châu Âu",
      summary: "VinFast dự kiến sẽ mở rộng hoạt động sang thị trường châu Âu vào năm 2025, cổ phiếu VIC tăng 4.5% sau thông tin này.",
      date: "06/05/2024",
      readTime: "5 phút",
      slug: "vingroup-cong-bo-ke-hoach-mo-rong-thi-truong-o-to-dien"
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const category = categories.find(c => c.slug === unwrappedParams.category);
  
  if (!category) {
    return {
      title: "Danh mục không tồn tại - VSMI",
      description: "Danh mục bài viết này không tồn tại trên VSMI",
    };
  }
  
  return {
    title: `${category.name} - VSMI`,
    description: `Tin tức và phân tích về ${category.name.toLowerCase()} trên thị trường chứng khoán Việt Nam`,
  };
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const { category: categorySlug } = unwrappedParams;
  
  const category = categories.find(c => c.slug === categorySlug);
  
  if (!category) {
    notFound();
  }
  
  const articles = articlesByCategory[categorySlug as keyof typeof articlesByCategory] || [];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium">{category.name}</span>
      </div>
      
      <header className="space-y-2 border-b pb-6">
        <div className="flex items-center gap-2">
          <span className="h-6 w-1.5 bg-primary rounded-full"></span>
          <h1 className="text-3xl font-bold tracking-tight">{category.name}</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Thông tin và phân tích mới nhất về {category.name.toLowerCase()} trên thị trường chứng khoán Việt Nam
        </p>
      </header>

      {articles.length > 0 ? (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <div 
              key={index} 
              className="rounded-lg overflow-hidden border bg-card hover:shadow-md transition-all relative group"
            >
              <div className="relative h-48">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <span className="inline-flex items-center text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full mb-2">
                  <Tag className="h-3 w-3 mr-1" />
                  {category.name}
                </span>
                <h3 className="font-bold mb-2 line-clamp-2 text-lg group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{article.summary}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs text-muted-foreground gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {article.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/${categorySlug}/${article.slug}`}
                    className="text-primary text-xs font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Đọc tiếp
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <Link
                href={`/${categorySlug}/${article.slug}`}
                className="absolute inset-0"
                aria-label={article.title}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg border">
          <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Chưa có bài viết nào</h2>
          <p className="text-muted-foreground">
            Hiện chưa có bài viết nào trong danh mục này. Vui lòng quay lại sau.
          </p>
        </div>
      )}
      
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Danh mục khác</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories
            .filter(c => c.slug !== categorySlug)
            .map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="p-3 text-center border rounded-lg bg-card hover:bg-secondary/50 transition-colors"
              >
                <span className="text-sm font-medium">{c.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
} 