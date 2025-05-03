import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết bài viết - VSMI",
  description: "Đọc bài viết đầy đủ về chứng khoán, tài chính và đầu tư",
};

export default function PostDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 