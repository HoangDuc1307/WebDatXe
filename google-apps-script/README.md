# Gửi email bằng Google Apps Script

1. Mở https://script.google.com và tạo dự án mới.
2. Dán nội dung `Code.gs` vào trình chỉnh sửa.
3. Vào **Project Settings > Script Properties**, thêm:
   - `ADMIN_EMAIL`: Gmail nhận thông báo.
   - `NOTIFICATION_SECRET`: một chuỗi bí mật dài, tự đặt.
4. Chọn **Deploy > New deployment > Web app**.
5. Chọn **Execute as: Me** và **Who has access: Anyone**.
6. Cấp quyền gửi email, sau đó sao chép URL kết thúc bằng `/exec`.
7. Trên Render, đặt `GOOGLE_SCRIPT_URL` bằng URL đó và đặt
   `NOTIFICATION_SECRET` giống hệt giá trị trong Script Properties.

Không đưa `NOTIFICATION_SECRET` vào GitHub.
