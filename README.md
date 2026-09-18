# BB Kowloon corporate website

Website doanh nghiệp BB Kowloon, xây dựng bằng Next.js 16, React 19, TypeScript và Tailwind CSS 4. Repository hỗ trợ hai kiểu triển khai độc lập:

- Docker/Node.js trên Ubuntu VPS (Hostinger hoặc nhà cung cấp VPS khác).
- Cloudflare Workers bằng Vinext và Wrangler.

## Chạy local

Yêu cầu Node.js 22.13 trở lên.

```bash
npm ci
npm run dev
```

Mở `http://localhost:5173`.

Kiểm tra bản production không dùng Docker:

```bash
npm run build
npm run start
```

Mở `http://localhost:3000`.

## Chạy bằng Docker

Sao chép cấu hình mẫu rồi sửa tên miền/cổng nếu cần:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

Website mặc định chạy tại `http://IP_CUA_VPS:3000`. Xem log:

```bash
docker compose logs -f website
```

Cập nhật hoặc dừng dịch vụ:

```bash
docker compose up -d --build
docker compose down
```

Image sử dụng multi-stage build, chỉ giữ server Next.js standalone và chạy bằng user không có quyền root. `SITE_URL` được dùng cho canonical metadata, `robots.txt` và `sitemap.xml`.

## GitHub → Ubuntu VPS → Docker

### 1. Đẩy source code lên GitHub

```bash
git add .
git commit -m "Add production Docker deployment"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Nếu repository đã có remote `origin`, bỏ qua lệnh `git remote add origin`.

### 2. Cài Docker trên Ubuntu

Cài Docker Engine và Docker Compose plugin theo hướng dẫn chính thức của Docker. Sau khi cài xong, kiểm tra:

```bash
docker --version
docker compose version
```

### 3. Clone và chạy lần đầu

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY
cp .env.example .env
nano .env
docker compose up -d --build
```

Mở cổng được đặt bởi `APP_PORT` trong firewall của VPS nếu truy cập trực tiếp bằng IP. Khi dùng Nginx, Caddy hoặc Cloudflare Tunnel, có thể đặt `BIND_ADDRESS=127.0.0.1` để không công khai cổng ứng dụng ra Internet.

### 4. Cập nhật phiên bản mới

Chạy lệnh sau trong thư mục dự án:

```bash
sh scripts/deploy-docker.sh
```

Script sẽ kéo code bằng fast-forward, build lại image, thay container và hiển thị trạng thái dịch vụ. Git worktree trên VPS cần sạch trước khi chạy.

## Dùng Cloudflare với VPS

Để giữ ứng dụng trên VPS nhưng dùng DNS/CDN/SSL của Cloudflare:

1. Trỏ bản ghi DNS `A`/`AAAA` về IP VPS và bật proxy Cloudflare.
2. Dùng Nginx, Caddy hoặc Cloudflare Tunnel chuyển request vào `127.0.0.1:3000`.
3. Đặt `SITE_URL=https://ten-mien-cua-ban.com` và `BIND_ADDRESS=127.0.0.1` trong `.env`, rồi build lại container.

Không nên mở đồng thời cổng 3000 ra Internet nếu reverse proxy đã là điểm truy cập công khai.

## Deploy trực tiếp lên Cloudflare Workers

Nhánh triển khai Cloudflare hiện có được giữ riêng để không ảnh hưởng Docker:

```bash
npm ci
npx wrangler login
SITE_URL=https://ten-mien-cua-ban.com npm run build:cloudflare
npm run deploy:cloudflare
```

Trong CI, dùng `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID` thay cho `wrangler login`. Sau khi Worker được tạo, gắn custom domain trong Cloudflare Dashboard.

## Tự động kiểm tra trên GitHub

Workflow `.github/workflows/docker-build.yml` tự build Docker image khi push vào `main` hoặc tạo pull request. Workflow chỉ kiểm tra image, không tự triển khai và không cần lưu secret.

## Nội dung và cấu trúc

- `data/company.ts`: thông tin công ty và liên hệ.
- `data/services.ts`: sáu nhóm dịch vụ.
- `data/projects.ts`: các hoạt động vận chuyển đã được ghi nhận.
- `public/images/profile`: ảnh tối ưu từ company profile.
- `CONTENT-GAPS.md`: các thông tin còn thiếu trong tài liệu nguồn.

Các route chính: `/`, `/about`, `/services`, `/projects`, `/contact`.
