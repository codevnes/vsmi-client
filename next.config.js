/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Vô hiệu hóa ESLint trong quá trình build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Bỏ qua lỗi kiểm tra TypeScript trong quá trình build
    ignoreBuildErrors: true,
  },
  // Cấu hình thêm cho dự án của bạn...
}

module.exports = nextConfig 