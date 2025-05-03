"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Giả lập gửi form
    setTimeout(() => {
      setSubmitting(false);
      setFormSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Liên hệ với chúng tôi</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Hãy liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi hoặc cần hỗ trợ. Nhóm chuyên gia của VSMI luôn sẵn sàng để giúp đỡ bạn.
        </p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Email</h3>
          <p className="text-muted-foreground mb-4 text-sm">Gửi email cho chúng tôi</p>
          <a 
            href="mailto:info@vsmi.vn" 
            className="text-primary hover:underline font-medium"
          >
            info@vsmi.vn
          </a>
        </div>

        <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Điện thoại</h3>
          <p className="text-muted-foreground mb-4 text-sm">Gọi trực tiếp cho chúng tôi</p>
          <a 
            href="tel:+84813908901" 
            className="text-primary hover:underline font-medium"
          >
            0813908901
          </a>
        </div>

        <div className="bg-card border rounded-xl p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Địa chỉ</h3>
          <p className="text-muted-foreground mb-4 text-sm">Ghé thăm văn phòng của chúng tôi</p>
          <p className="font-medium">Quận 10, TP HCM</p>
        </div>
      </div>

      {/* Contact Form and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-card border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
          
          {formSubmitted ? (
            <div className="flex flex-col items-center justify-center text-center py-10">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cảm ơn bạn!</h3>
              <p className="text-muted-foreground max-w-md">
                Chúng tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất.
              </p>
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => setFormSubmitted(false)}
              >
                Gửi tin nhắn khác
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Họ và tên
                  </label>
                  <Input
                    id="name"
                    placeholder="Nhập họ và tên của bạn"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Nhập địa chỉ email của bạn"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  placeholder="Nhập số điện thoại của bạn"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Tiêu đề
                </label>
                <Input
                  id="subject"
                  placeholder="Tiêu đề tin nhắn của bạn"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Nội dung
                </label>
                <Textarea
                  id="message"
                  placeholder="Nhập nội dung tin nhắn của bạn"
                  rows={5}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" /> Gửi tin nhắn
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Map */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold mb-6">Vị trí của chúng tôi</h2>
          <div className="bg-card border rounded-xl overflow-hidden shadow-sm h-[400px] flex-1">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15677.962272444975!2d106.65996448715818!3d10.768818700000008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f19546210e9%3A0x6216484fc27ca041!2zUXXhuq1uIDEwLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1721125642168!5m2!1svi!2s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
            ></iframe>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-20">
        <h2 className="text-2xl font-bold mb-8 text-center">Các câu hỏi thường gặp</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-xl p-6 transition-all hover:shadow-sm">
            <h3 className="font-semibold mb-2">Làm thế nào để đăng ký tài khoản tại VSMI?</h3>
            <p className="text-muted-foreground text-sm">
              Bạn có thể dễ dàng đăng ký tài khoản bằng cách nhấp vào nút &quot;Đăng ký&quot; ở góc trên bên phải của trang web và làm theo các hướng dẫn.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6 transition-all hover:shadow-sm">
            <h3 className="font-semibold mb-2">VSMI cung cấp những dịch vụ gì?</h3>
            <p className="text-muted-foreground text-sm">
              VSMI cung cấp nhiều dịch vụ phân tích thị trường chứng khoán, bao gồm dữ liệu thời gian thực, phân tích kỹ thuật, tin tức thị trường và công cụ quản lý danh mục đầu tư.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6 transition-all hover:shadow-sm">
            <h3 className="font-semibold mb-2">Làm sao để nâng cấp lên tài khoản cao cấp?</h3>
            <p className="text-muted-foreground text-sm">
              Bạn có thể nâng cấp lên tài khoản cao cấp bằng cách truy cập trang "Gói dịch vụ" và chọn gói phù hợp với nhu cầu của bạn. Chúng tôi cung cấp nhiều lựa chọn thanh toán khác nhau.
            </p>
          </div>
          <div className="bg-card border rounded-xl p-6 transition-all hover:shadow-sm">
            <h3 className="font-semibold mb-2">Làm thế nào để nhận hỗ trợ kỹ thuật?</h3>
            <p className="text-muted-foreground text-sm">
              Nếu bạn gặp vấn đề kỹ thuật, bạn có thể liên hệ với đội ngũ hỗ trợ của chúng tôi thông qua form liên hệ này, gửi email đến support@vsmi.vn, hoặc gọi đến số hotline hỗ trợ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 