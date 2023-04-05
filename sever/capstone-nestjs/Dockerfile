# Sử dụng image cơ bản node
FROM node:latest

# Tạo thư mục làm việc
WORKDIR /app

# Sao chép các tệp và thư mục cần thiết vào image
COPY package*.json ./
COPY prisma/ ./prisma/
COPY . .

# Cài đặt các dependency
RUN yarn install

# Mở cổng
EXPOSE 3001

# Khởi động server
CMD [ "yarn", "start" ]
