import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.routes.js";

const app = express();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";

app.use(cors({ origin: frontendUrl }));
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ message: "Hello" });
});


app.get("/api/health", (request, response) => {
  response.json({ message: "Backend đang hoạt động" });
});

app.use("/api/bookings", bookingRouter);

export default app;
