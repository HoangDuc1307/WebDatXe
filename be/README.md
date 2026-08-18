# Backend đặt vé xe

Backend đơn giản sử dụng Node.js, Express và PostgreSQL.

## Các file quan trọng

- `src/server.js`: khởi động backend.
- `src/app.js`: cấu hình Express và gắn route.
- `src/routes/booking.routes.js`: khai báo đường dẫn API.
- `src/controllers/booking.controller.js`: kiểm tra và xử lý yêu cầu.
- `src/models/booking.model.js`: lưu dữ liệu vào PostgreSQL.
- `src/config/database.js`: tạo kết nối PostgreSQL.
- `database.sql`: câu lệnh tạo bảng PostgreSQL.
- `.env`: thông tin kết nối database.

## Chạy backend

```powershell
npm.cmd install
npm.cmd run dev
```

Backend chạy tại `http://localhost:3000`.

## API

- `GET /api/health`: kiểm tra backend.
- `POST /api/bookings`: gửi yêu cầu đặt xe.

`direction` nhận một trong hai giá trị:

- `hanoi_to_son_la`: Hà Nội đi Sơn La.
- `son_la_to_hanoi`: Sơn La đi Hà Nội.

Khách nhập riêng `pickupLocation` (điểm đón) và `dropoffLocation` (điểm trả). Bến xe Mỹ Đình và Bến xe Sơn La chỉ là gợi ý, không bắt buộc.

## Tạo tài khoản quản trị

Chạy toàn bộ `database.sql`, đặt `ADMIN_USERNAME` và `ADMIN_PASSWORD` (tối thiểu 10 ký tự) trong `.env`, rồi chạy:

```powershell
npm.cmd run create-admin
```

Sau khi tạo tài khoản trên production, hãy xóa `ADMIN_PASSWORD` khỏi biến môi trường.
