import nodemailer from "nodemailer";

const directionNames = {
  hanoi_to_son_la: "Hà Nội → Sơn La",
  son_la_to_hanoi: "Sơn La → Hà Nội",
};

const bedNames = {
  single: "Giường đơn",
  double: "Giường đôi",
};

const floorNames = {
  no_preference: "Không yêu cầu",
  floor_1: "Tầng 1",
  floor_2: "Tầng 2",
};

const positionNames = {
  no_preference: "Không yêu cầu",
  window: "Gần cửa sổ",
  near_door: "Gần cửa lên xuống",
  front: "Phía đầu xe",
  middle: "Giữa xe",
  back: "Cuối xe",
};

export async function sendBookingEmail(booking, bookingId) {
  const departureTime = booking.pickupTime.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const content = [
    `Có yêu cầu đặt xe mới #${bookingId}`,
    "",
    `Khách hàng: ${booking.fullName}`,
    `Số điện thoại: ${booking.phone}`,
    `Chiều đi: ${directionNames[booking.direction]}`,
    `Ngày giờ đi: ${departureTime}`,
    `Điểm đón: ${booking.pickupLocation}`,
    `Điểm trả: ${booking.dropoffLocation}`,
    `Loại giường: ${bedNames[booking.bedType]}`,
    `Số giường: ${booking.bedQuantity}`,
    `Số khách: ${booking.passengerCount}`,
    `Tầng mong muốn: ${floorNames[booking.preferredFloor]}`,
    `Vị trí mong muốn: ${positionNames[booking.preferredPosition]}`,
    `Ghi chú: ${booking.note || "Không có"}`,
    "",
    "Vui lòng gọi cho khách để xác nhận.",
  ].join("\n");

  const subject = `Đơn đặt xe mới #${bookingId} - ${booking.fullName}`;

  if (process.env.GOOGLE_SCRIPT_URL) {
    await sendWithGoogleScript(subject, content);
    return;
  }

  await sendWithGmail(subject, content);
}

async function sendWithGoogleScript(subject, text) {
  if (!process.env.NOTIFICATION_SECRET) {
    throw new Error("Chưa cấu hình NOTIFICATION_SECRET");
  }

  const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.NOTIFICATION_SECRET,
      subject,
      text,
    }),
    signal: AbortSignal.timeout(15000),
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.message || "Google Apps Script không thể gửi email");
  }
}

async function sendWithGmail(subject, text) {
  const { EMAIL_USER, EMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;

  if (!EMAIL_USER || !EMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    throw new Error("Chưa cấu hình Gmail hoặc Google Apps Script");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD.replace(/\s/g, ""),
    },
  });

  await transporter.sendMail({
    from: `Xe khách Như Khánh <${EMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject,
    text,
  });
}
