import pg from "pg";

const { Pool } = pg;

// Pool giữ và tái sử dụng các kết nối PostgreSQL.
const database = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default database;
