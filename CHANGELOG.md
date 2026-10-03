# Changelog

Các thay đổi đáng chú ý của BB Kowloon Corporate Website được ghi nhận tại đây.

## v1.0.0 — 2026-10-01

### Thêm mới

- Đăng nhập CMS bằng session cookie được ký và phân quyền theo Group Admin/User.
- Quản lý tài khoản: tạo tài khoản, phân quyền, xóa tài khoản và đổi mật khẩu.
- Quản lý nội dung Cargo & Projects theo bốn loại News, Product, Activity và Event.
- Bộ lọc nội dung dạng nút tại trang Cargo & Projects.
- Ngày đăng bài có thể chỉnh sửa trong CMS và hiển thị trên trang chi tiết.
- Trình soạn thảo nội dung dạng block với Heading, Paragraph, Quote, List, YouTube và Slideshow.
- Công cụ định dạng WYSIWYG cho Paragraph: in đậm, in nghiêng, gạch dưới, gạch ngang và gắn liên kết.
- Upload nhiều ảnh, xóa từng ảnh, alternative text và caption cho gallery.
- Gallery cân đối theo lưới và lightbox slideshow khi người xem bấm vào ảnh.
- Upload, xem trước và xóa Featured Image.

### Thay đổi

- Thiết kế lại trang chi tiết bài viết theo bố cục editorial: phần giới thiệu và ảnh đại diện phía trên, nội dung/Operation Details/media phía dưới.
- Chỉ hiển thị Route trên website đối với nội dung Type Product.
- Khối Image độc lập trong CMS được hợp nhất vào Slideshow; dữ liệu Image cũ tự chuyển sang Slideshow khi chỉnh sửa.
- Thêm nút Cancel để rời trình chỉnh sửa mà không lưu thay đổi.
- Docker Compose và Docker Swarm gắn volume `cms_data` để duy trì dữ liệu CMS và ảnh upload.
- Docker Swarm mặc định một replica do kho JSON chỉ hỗ trợ một tiến trình ghi.

### Sửa lỗi

- Giữ đúng xuống dòng và định dạng rich text của Paragraph ngoài trang sản phẩm.
- Hiển thị Operation Details đã nhập trong CMS trên trang chi tiết.
- Cân chỉnh gallery khi có một ảnh hoặc nhiều ảnh.
- Hiển thị alternative text của Featured Image làm chú thích ảnh đại diện.
- Hỗ trợ bài viết không có Featured Image và tự dàn lại phần tiêu đề.

### Bảo mật

- Không hiển thị tài khoản/mật khẩu mẫu trên trang đăng nhập hoặc README.
- Mật khẩu được băm bằng `scrypt` với salt riêng trước khi lưu trong kho dữ liệu.
- Group User chỉ có quyền xem; các thao tác ghi yêu cầu Group Admin.
