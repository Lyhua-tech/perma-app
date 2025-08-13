import Router, { type Request, type Response } from "express";
import { authenticateJWT, requireRole } from "../middleware/auth.js";

const adminRouter = Router();
adminRouter.use(authenticateJWT, requireRole("admin"));

adminRouter.get("/admin", (req, res) => {
  res.send("Admin dashboard");
});

export default adminRouter;
