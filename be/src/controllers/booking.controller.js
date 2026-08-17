import { saveBooking } from "../models/booking.model.js";
import { sendBookingEmail } from "../services/email.service.js";

export async function createBooking(request, response) {
  const booking = request.body;

  // Hai trường này không bắt buộc, mặc định là khách không có yêu cầu.
  booking.preferredFloor ||= "no_preference";
  booking.preferredPosition ||= "no_preference";

  const requiredFields = [
    booking.fullName,
    booking.phone,
    booking.pickupTime,
    booking.direction,
    booking.pickupLocation,
    booking.dropoffLocation,
    booking.bedType,
    booking.bedQuantity,
    booking.passengerCount,
  ];

  if (requiredFields.some((value) => !value)) {
    return response.status(400).json({
      message: "Vui lòng nhập đầy đủ thông tin",
    });
  }

  if (booking.bedType !== "single" && booking.bedType !== "double") {
    return response.status(400).json({
      message: "Loại giường không hợp lệ",
    });
  }

  const validDirections = ["hanoi_to_son_la", "son_la_to_hanoi"];

  if (!validDirections.includes(booking.direction)) {
    return response.status(400).json({
      message: "Chiều đi không hợp lệ",
    });
  }

  const validFloors = ["no_preference", "floor_1", "floor_2"];
  const validPositions = [
    "no_preference",
    "window",
    "near_door",
    "front",
    "middle",
    "back",
  ];

  if (!validFloors.includes(booking.preferredFloor)) {
    return response.status(400).json({ message: "Tầng mong muốn không hợp lệ" });
  }

  if (!validPositions.includes(booking.preferredPosition)) {
    return response.status(400).json({ message: "Vị trí mong muốn không hợp lệ" });
  }

  const pickupDate = new Date(booking.pickupTime);
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);

  if (Number.isNaN(pickupDate.getTime()) || pickupDate < oneHourFromNow) {
    return response.status(400).json({
      message: "Bạn cần đặt xe trước giờ đón ít nhất 1 tiếng",
    });
  }

  try {
    booking.pickupTime = pickupDate;
    const bookingId = await saveBooking(booking);

    try {
      await sendBookingEmail(booking, bookingId);
    } catch (emailError) {
      console.error("Không thể gửi email thông báo:", emailError.message);
    }

    return response.status(201).json({
      message: "Đã gửi yêu cầu. Nhà xe sẽ gọi điện xác nhận.",
      bookingId,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({
      message: "Không thể lưu yêu cầu đặt xe",
    });
  }
}
