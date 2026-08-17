# Deploy WebDatXe miễn phí

## 1. Tạo PostgreSQL trên Neon

1. Tạo project tại https://console.neon.tech.
2. Sao chép **Connection string** của database.
3. Mở **SQL Editor** của Neon.
4. Sao chép và chạy toàn bộ nội dung file `be/database.sql`.

Connection string sẽ được dùng làm biến `DATABASE_URL` trên Render. Không đưa
connection string vào GitHub.

## 2. Tạo Google Apps Script gửi email

Làm theo hướng dẫn trong `google-apps-script/README.md` để lấy URL kết thúc bằng
`/exec`. Có thể tạo chuỗi bí mật trên PowerShell bằng lệnh:

```powershell
[guid]::NewGuid().ToString("N")
```

Lưu lại URL và chuỗi bí mật để nhập vào Render.

## 3. Đẩy code mới lên GitHub

```powershell
git add .
git commit -m "Chuẩn bị cấu hình deploy"
git push
```

## 4. Deploy bằng Render Blueprint

1. Đăng nhập https://dashboard.render.com bằng GitHub.
2. Chọn **New > Blueprint**.
3. Chọn repository `HoangDuc1307/WebDatXe`.
4. Render đọc file `render.yaml` và tạo hai dịch vụ:
   - `webdatxe-api`: backend Node.js.
   - `webdatxe-nhu-khanh`: frontend Angular.
5. Nhập các biến bí mật khi Render yêu cầu:
   - `DATABASE_URL`: connection string của Neon.
   - `GOOGLE_SCRIPT_URL`: URL Web App của Apps Script.
   - `NOTIFICATION_SECRET`: giống hệt Script Properties.

Không nhập `EMAIL_APP_PASSWORD` lên Render. Render Free sử dụng Apps Script để
gửi email qua HTTPS.

## 5. Kiểm tra

1. Mở `https://webdatxe-api.onrender.com/api/health`.
2. Mở `https://webdatxe-nhu-khanh.onrender.com`.
3. Gửi một đơn thử.
4. Kiểm tra bảng `booking_requests` trên Neon và Gmail admin.

Nếu Render báo tên dịch vụ đã tồn tại, đổi cả ba vị trí sau cho đồng bộ:

- `name` của hai service trong `render.yaml`.
- `FRONTEND_URL` trong `render.yaml`.
- `apiUrl` trong `fe/src/environments/environment.production.ts`.
