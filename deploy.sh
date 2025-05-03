#!/bin/bash

# Đường dẫn thư mục triển khai trên VPS
DEPLOY_PATH="/var/www/vsmi.vn/public_html"
# Địa chỉ IP hoặc tên máy chủ VPS
SERVER="your-server-ip-or-hostname"
# Người dùng SSH
SSH_USER="your-ssh-username"

# Màu sắc cho output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Bắt đầu triển khai VSMI lên VPS...${NC}"

# Build ứng dụng
echo -e "${GREEN}Building Next.js application...${NC}"
npm run build

# Nén thư mục .next và các tệp cần thiết
echo -e "${GREEN}Compressing files...${NC}"
tar -czf vsmi-deploy.tar.gz .next package.json next.config.js ecosystem.config.js public node_modules

# Chuyển tệp nén lên VPS
echo -e "${GREEN}Uploading files to server...${NC}"
scp vsmi-deploy.tar.gz ${SSH_USER}@${SERVER}:/tmp/

# Kết nối SSH đến VPS và triển khai
echo -e "${GREEN}Deploying application on server...${NC}"
ssh ${SSH_USER}@${SERVER} << EOF
    # Tạo thư mục triển khai nếu chưa có
    mkdir -p ${DEPLOY_PATH}
    
    # Di chuyển vào thư mục triển khai
    cd ${DEPLOY_PATH}
    
    # Giải nén tệp
    tar -xzf /tmp/vsmi-deploy.tar.gz -C .
    
    # Khởi động hoặc khởi động lại ứng dụng với PM2
    pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js
    
    # Xóa tệp nén tạm thời
    rm /tmp/vsmi-deploy.tar.gz
    
    echo "Deployment completed!"
EOF

# Xóa tệp nén cục bộ
rm vsmi-deploy.tar.gz

echo -e "${GREEN}Triển khai hoàn tất! Ứng dụng đang chạy tại https://vsmi.vn${NC}" 