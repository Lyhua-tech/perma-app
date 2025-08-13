import Router from "express";
import {
  forgetPassword,
  getProfile,
  login,
  logout,
  refreshToken,
  registerUser,
  resetPassword,
} from "../handler/authHandler.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", login);
router.post("/refreshtoken", refreshToken);
router.post("/forgotpassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", logout);
router.get("/me", authenticateJWT, getProfile);

export default router;
