# Reset dữ liệu đặt xe

Workflow `.github/workflows/reset-bookings.yml` tự chạy vào 07:00 sáng ngày 1
hàng tháng theo giờ Việt Nam. Công việc này:

1. Xóa toàn bộ dữ liệu trong bảng `booking_requests`.
2. Đặt lại bộ đếm để đơn tiếp theo có `id = 1`.

## Cấu hình GitHub Secret

1. Mở repository GitHub.
2. Vào **Settings > Secrets and variables > Actions**.
3. Chọn **New repository secret**.
4. Đặt tên `NEON_DATABASE_URL`.
5. Dán Connection String của Neon vào Value rồi lưu.

## Reset ngay lập tức

1. Mở tab **Actions** trên GitHub.
2. Chọn **Reset dữ liệu đặt xe hàng tháng**.
3. Chọn **Run workflow > Run workflow**.

Thao tác này không thể hoàn tác. Email admin đã nhận trước đó không bị xóa.
