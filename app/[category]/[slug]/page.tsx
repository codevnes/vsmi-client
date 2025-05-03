import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { Calendar, Clock, ChevronRight, Tag, Share2, Bookmark, TrendingUp, Eye } from "lucide-react";

// Demo data for categories and articles
const categories = [
  { slug: "thi-truong-chung", name: "Thị trường chung" },
  { slug: "co-phieu", name: "Cổ phiếu" },
  { slug: "phan-tich-ky-thuat", name: "Phân tích kỹ thuật" },
  { slug: "nhan-dinh-chuyen-gia", name: "Nhận định chuyên gia" },
  { slug: "tai-chinh-quoc-te", name: "Tài chính quốc tế" },
  { slug: "doanh-nghiep", name: "Doanh nghiệp" },
];

// Sample post content by slug
const posts = {
  "thi-truong-chung-khoan-viet-nam-dat-dinh-moi": {
    title: "Thị trường chứng khoán Việt Nam đạt đỉnh mới với sự hậu thuẫn từ dòng vốn ngoại",
    summary: "VN-Index vượt mốc 1,500 điểm lần đầu tiên trong năm 2024, nhà đầu tư nước ngoài mua ròng hơn 5,000 tỷ đồng trong tuần qua.",
    category: "thi-truong-chung",
    date: "12/05/2024",
    readTime: "8 phút",
    author: "Nguyễn Văn Phú",
    authorAvatar: "https://i.pravatar.cc/100?img=1",
    authorPosition: "Chuyên gia Phân tích Thị trường",
    mainImage: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1600&auto=format",
    content: `
      <p class="lead">Trong phiên giao dịch ngày 12/05/2024, thị trường chứng khoán Việt Nam đã đạt mốc 1,500 điểm, đánh dấu một cột mốc quan trọng trong năm 2024. Sự gia tăng này được thúc đẩy mạnh mẽ bởi dòng vốn đầu tư nước ngoài, với giá trị mua ròng đạt hơn 5,000 tỷ đồng trong tuần qua.</p>
      
      <h2>Động lực tăng trưởng từ khối ngoại</h2>
      
      <p>Theo số liệu từ Sở Giao dịch Chứng khoán TP. Hồ Chí Minh (HOSE), khối ngoại đã mua ròng liên tục trong 15 phiên gần đây với tổng giá trị hơn 8,500 tỷ đồng, tập trung chủ yếu vào các cổ phiếu vốn hóa lớn trong lĩnh vực ngân hàng, bất động sản và công nghệ.</p>
      
      <p>Ông Trần Văn Minh, Giám đốc Phân tích của Công ty Chứng khoán ABC, nhận định: "Dòng vốn ngoại quay trở lại thị trường Việt Nam phần lớn đến từ các quỹ ETF và các định chế tài chính lớn của khu vực. Các nhà đầu tư đang tìm kiếm cơ hội đầu tư ở các thị trường mới nổi có triển vọng tăng trưởng tốt, và Việt Nam là một trong những điểm đến hấp dẫn."</p>
      
      <h2>Nhóm cổ phiếu dẫn dắt thị trường</h2>
      
      <p>Đà tăng của VN-Index được dẫn dắt bởi các cổ phiếu ngân hàng như VCB (+3.2%), BID (+4.1%), CTG (+2.8%) và TCB (+3.7%). Ngoài ra, nhóm cổ phiếu bất động sản cũng ghi nhận sự tăng trưởng ấn tượng với VIC (+5.3%), VHM (+4.2%) và NVL (+6.8%).</p>
      
      <p>Đáng chú ý, các cổ phiếu công nghệ như FPT (+2.9%) và VNG (+3.5%) cũng có sự đóng góp đáng kể vào đà tăng của thị trường. Sự tăng trưởng của nhóm này được hỗ trợ bởi kết quả kinh doanh quý 1 tích cực và triển vọng phát triển mạnh mẽ trong lĩnh vực AI và chuyển đổi số.</p>
      
      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=1000&auto=format" alt="Biểu đồ VN-Index" />
        <p class="caption">Biểu đồ VN-Index phiên giao dịch ngày 12/05/2024</p>
      </div>
      
      <h2>Triển vọng thị trường</h2>
      
      <p>Các chuyên gia trong ngành đánh giá triển vọng thị trường vẫn tích cực trong trung và dài hạn. Theo ông Nguyễn Văn An, Trưởng phòng Phân tích của Công ty Chứng khoán XYZ: "VN-Index có thể hướng đến mốc 1,600 điểm vào cuối năm 2024 nếu các yếu tố vĩ mô tiếp tục ổn định, đặc biệt là khi lãi suất toàn cầu có xu hướng giảm và dòng vốn ngoại tiếp tục chảy vào thị trường."</p>
      
      <p>Tuy nhiên, các chuyên gia cũng lưu ý rằng thị trường có thể đối mặt với một số rủi ro, bao gồm diễn biến phức tạp của tình hình địa chính trị toàn cầu và khả năng Fed chậm cắt giảm lãi suất so với dự kiến.</p>
      
      <blockquote>
        "Thị trường đang ở mức định giá hấp dẫn so với các thị trường trong khu vực với P/E ở mức 15.2 lần. Các yếu tố vĩ mô của Việt Nam vẫn khá tích cực với dự báo tăng trưởng GDP đạt 6.5% trong năm 2024, lạm phát được kiểm soát dưới 4%."
        <cite>- Bà Trần Thị Mai, Chuyên gia kinh tế trưởng tại Ngân hàng DEF</cite>
      </blockquote>
      
      <h2>Thanh khoản thị trường cải thiện</h2>
      
      <p>Cùng với sự gia tăng của chỉ số, thanh khoản thị trường cũng được cải thiện đáng kể. Giá trị giao dịch bình quân trên ba sàn trong tuần qua đạt hơn 25,000 tỷ đồng, tăng 30% so với bình quân tháng trước.</p>
      
      <p>Sự gia tăng thanh khoản phản ánh niềm tin của nhà đầu tư vào triển vọng của thị trường, đặc biệt là khi các thông tin vĩ mô tích cực và kết quả kinh doanh quý 1/2024 của các doanh nghiệp niêm yết phần lớn vượt kỳ vọng.</p>
      
      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1542744173-8659b8e77b29?q=80&w=1000&auto=format" alt="Sàn giao dịch chứng khoán" />
        <p class="caption">Hoạt động giao dịch trên thị trường chứng khoán Việt Nam ngày càng sôi động</p>
      </div>
      
      <h2>Kết luận</h2>
      
      <p>Việc VN-Index vượt mốc 1,500 điểm đánh dấu một cột mốc quan trọng của thị trường chứng khoán Việt Nam trong năm 2024. Dòng vốn ngoại gia tăng, thanh khoản cải thiện và triển vọng vĩ mô tích cực là những yếu tố hỗ trợ đà tăng của thị trường.</p>
      
      <p>Tuy nhiên, nhà đầu tư vẫn cần thận trọng và theo dõi sát sao diễn biến thị trường, đặc biệt là các yếu tố từ bên ngoài có thể tác động đến dòng vốn và tâm lý thị trường.</p>
    `,
    views: 1245,
    relatedArticles: [
      {
        title: "Nhóm vốn hóa lớn dẫn dắt thị trường, thanh khoản tăng mạnh",
        slug: "nhom-von-hoa-lon-dan-dat-thi-truong",
        category: "thi-truong-chung",
        date: "11/05/2024",
        image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=500&auto=format",
      },
      {
        title: "Khối ngoại mua ròng phiên thứ 10 liên tiếp, VN-Index vượt mốc 1,500",
        slug: "khoi-ngoai-mua-rong-phien-thu-10-lien-tiep",
        category: "thi-truong-chung",
        date: "10/05/2024",
        image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=500&auto=format",
      },
      {
        title: "Cổ phiếu ngân hàng hút dòng tiền mạnh, VCB lập đỉnh lịch sử",
        slug: "co-phieu-ngan-hang-hut-dong-tien-manh",
        category: "co-phieu",
        date: "07/05/2024",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format",
      },
    ]
  },
  "nhnn-dieu-chinh-lai-suat-dieu-hanh": {
    title: "NHNN điều chỉnh lãi suất điều hành, ảnh hưởng đến nhóm cổ phiếu ngân hàng",
    summary: "Lãi suất điều hành giảm 0.5% sẽ tạo động lực cho thị trường vốn và tác động tích cực đến nhóm cổ phiếu ngân hàng trong ngắn hạn.",
    category: "co-phieu",
    date: "10/05/2024",
    readTime: "5 phút",
    author: "Trần Thị Minh",
    authorAvatar: "https://i.pravatar.cc/100?img=5",
    authorPosition: "Chuyên gia Phân tích Tài chính",
    mainImage: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=1600&auto=format",
    content: `
      <p class="lead">Ngân hàng Nhà nước Việt Nam (NHNN) vừa quyết định điều chỉnh giảm lãi suất điều hành 0.5%, một động thái được kỳ vọng sẽ tạo động lực cho thị trường vốn và có tác động tích cực đến nhóm cổ phiếu ngân hàng trong ngắn hạn.</p>
      
      <h2>Chi tiết về quyết định điều chỉnh lãi suất</h2>
      
      <p>Theo thông báo từ NHNN, lãi suất tái cấp vốn giảm từ 4.5% xuống 4.0% một năm, lãi suất tái chiết khấu giảm từ 3.0% xuống 2.5% một năm. Đồng thời, lãi suất cho vay qua đêm trong thanh toán điện tử liên ngân hàng giảm từ 5.5% xuống 5.0% một năm.</p>
      
      <p>Quyết định này được đưa ra trong bối cảnh nền kinh tế cần được kích thích để đạt mục tiêu tăng trưởng GDP 6.5% trong năm 2024, trong khi lạm phát vẫn được kiểm soát ở mức thấp dưới 4%.</p>
      
      <h2>Tác động đến nhóm cổ phiếu ngân hàng</h2>
      
      <p>Sau thông tin này, nhóm cổ phiếu ngân hàng đã có phản ứng tích cực với hầu hết các mã đều tăng điểm. Cụ thể, VCB tăng 2.1%, BID tăng 2.8%, CTG tăng 3.2%, TCB tăng 2.5% và ACB tăng 1.9%.</p>
      
      <p>Ông Lê Văn Hải, Trưởng phòng Phân tích Công ty Chứng khoán ABC nhận định: "Việc giảm lãi suất điều hành sẽ giúp các ngân hàng tiếp cận nguồn vốn rẻ hơn từ NHNN, từ đó có thể giảm lãi suất cho vay để kích thích tăng trưởng tín dụng. Đồng thời, chênh lệch lãi suất (NIM) có thể được cải thiện do lãi suất huy động dự kiến sẽ giảm theo."</p>
      
      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1000&auto=format" alt="Trụ sở NHNN" />
        <p class="caption">Trụ sở Ngân hàng Nhà nước Việt Nam</p>
      </div>
      
      <h2>Triển vọng tăng trưởng tín dụng</h2>
      
      <p>Với quyết định giảm lãi suất điều hành, các chuyên gia dự báo tăng trưởng tín dụng có thể đạt 14-15% trong năm 2024, cao hơn so với mức 13.5% của năm 2023.</p>
      
      <p>Việc tăng trưởng tín dụng được cải thiện sẽ hỗ trợ tích cực cho lợi nhuận của các ngân hàng, đặc biệt là các ngân hàng có tỷ lệ CASA cao và chi phí vốn thấp như VCB, TCB và ACB.</p>
      
      <blockquote>
        "Nhóm cổ phiếu ngân hàng có thể duy trì đà tăng tích cực trong những tháng tới nhờ triển vọng cải thiện biên lãi ròng và tăng trưởng tín dụng. Tuy nhiên, các nhà đầu tư cũng cần lưu ý đến yếu tố chất lượng tài sản và trích lập dự phòng của từng ngân hàng cụ thể."
        <cite>- Bà Nguyễn Thị Hồng, Phó Giám đốc Khối Nghiên cứu, Công ty Chứng khoán DEF</cite>
      </blockquote>
      
      <h2>Triển vọng dài hạn cho cổ phiếu ngân hàng</h2>
      
      <p>Trong dài hạn, các chuyên gia đánh giá nhóm cổ phiếu ngân hàng vẫn có triển vọng tích cực nhờ nền tảng vĩ mô ổn định và tiềm năng tăng trưởng cao của ngành ngân hàng Việt Nam.</p>
      
      <p>Định giá của nhóm cổ phiếu ngân hàng Việt Nam hiện ở mức hấp dẫn so với khu vực, với P/B bình quân khoảng 1.5 lần, thấp hơn so với mức trung bình 1.8-2.0 lần của các ngân hàng trong khu vực.</p>
      
      <div class="image-container">
        <img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1000&auto=format" alt="Giao dịch ngân hàng" />
        <p class="caption">Hoạt động ngân hàng tại Việt Nam được dự báo sẽ tăng trưởng mạnh trong năm 2024</p>
      </div>
      
      <h2>Kết luận</h2>
      
      <p>Quyết định giảm lãi suất điều hành của NHNN đã tạo động lực tích cực cho thị trường chứng khoán nói chung và nhóm cổ phiếu ngân hàng nói riêng. Triển vọng cải thiện biên lãi ròng và tăng trưởng tín dụng là những yếu tố hỗ trợ cho đà tăng của nhóm cổ phiếu này.</p>
      
      <p>Tuy nhiên, các nhà đầu tư cần chọn lọc kỹ lưỡng các cổ phiếu có nền tảng cơ bản tốt, khả năng quản trị rủi ro hiệu quả và tiềm năng tăng trưởng bền vững trong dài hạn.</p>
    `,
    views: 982,
    relatedArticles: [
      {
        title: "Cổ phiếu ngân hàng hút dòng tiền mạnh, VCB lập đỉnh lịch sử",
        slug: "co-phieu-ngan-hang-hut-dong-tien-manh",
        category: "co-phieu",
        date: "07/05/2024",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format",
      },
      {
        title: "Thị trường chứng khoán Việt Nam đạt đỉnh mới với sự hậu thuẫn từ dòng vốn ngoại",
        slug: "thi-truong-chung-khoan-viet-nam-dat-dinh-moi",
        category: "thi-truong-chung",
        date: "12/05/2024",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format",
      },
      {
        title: "Nhóm vốn hóa lớn dẫn dắt thị trường, thanh khoản tăng mạnh",
        slug: "nhom-von-hoa-lon-dan-dat-thi-truong",
        category: "thi-truong-chung",
        date: "11/05/2024",
        image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?q=80&w=500&auto=format",
      },
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ category: string, slug: string }> }): Promise<Metadata> {
  const unwrappedParams = await params;
  const { slug } = unwrappedParams;
  const post = posts[slug as keyof typeof posts];
  
  if (!post) {
    return {
      title: "Bài viết không tồn tại - VSMI",
      description: "Bài viết này không tồn tại trên VSMI",
    };
  }
  
  return {
    title: `${post.title} - VSMI`,
    description: post.summary,
  };
}

