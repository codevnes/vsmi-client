"use client";

import Link from "next/link";
import { MoonStar, Mail, Phone, MapPin, Globe, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-12 md:py-16">
        {/* Newsletter section */}
        <div className="mb-12 pb-12 border-b">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <h3 className="text-xl font-medium mb-3 text-foreground">Đăng ký nhận tin</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Nhận phân tích thị trường và thông tin đầu tư mới nhất vào hộp thư của bạn.
              </p>
            </div>
            <div className="lg:col-span-3">
              <form className="flex flex-col sm:flex-row gap-3">
                <div className="relative sm:flex-1">
                  <Input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="rounded-full h-12 pl-4 pr-12 bg-muted/50 border-muted-foreground/20 focus:border-primary focus:ring-primary" 
                  />
                  <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white transition-transform hover:scale-105">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
              <p className="text-xs text-muted-foreground mt-3">
                Bằng cách đăng ký, bạn đồng ý với các <Link href="/chinh-sach-bao-mat" className="underline hover:text-primary transition-colors">chính sách bảo mật</Link> của chúng tôi.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <MoonStar className="h-7 w-7 text-primary" strokeWidth={1.5} />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                VSMI
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Phân tích Thị trường Chứng khoán Việt Nam - Cung cấp phân tích thị trường và thông tin tài chính hiện đại.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <SocialLink href="#" icon={<Facebook className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Twitter className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Instagram className="h-4 w-4" />} />
              <SocialLink href="#" icon={<Linkedin className="h-4 w-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-base mb-5 text-foreground">Truy cập nhanh</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/thi-truong">Tổng quan thị trường</FooterLink>
              <FooterLink href="/chi-bao">Chỉ báo kỹ thuật</FooterLink>
              <FooterLink href="/tin-tuc">Tin mới nhất</FooterLink>
              <FooterLink href="/dich-vu">Dịch vụ cao cấp</FooterLink>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-medium text-base mb-5 text-foreground">Tài nguyên</h3>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/hoc-tap">Trung tâm học tập</FooterLink>
              <FooterLink href="/hoi-dap">Câu hỏi thường gặp</FooterLink>
              <FooterLink href="/ho-tro">Hỗ trợ</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-medium text-base mb-5 text-foreground">Liên hệ</h3>
            <address className="text-sm text-muted-foreground not-italic space-y-3.5">
              <ContactItem icon={<MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />}>
                Quận 10, TP HCM
              </ContactItem>
              <ContactItem icon={<Mail className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />}>
                <a href="mailto:info@vsmi.vn" className="hover:text-primary transition-colors">
                  info@vsmi.vn
                </a>
              </ContactItem>
              <ContactItem icon={<Phone className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />}>
                <a href="tel:+84813908901" className="hover:text-primary transition-colors">
                  0813908901
                </a>
              </ContactItem>
              <ContactItem icon={<Globe className="h-4 w-4 text-primary shrink-0" strokeWidth={1.5} />}>
                <a 
                  href="https://vsmi.vn" 
                  className="hover:text-primary transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  vsmi.vn
                </a>
              </ContactItem>
            </address>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} VSMI. Đã đăng ký bản quyền.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link 
              href="/chinh-sach-bao-mat" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Chính sách bảo mật
            </Link>
            <Link 
              href="/dieu-khoan-su-dung" 
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link 
        href={href} 
        className="text-muted-foreground hover:text-primary hover:translate-x-1 transition-all duration-200 flex items-center gap-2 group"
      >
        <span className="w-1.5 h-1.5 bg-primary/70 rounded-full group-hover:scale-125 transition-transform"></span>
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a 
      href={href} 
      className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all"
      target="_blank" 
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}

function ContactItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 group">
      <div className="group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <p className="group-hover:translate-x-0.5 transition-transform">{children}</p>
    </div>
  );
} 