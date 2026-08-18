import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.routes.js";
import adminRouter from "./routes/admin.routes.js";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";

app.disable("x-powered-by");
app.use(cors({ origin: frontendUrl, credentials: true }));
app.use(express.json({ limit: "50kb" }));

app.get("/", (request, response) => {
  response.json({ message: "Hello" });
});


app.get("/api/health", (request, response) => {
  response.json({ message: "Backend đang hoạt động" });
});

app.use("/api/bookings", bookingRouter);
app.use("/api/admin", adminRouter);

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: "Đã có lỗi xảy ra" });
});

export default app;
