# Hệ Thống Quản Lý Khóa Học Trực Tuyến

## Giới Thiệu
Dự án Quản Lý Khóa Học Trực Tuyến là một nền tảng hỗ trợ giảng dạy và học tập trực tuyến, giúp người dùng dễ dàng tiếp cận các khóa học và quản lý tiến trình học tập.

### Thành Viên Nhóm
- **Lê Minh Khôi** - MSSV: 22520698
- **Ngô Tuấn Kiệt** - MSSV: 22520719
- **Phạm Đăng Khoa** - MSSV: 22520685

## Tính Năng Chính
- **Quản lý khóa học**: Tạo, chỉnh sửa, xóa khóa học.
- **Quản lý bài giảng**: Thêm tài liệu, video và nội dung học tập.
- **Phân quyền người dùng**: Quản trị viên, giảng viên và học viên.
- **Ghi nhận tiến độ học tập**: Theo dõi tình trạng hoàn thành khóa học.
- **Sao lưu và khôi phục dữ liệu một cách dễ dàng.**

## Công Nghệ Sử Dụng
- **Backend:** PostgreSQL & Supabase
- **ORM:** Drizzle ORM
- **Công cụ phát triển:** Visual Studio Code, Git & GitHub
- **Bảo mật:** Supabase Auth & JWT

## Hướng Dẫn Cài Đặt
### Yêu Cầu Hệ Thống
- PostgreSQL 13+
- Node.js 16+
- Tài khoản Supabase
- NextJS 14

### Cách Cài Đặt
1. Clone dự án về máy:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```
2. Cấu hình kết nối cơ sở dữ liệu Supabase/PostgreSQL.
3. Chạy script để khởi tạo database và bảng dữ liệu.
4. Khởi động server:
   ```bash
   npm install
   npm start
   ```

## Giao Diện Ứng Dụng
![Image](https://github.com/user-attachments/assets/a278db1f-3a7a-4b0f-90a5-806062803524)
![Image](https://github.com/user-attachments/assets/89cf0303-30b7-45de-9cf6-02fb32b801c8)

## Hướng Phát Triển
- **Tích hợp AI** để gợi ý khóa học dựa trên sở thích.
- **Nâng cấp giao diện người dùng** để trải nghiệm tốt hơn.
- **Bổ sung hệ thống chứng chỉ** khi hoàn thành khóa học.
- **Xây dựng hệ thống thanh toán** cho các khóa học nâng cao.
