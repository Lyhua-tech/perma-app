import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../lib/customError.js";
import { db } from "../server.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../lib/jwttoken.js";
import { comparePassword, hashPassword } from "../lib/bcrypt.js";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const hashed_password = await hashPassword(password);
    const [user] = await db
      .insert(users)
      .values({
        firstName,
        lastName,
        email,
        password_hash: hashed_password,
        role: "inventory_manager",
      })
      .returning();

    res.status(201).json({ user, message: "created account successfully" });
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

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user)
      return res.status(401).json({ message: "user is unauthenticated." });

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid Password" });

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);

    const refreshToken = signRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      message: "Login successful!",
      accessToken: accessToken,
    });
  } catch (error) {
    next(new CustomError("fail to login", 500));
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).send("Refresh token not found.");
  }

  try {
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // NOTE: In a real-world app, you should check if this refresh token
    // is still valid or has been revoked in your database.

    // Issue a new access token
    const payload = {
      sub: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    const accessToken = signAccessToken(payload);

    res.json({ accessToken });
  } catch (error) {
    next(new CustomError("Fail to get cookie", 500));
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
  });
  res.status(200).send("Logged out successfully.");
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.user!;
    const user = await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
      })
      .from(users)
      .where(eq(users.id, id));
    res.status(200).json(user);
  } catch (error) {
    next(new CustomError("Fail to get profile information", 500));
  }
};
