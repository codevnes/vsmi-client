import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tin tức - VSMI",
  description: "Cập nhật tin tức mới nhất về thị trường chứng khoán Việt Nam",
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 