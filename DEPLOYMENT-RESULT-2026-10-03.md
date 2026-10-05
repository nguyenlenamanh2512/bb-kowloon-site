# Kết quả triển khai V1 lên docker-mgr

Thời điểm triển khai: 2026-10-03 (Asia/Saigon)

## Phạm vi

- Source local: `C:\01. AI Agent\01. ChatGPT Work\08. Web\bb-kowloon-site-docker-ready\bb-kowloon-site`
- Không commit, push hoặc thay đổi repository GitHub.
- Source trên server: `/home/namanh/apps/bb-kowloon-v1`
- Image build trực tiếp trên server: `bb-kowloon-site:v1.0.0-local`
- Container: `bb-kowloon-v1-website-1`
- Cổng backend: `192.168.1.231:3000`

## Dữ liệu persistent

- Host path: `/srv/bb-kowloon-v1/storage`
- Container path: `/app/storage`
- Số file khi triển khai: 22
- Dung lượng khi triển khai: khoảng 48 MB
- Backup tự động đầu tiên: `/srv/bb-kowloon-v1/backups/storage-20261003T161700Z.tar.gz`

## Thay thế stack cũ

Stack `bb-kowloon` cũ chạy image GHCR `v0.6.0` với 10 replica và không có
volume persistent. Cấu hình và trạng thái trước chuyển đổi được lưu tại:

`/home/namanh/backups/bb-kowloon-before-v1-20261003-230259`

Stack cũ đã được gỡ sau khi image V1 mới vượt qua preflight ở cổng 3100.
Website hiện chạy bằng một Docker Compose container duy nhất trên docker-mgr.

## HAProxy và VIP

- VIP: `192.168.1.230`
- HAProxy-1: `192.168.1.234`, Keepalived priority 150, trạng thái chính
- HAProxy-2: `192.168.1.235`, Keepalived priority 100, trạng thái dự phòng
- Backend website duy nhất: `192.168.1.231:3000`
- Backend Grafana được giữ nguyên: `192.168.1.237:3000`
- Cả hai HAProxy có cùng cấu hình HTTP, HTTPS, certificate và route Grafana.
- Backup HAProxy-1: `/etc/haproxy/haproxy.cfg.bak-20261003-233605`
- Backup HAProxy-2: `/etc/haproxy/haproxy.cfg.bak-20261003-233843`

## Kết quả kiểm thử

- Build image production trên docker-mgr: đạt.
- Container health check: healthy.
- Trang chủ trực tiếp qua backend: HTTP 200.
- Trang chủ qua VIP HTTP/HTTPS: HTTP 200.
- Trang đăng nhập qua VIP HTTPS: HTTP 200.
- Đăng nhập CMS bằng tài khoản V1: đạt; hiển thị 10 nội dung.
- Restart container và đối chiếu checksum CMS: đạt, dữ liệu giữ nguyên.
- Grafana qua VIP HTTPS `/api/health`: HTTP 200.
- Failover thật từ HAProxy-1 sang HAProxy-2: đạt.
- Website, login và Grafana trong lúc VIP ở HAProxy-2: HTTP 200.
- HAProxy-1 đã được bật lại và VIP đã trở về node chính.

## Lưu ý DNS

VIP hoạt động từ mạng LAN. Khi kiểm thử, hostname được ánh xạ trực tiếp về VIP.
Máy trạm hiện không nhận được bản ghi DNS cho `www.bb-kowloon.com`; muốn dùng
HTTPS bằng tên miền bình thường cần tạo bản ghi DNS nội bộ hoặc hosts mapping
`www.bb-kowloon.com -> 192.168.1.230`.

