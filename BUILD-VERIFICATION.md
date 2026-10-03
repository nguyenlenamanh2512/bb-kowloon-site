# Kết quả kiểm tra source triển khai v1.0.0

Ngày kiểm tra gần nhất: 2026-10-01.

## Đã đạt trong lần kiểm tra v1.0.0

- `package.json` và package gốc trong `package-lock.json` cùng sử dụng version `1.0.0`.
- ESLint hoàn tất với 0 lỗi; còn 22 cảnh báo `no-img-element` không chặn build.
- Next.js 16.3.4 production build bằng Webpack thành công.
- TypeScript kiểm tra thành công.
- Các route public, login, CMS, media và trang chi tiết Cargo & Projects được build thành công.
- Bộ lọc All/News/Product/Activity/Event hiển thị dạng nút; nút đang chọn có nền coral.
- Trình chỉnh sửa hiển thị Publication date, Cancel và Save changes.
- Trang Accounts hiển thị chức năng Change password với xác nhận mật khẩu.
- Ngày đăng được hiển thị trên trang chi tiết bài viết.
- Không thực hiện lưu bài hoặc đổi mật khẩu thật trong quá trình kiểm tra giao diện.

## Giới hạn môi trường kiểm tra

- Chưa chạy trực tiếp `docker build`, `docker compose config` hoặc `docker stack deploy` vì môi trường kiểm tra không có Docker Engine.
- Chưa chạy lại Cloudflare Worker build cho phiên bản v1.0.0.
- Kho JSON chỉ được xác nhận cho một tiến trình ghi; cấu hình nhiều replica cần database dùng chung trước khi triển khai.
