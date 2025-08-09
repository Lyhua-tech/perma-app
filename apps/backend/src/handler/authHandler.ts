import type { NextFunction, Request, Response } from "express";
import {
  register,
  loginUser,
  refreshTokens,
  revokeRefreshToken,
} from "../services/authService.js";
import { CustomError } from "../lib/customError.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "Missing email or password" });
    const newUser = await register(firstName, lastName, email, password);

    res.status(201).json({ newUser, message: "created account successfully" });
  } catch (error) {
    console.error(error);
    next(new CustomError("fail to create account.", 500));
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const auth = await loginUser(email, password);
    if (!auth) return res.status(401).json({ message: "Invalid credentials" });

    // Set refresh token as httpOnly cookie (recommended) and return access token in body
    res.cookie("jid", auth.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.status(201).json({ accessToken: auth.accessToken });
  } catch (error) {
    next(new CustomError("fail to login", 500));
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jid ?? req.body?.refreshToken;
    if (!token)
      return res.status(400).json({ message: "No refresh token provided" });

    const tokens = await refreshTokens(token);
    if (!tokens)
      return res.status(401).json({ message: "Invalid refresh token" });

    // rotate cookie
    res.cookie("jid", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });
    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    next(new CustomError("Fail to get cookie", 500));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.jid ?? req.body?.refreshToken;
    if (token) await revokeRefreshToken(token);
    res.clearCookie("jid", { path: "/" });
    res.json({ ok: true });
  } catch (error) {
    next(new CustomError("Fail to logout", 500));
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    res.status(200).json(user);
  } catch (error) {
    next(new CustomError("Fail to get profile information", 500));
  }
};
