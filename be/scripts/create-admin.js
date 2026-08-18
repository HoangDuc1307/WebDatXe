import "dotenv/config";
import database from "../src/config/database.js";
import { hashPassword } from "../src/services/password.service.js";

const username = String(process.env.ADMIN_USERNAME ?? "").trim().toLowerCase();
const password = String(process.env.ADMIN_PASSWORD ?? "");

if (!username || password.length < 10) {
  console.error("Hãy đặt ADMIN_USERNAME và ADMIN_PASSWORD (ít nhất 10 ký tự) trước khi chạy.");
  process.exitCode = 1;
} else {
  const passwordHash = await hashPassword(password);
  await database.query(
    `INSERT INTO admin_users (username, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = TRUE`,
    [username, passwordHash],
  );
  console.log(`Đã tạo/cập nhật tài khoản admin: ${username}`);
}

await database.end();
