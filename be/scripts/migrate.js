import "dotenv/config";
import { readFile } from "node:fs/promises";
import database from "../src/config/database.js";

const sql = await readFile(new URL("../database.sql", import.meta.url), "utf8");

try {
  await database.query(sql);
  console.log("Đã cập nhật cấu trúc database.");
} finally {
  await database.end();
}
