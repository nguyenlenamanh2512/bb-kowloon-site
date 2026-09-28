# Kết quả kiểm tra source triển khai v0.4.0

Ngày kiểm tra gần nhất: 2026-09-28.

## Đã đạt trong lần kiểm tra v0.4.0

- `package.json` và package gốc trong `package-lock.json` cùng sử dụng version `0.4.0`.
- ESLint hoàn tất với 0 lỗi; còn 13 cảnh báo `no-img-element` không chặn build.
- Next.js 16.3.4 production build bằng Webpack thành công.
- TypeScript kiểm tra thành công.
- Các trang `/`, `/about`, `/services`, `/projects`, `/contact`, `/robots.txt` và `/sitemap.xml` được prerender thành công.

## Kiểm tra triển khai đã thực hiện trước đó

- Next.js standalone server đã khởi động thành công trong lần kiểm tra ngày 2026-09-18.
- Các endpoint chính đã trả HTTP 200 trong lần kiểm tra ngày 2026-09-18.
- Vinext/Vite Cloudflare Worker build và Wrangler deploy dry-run đã thành công trong lần kiểm tra ngày 2026-09-18.

## Giới hạn môi trường kiểm tra

- Chưa chạy trực tiếp `docker build`, `docker compose config` hoặc `docker stack deploy` vì môi trường kiểm tra không có Docker Engine.
- Cloudflare Worker build chưa được chạy lại sau cập nhật nội dung v0.4.0.
- GitHub Actions sẽ kiểm tra Docker image trên Ubuntu sau khi thay đổi được commit và push. Workflow publish chỉ đẩy image khi build thành công.
