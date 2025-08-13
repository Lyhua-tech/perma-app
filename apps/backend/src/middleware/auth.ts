import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwttoken.js";
import { db } from "../server.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

export async function findUserById(id: number) {
  return db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .then((r) => r[0] ?? null);
}

export async function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return res.status(401).json({ message: "Missing token" });
    const token = authHeader.split(" ")[1] as string;
    const decoded = verifyAccessToken(token);
    const user = await findUserById(decoded.sub);
    if (!user) return res.status(401).json({ message: "Invalid token user" });
    req.user = { id: user.id, email: user.email, role: user.role! };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role))
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    next();
  };
}
