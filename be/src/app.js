import express from "express";
import cors from "cors";
import bookingRouter from "./routes/booking.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (request, response) => {
  response.json({ message: "Hello" });
});


app.get("/api/health", (request, response) => {
  response.json({ message: "Backend đang hoạt động" });
});

app.use("/api/bookings", bookingRouter);

export default app;
