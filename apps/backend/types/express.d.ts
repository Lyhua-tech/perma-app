import { User } from "./user.ts";
import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
    }
  }
}
