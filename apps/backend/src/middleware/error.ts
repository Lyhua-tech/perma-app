import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "../lib/customError.js";

export function error(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  let msg: any;

  try {
    msg = JSON.parse(err.message);
  } catch {
    msg = err.message;
  }

  res.status(statusCode).json({ msg });
}
