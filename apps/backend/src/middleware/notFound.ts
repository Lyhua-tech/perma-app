import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../lib/customError.js";

export function notFound(req: Request, res: Response, next: NextFunction) {
  return next(new CustomError("Request not found.", 404));
}
