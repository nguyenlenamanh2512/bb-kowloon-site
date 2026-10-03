# Lịch sử thay đổi triển khai v0.4.0

Đây là tài liệu lịch sử của bản v0.4.0. Phiên bản hiện tại là v1.0.0; xem `README.md` và `CHANGELOG.md` để biết các thay đổi mới.

Source chính thức được quản lý trực tiếp trong repository GitHub `nguyenlenamanh2512/bb-kowloon-site`. Phiên bản v0.4.0 kết hợp các cập nhật nội dung ship agency, dữ liệu PPAP và cấu hình triển khai production trong cùng một source; không sử dụng thư mục source production riêng.

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

## Khả năng tương thích được giữ nguyên

- Các route `/`, `/about`, `/services`, `/projects`, `/contact`.
- Cấu trúc Next.js App Router và dữ liệu TypeScript hiện có.
- Khả năng build Cloudflare Worker bằng Vinext/Vite.

## Sửa lỗi menu điều hướng trên Cloudflare

Vinext `1.0.0-beta.5` phát sinh lỗi JavaScript trong thành phần `next/link` sau khi triển khai Worker (`RSC prefetch setup error` và `TypeError` trong chunk `link`). Kết quả là URL trực tiếp vẫn mở được nhưng bấm menu trên trang không điều hướng.

Source v0.4.0 sử dụng thẻ HTML `<a href>` cho các liên kết nội bộ bị ảnh hưởng trong:

- `components/site-header.tsx`
- `components/site-footer.tsx`
- `app/page.tsx`
- `app/about/page.tsx`
- `app/services/page.tsx`

Đây là phương án tương thích với cả Cloudflare Worker và Next.js chạy trong Docker. Nội dung, giao diện và các URL không thay đổi; liên kết sẽ tải trang đầy đủ thay vì dùng bộ định tuyến phía trình duyệt của Vinext.
