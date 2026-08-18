import {
  blockDateRange,
  createAdminSession,
  deleteAdminSession,
  findAdminByUsername,
  listAllBlockedDates,
  unblockDate,
} from "../models/admin.model.js";
import { ADMIN_COOKIE, readCookie } from "../middleware/admin-auth.js";
import { verifyPassword } from "../services/password.service.js";

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = `Path=/; HttpOnly; Max-Age=${30 * 24 * 60 * 60}; SameSite=${isProduction ? "None" : "Lax"}${isProduction ? "; Secure" : ""}`;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function login(request, response) {
  const username = String(request.body?.username ?? "").trim().toLowerCase();
  const password = String(request.body?.password ?? "");
  const admin = await findAdminByUsername(username);

  if (!admin || !(await verifyPassword(password, admin.password_hash))) {
    return response.status(401).json({ message: "Tài khoản hoặc mật khẩu không đúng" });
  }

  const session = await createAdminSession(admin.id);
  response.setHeader("Set-Cookie", `${ADMIN_COOKIE}=${encodeURIComponent(session.token)}; ${cookieOptions}`);
  return response.json({ username: admin.username });
}

export function getSession(request, response) {
  return response.json({ username: request.admin.username });
}

export async function logout(request, response) {
  await deleteAdminSession(readCookie(request, ADMIN_COOKIE));
  response.setHeader("Set-Cookie", `${ADMIN_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=${isProduction ? "None; Secure" : "Lax"}`);
  return response.status(204).end();
}

export async function getBlockedDates(_request, response) {
  return response.json({ dates: await listAllBlockedDates() });
}

export async function createBlockedDates(request, response) {
  const startDate = String(request.body?.startDate ?? "");
  const endDate = String(request.body?.endDate ?? "");
  const reason = String(request.body?.reason ?? "").trim().slice(0, 200);
  if (!datePattern.test(startDate) || !datePattern.test(endDate) || startDate > endDate) {
    return response.status(400).json({ message: "Khoảng ngày không hợp lệ" });
  }
  const dates = await blockDateRange(startDate, endDate, reason, request.admin.id);
  return response.status(201).json({ dates });
}

export async function deleteBlockedDate(request, response) {
  if (!datePattern.test(request.params.date)) {
    return response.status(400).json({ message: "Ngày không hợp lệ" });
  }
  const deleted = await unblockDate(request.params.date);
  return deleted ? response.status(204).end() : response.status(404).json({ message: "Ngày này chưa bị khóa" });
}
