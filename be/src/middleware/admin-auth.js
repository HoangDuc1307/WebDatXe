import { getAdminFromSession } from "../models/admin.model.js";

export const ADMIN_COOKIE = "nhu_khanh_admin";

export function readCookie(request, name) {
  const cookies = request.headers.cookie?.split(";") ?? [];
  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return "";
}

export async function requireAdmin(request, response, next) {
  try {
    const admin = await getAdminFromSession(readCookie(request, ADMIN_COOKIE));
    if (!admin) return response.status(401).json({ message: "Phiên đăng nhập đã hết hạn" });
    request.admin = admin;
    return next();
  } catch (error) {
    return next(error);
  }
}
