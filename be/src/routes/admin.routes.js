import { Router } from "express";
import {
  createBlockedDates,
  deleteBlockedDate,
  getBlockedDates,
  getSession,
  login,
  logout,
} from "../controllers/admin.controller.js";
import { requireAdmin } from "../middleware/admin-auth.js";

const adminRouter = Router();

adminRouter.post("/login", login);
adminRouter.get("/session", requireAdmin, getSession);
adminRouter.post("/logout", requireAdmin, logout);
adminRouter.get("/blocked-dates", requireAdmin, getBlockedDates);
adminRouter.post("/blocked-dates", requireAdmin, createBlockedDates);
adminRouter.delete("/blocked-dates/:date", requireAdmin, deleteBlockedDate);

export default adminRouter;
