import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error("Thiếu biến DATABASE_URL");
}

const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
  connectionTimeoutMillis: 15000,
});

try {
  await database.query("TRUNCATE TABLE booking_requests RESTART IDENTITY");
  console.log("Đã xóa toàn bộ đơn và reset ID về 1.");
} finally {
  await database.end();
}
