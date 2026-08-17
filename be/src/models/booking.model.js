import database from "../config/database.js";

// Lưu một yêu cầu đặt xe và trả về mã vừa được tạo.
export async function saveBooking(booking) {
  const sql = `
    INSERT INTO booking_requests
      (full_name, phone, pickup_time, direction, pickup_location, dropoff_location,
       bed_type, bed_quantity, passenger_count, preferred_floor,
       preferred_position, note)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id
  `;

  const values = [
    booking.fullName,
    booking.phone,
    booking.pickupTime,
    booking.direction,
    booking.pickupLocation,
    booking.dropoffLocation,
    booking.bedType,
    booking.bedQuantity,
    booking.passengerCount,
    booking.preferredFloor,
    booking.preferredPosition,
    booking.note || null,
  ];

  const result = await database.query(sql, values);
  return result.rows[0].id;
}
