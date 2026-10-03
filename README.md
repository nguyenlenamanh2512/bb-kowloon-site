# BB Kowloon corporate website

## Version 1.0.0: CMS, authentication and Cargo & Projects publishing

Version 1.0.0 adds authenticated content management for Cargo & Projects, Admin/User authorization, account and password management, publication dates, content-type filters, rich-text content, YouTube embeds, multi-image upload and a click-to-open lightbox gallery. See [`CHANGELOG.md`](CHANGELOG.md) for the complete list of additions, changes and fixes.

The QR code points to `https://www.bbKowloon.com/documents/ppap-2026-presentation.pdf`, matching the domain supplied in the BB Kowloon Word document. Deploy at that domain for scanning to work. If the final public domain changes, regenerate `public/documents/ppap-2026-download-qr.svg` with the new absolute PDF URL and update `SITE_URL`.

Website doanh nghiệp BB Kowloon, xây dựng bằng Next.js 16, React 19, TypeScript và Tailwind CSS 4. Repository hỗ trợ ba kiểu triển khai độc lập:

- Docker/Node.js trên Ubuntu VPS (Hostinger hoặc nhà cung cấp VPS khác).
- Docker Swarm trên một hoặc nhiều máy Ubuntu.
- Cloudflare Workers bằng Vinext và Wrangler.

Xem `DEPLOYMENT-CHANGES.md` để biết chính xác các thay đổi so với source cũ.

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
git init
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

## Ubuntu Docker Swarm

Swarm không build image khi chạy `docker stack deploy`. Image phải được build và đẩy lên registry trước; workflow `publish-image.yml` sẽ tự đẩy image lên GitHub Container Registry (GHCR) khi có commit mới trên nhánh `main`.

### 1. Bật Swarm

Trên manager node:

```bash
docker swarm init --advertise-addr IP_MANAGER
```

Nếu có worker node, chạy lệnh `docker swarm join` do manager trả về trên từng node.

### 2. Chuẩn bị image và cấu hình

Sau khi GitHub Actions publish thành công, đặt GitHub package ở chế độ public hoặc đăng nhập GHCR trên các node:

```bash
echo GITHUB_TOKEN | docker login ghcr.io -u GITHUB_USERNAME --password-stdin
```

Trên manager node:

```bash
git clone https://github.com/nguyenlenamanh2512/bb-kowloon-site.git
cd bb-kowloon-site
cp .env.swarm.example .env.swarm
nano .env.swarm
```

Kiểm tra `IMAGE_NAME` khớp chính xác với image hiển thị trong GitHub Packages.

### 3. Deploy hoặc cập nhật stack

```bash
sh scripts/deploy-swarm.sh
docker stack services bb-kowloon
docker service logs -f bb-kowloon_website
```

Stack mặc định chạy một replica, rolling update từng replica và tự rollback khi update thất bại. Kho JSON hiện tại chỉ hỗ trợ an toàn một tiến trình ghi; không tăng `REPLICAS` trước khi chuyển CMS sang database dùng chung có hỗ trợ nhiều tiến trình.

## Deploy trực tiếp lên Cloudflare Workers

Nhánh triển khai Cloudflare hiện có được giữ riêng để không ảnh hưởng Docker:

```bash
npm ci
npx wrangler login
SITE_URL=https://ten-mien-cua-ban.com npm run build:cloudflare
npm run deploy:cloudflare
```

Khi kết nối repository trong Cloudflare Workers Builds, dùng đúng cấu hình:

```text
Build command: npm run build:cloudflare
Deploy command: npm run deploy:cloudflare
Root directory: /
```

Không dùng `pnpm run build`. Source mới chỉ giữ `package-lock.json`, vì vậy Cloudflare phải hiển thị bước cài đặt bằng npm. Có thể đặt build variable `SITE_URL=https://ten-mien-cua-ban.com` trong Cloudflare.

Trong CI, dùng `CLOUDFLARE_API_TOKEN` và `CLOUDFLARE_ACCOUNT_ID` thay cho `wrangler login`. Sau khi Worker được tạo, gắn custom domain trong Cloudflare Dashboard.

## Tự động kiểm tra trên GitHub

- `.github/workflows/docker-build.yml`: kiểm tra Docker image khi push hoặc tạo pull request.
- `.github/workflows/publish-image.yml`: publish image lên GHCR khi push vào `main` hoặc tạo tag `v*`.

Workflow publish dùng `GITHUB_TOKEN` có sẵn của repository, không cần tạo secret riêng.

## Nội dung và cấu trúc

- `data/company.ts`: thông tin công ty và liên hệ.
- `data/services.ts`: sáu nhóm dịch vụ.
- `data/projects.ts`: các hoạt động vận chuyển đã được ghi nhận.
- `public/images/profile`: ảnh tối ưu từ company profile.
- `CONTENT-GAPS.md`: các thông tin còn thiếu trong tài liệu nguồn.

Các route chính: `/`, `/about`, `/services`, `/projects`, `/contact`.

## Đăng nhập và quản trị Cargo & Projects

Mở `/login` để vào khu vực quản trị. Admin có thể tạo bốn loại nội dung (News, Product, Activity, Event) bằng trình soạn thảo block gồm heading, paragraph, quote, list, YouTube và slideshow. Admin cũng có thể tạo tài khoản, phân quyền và đổi mật khẩu trong mục Accounts. Group User chỉ có quyền xem.

Dữ liệu được tạo tự động trong thư mục `storage` ở lần chạy đầu tiên. Không công khai thông tin đăng nhập trên giao diện; hãy đổi ngay mật khẩu khởi tạo trong mục Accounts và đặt `AUTH_SECRET` dài, ngẫu nhiên trong `.env` trước khi đưa lên production.

Ảnh đại diện và gallery có thể tải trực tiếp từ máy (JPG, PNG, WebP, GIF hoặc AVIF, tối đa 8 MB mỗi ảnh). Gallery hiển thị dạng lưới trong bài; người xem bấm thumbnail để mở slideshow toàn màn hình. File upload được lưu cùng volume `cms_data` và phục vụ qua route `/media/*`.

## Lưu trữ dữ liệu CMS

Phiên bản hiện tại chưa dùng MySQL, PostgreSQL hay SQLite. Tài khoản, mật khẩu đã băm và nội dung CMS được lưu trong tệp `storage/cms-data.json` khi chạy local. Thư mục này nằm trong `.gitignore` và không được đưa lên Git.

Trong Docker, biến `DATA_DIR=/app/storage` và named volume `cms_data` giữ tệp `/app/storage/cms-data.json` cùng các ảnh upload. Volume giúp dữ liệu tồn tại khi container được tạo lại. Có thể xem vị trí volume trên máy chủ bằng `docker volume inspect <ten-stack>_cms_data` hoặc `docker volume inspect <ten-project>_cms_data`.

Kho dữ liệu file hiện được thiết kế cho một tiến trình ghi. Docker Swarm mặc định dùng một replica; muốn chạy nhiều replica cần chuyển CMS sang database dùng chung như PostgreSQL.
