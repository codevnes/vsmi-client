import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Danh mục tin tức - VSMI",
  description: "Xem các bài viết theo danh mục chứng khoán, tài chính và đầu tư",
};

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 