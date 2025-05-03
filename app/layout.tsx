import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["vietnamese", "latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["vietnamese", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VSMI - Phân tích Thị trường Chứng khoán Việt Nam",
  description: "Nền tảng phân tích chứng khoán hiện đại tại Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased min-h-screen bg-background text-foreground flex flex-col`}
      >
        <div className="flex flex-col flex-1">
          <Header />
          <main className="flex-1 container py-6">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
