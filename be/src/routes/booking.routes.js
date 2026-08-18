import { Router } from "express";
import { createBooking, listBlockedDates } from "../controllers/booking.controller.js";

const bookingRouter = Router();

bookingRouter.post("/", createBooking);
bookingRouter.get("/blocked-dates", listBlockedDates);

export default bookingRouter;