export default function PostPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
  // Unwrap params using React.use()
  const unwrappedParams = React.use(params);
  const { category, slug } = unwrappedParams;
  
  const post = posts[slug as keyof typeof posts];
  
  if (!post) {
    notFound();
  }
  
  const categoryInfo = categories.find(c => c.slug === category);
  
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Trang chủ</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/tin-tuc" className="hover:text-primary transition-colors">Tin tức</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/${category}`} className="hover:text-primary transition-colors">
          {categoryInfo?.name || category}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {post.title}
        </span>
      </div>
      
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Link 
              href={`/${post.category}`}
              className="text-xs font-medium px-3 py-1 bg-primary/10 rounded-full inline-flex items-center gap-1 text-primary"
            >
              <Tag className="h-3.5 w-3.5" />
              {categoryInfo?.name}
            </Link>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {post.views} lượt xem
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-6">
            {post.summary}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={post.authorAvatar}
                alt={post.author}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <div className="font-medium">{post.author}</div>
                <div className="text-xs text-muted-foreground">{post.authorPosition}</div>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>
        </header>
        
        {/* Featured image */}
        <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.mainImage}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
        
        {/* Social sharing */}
        <div className="flex items-center justify-end gap-3 mb-8">
          <button className="text-sm flex items-center gap-1 hover:text-primary transition-colors">
            <Share2 className="h-4 w-4" />
            Chia sẻ
          </button>
          <button className="text-sm flex items-center gap-1 hover:text-primary transition-colors">
            <Bookmark className="h-4 w-4" />
            Lưu
          </button>
        </div>
        
        {/* Article content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        {/* Author bio */}
        <div className="border-t border-b py-8 my-10">
          <div className="flex gap-4 items-center">
            <Image
              src={post.authorAvatar}
              alt={post.author}
              width={80}
              height={80}
              className="rounded-full"
            />
            <div>
              <h3 className="text-xl font-bold mb-1">{post.author}</h3>
              <p className="text-sm text-muted-foreground mb-2">{post.authorPosition}</p>
              <p className="text-sm">
                Chuyên gia phân tích thị trường với hơn 10 năm kinh nghiệm trong lĩnh vực tài chính và đầu tư.
                Tốt nghiệp Thạc sĩ Tài chính tại Đại học Kinh tế TP. Hồ Chí Minh.
              </p>
            </div>
          </div>
        </div>
        
        {/* Related articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Bài viết liên quan
          </h2>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {post.relatedArticles.map((article, index) => (
              <div key={index} className="group">
                <div className="relative h-48 mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <Link
                  href={`/${article.category}`}
                  className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full inline-block mb-2"
                >
                  {categories.find(c => c.slug === article.category)?.name}
                </Link>
                <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  <Link href={`/${article.category}/${article.slug}`}>
                    {article.title}
                  </Link>
                </h3>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  {article.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
} 