# Thay đổi so với source cũ

Source cũ được giữ riêng tại thư mục `bb-kowloon-site`. Source triển khai mới nằm tại `bb-kowloon-site-production`; nội dung và giao diện website không bị thay đổi.

## Các thay đổi trong source mới

| Tệp | Thay đổi | Mục đích |
| --- | --- | --- |
| `Dockerfile` | Thêm multi-stage build, Next.js standalone, health check và user không có quyền root | Tạo image nhỏ và an toàn cho VPS/Docker |
| `compose.yaml` | Thêm cấu hình chạy một máy | Hostinger hoặc Ubuntu VPS thông thường |
| `docker-stack.yml` | Thêm replicas, rolling update, rollback, resource limits và overlay network | Ubuntu Docker Swarm |
| `.env.example` | Mẫu biến cho Docker Compose | Cấu hình domain, cổng và tên image |
| `.env.swarm.example` | Mẫu biến cho Swarm | Cấu hình stack và image GHCR |
| `scripts/deploy-docker.sh` | Pull code, build và cập nhật Compose | Cập nhật VPS một máy |
| `scripts/deploy-swarm.sh` | Pull image và cập nhật stack | Cập nhật Docker Swarm |
| `.github/workflows/docker-build.yml` | Build thử image trên push/PR | Phát hiện lỗi Docker sớm |
| `.github/workflows/publish-image.yml` | Build và push image lên GHCR | Cung cấp image cho các Swarm node |
| `next.config.ts` | Bật `output: standalone` | Chạy Next.js trong container production |
| `package.json` | Tách build Node (Webpack) và build/deploy Cloudflare | Không trộn output Docker với Worker và dùng builder ổn định trong CI |
| `lib/site-url.ts` và metadata routes | Đọc `SITE_URL`, có fallback an toàn | Đúng domain trong metadata, robots và sitemap |
| `.dockerignore` | Loại dependency, cache, output và secret khỏi build context | Build nhanh hơn, tránh đưa file thừa vào image |
| `.gitattributes` | Ép shell script dùng LF | Chạy đúng sau khi clone lên Ubuntu |

## Sửa lỗi Cloudflare trong ảnh build

Source cũ chứa `pnpm-workspace.yaml` không có trường `packages`, khiến Cloudflare dừng ở bước `pnpm install --frozen-lockfile` với lỗi `packages field missing or empty`.

Source mới chuẩn hóa về npm:

- Giữ `package-lock.json` làm lockfile duy nhất.
- Loại `pnpm-lock.yaml` và `pnpm-workspace.yaml` khỏi source mới.
- Cloudflare sẽ nhận diện npm thay vì tự chạy pnpm.
- Build Worker bằng `npm run build:cloudflare`.
- Deploy Worker bằng `npm run deploy:cloudflare`.

## Những phần được giữ nguyên

- Toàn bộ nội dung trang, component, CSS và hình ảnh.
- Các route `/`, `/about`, `/services`, `/projects`, `/contact`.
- Dữ liệu công ty, dịch vụ và dự án.
- Khả năng build Cloudflare Worker bằng Vinext/Vite.
