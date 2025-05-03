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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; connect-src 'self' https://api.vsmi.vn https://*.vsmi.vn http://localhost:3001; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 