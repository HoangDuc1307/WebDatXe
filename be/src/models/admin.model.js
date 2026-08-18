import { createHash, randomBytes } from "node:crypto";
import database from "../config/database.js";

const SESSION_DAYS = 30;

function tokenHash(token) {
  return createHash("sha256").update(token).digest("hex");
}

export async function findAdminByUsername(username) {
  const result = await database.query(
    `SELECT id, username, password_hash FROM admin_users WHERE username = $1 AND is_active = TRUE`,
    [username],
  );
  return result.rows[0] ?? null;
}

export async function createAdminSession(adminUserId) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await database.query(
    `INSERT INTO admin_sessions (admin_user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [adminUserId, tokenHash(token), expiresAt],
  );
  return { token, expiresAt };
}

export async function getAdminFromSession(token) {
  if (!token) return null;
  const result = await database.query(
    `SELECT u.id, u.username
     FROM admin_sessions s
     JOIN admin_users u ON u.id = s.admin_user_id
     WHERE s.token_hash = $1 AND s.expires_at > NOW() AND u.is_active = TRUE`,
    [tokenHash(token)],
  );
  return result.rows[0] ?? null;
}

export async function deleteAdminSession(token) {
  if (!token) return;
  await database.query(`DELETE FROM admin_sessions WHERE token_hash = $1`, [tokenHash(token)]);
}

export async function listAllBlockedDates() {
  const result = await database.query(`
    SELECT blocked_date::text AS date, reason, created_at
    FROM blocked_dates
    ORDER BY blocked_date
  `);
  return result.rows;
}

export async function blockDateRange(startDate, endDate, reason, adminUserId) {
  const result = await database.query(
    `INSERT INTO blocked_dates (blocked_date, reason, created_by)
     SELECT day::date, $3, $4
     FROM generate_series($1::date, $2::date, interval '1 day') AS day
     ON CONFLICT (blocked_date) DO UPDATE SET reason = EXCLUDED.reason, created_by = EXCLUDED.created_by
     RETURNING blocked_date::text AS date, reason`,
    [startDate, endDate, reason, adminUserId],
  );
  return result.rows;
}

export async function unblockDate(date) {
  const result = await database.query(
    `DELETE FROM blocked_dates WHERE blocked_date = $1::date RETURNING blocked_date::text AS date`,
    [date],
  );
  return result.rowCount > 0;
}
