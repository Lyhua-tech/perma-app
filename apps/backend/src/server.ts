import dotenv from "dotenv";
import path from "path";

// Choose .env file based on ENV
const envFile = `.env.${process.env.ENVIRONMENT || "local"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });
console.log(`Loaded env: ${envFile}`);

import express, { urlencoded, json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { notFound } from "./middleware/notFound.js";
import { error } from "./middleware/error.js";

import inventoryRoute from "./routes/inventoryRoute.js";
import productRoute from "./routes/productRoute.js";
import authRoute from "./routes/authRoute.js";
import adminRoute from "./routes/adminRoute.js";

const connectionString = process.env.DATABASE_URL!;
const client = new Pool({ connectionString });
export const db = drizzle(client);

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());

// CORS
const allowedOrigins =
  process.env.ENVIRONMENT === "production"
    ? ["https://your-production-domain.com"]
    : [
        "http://localhost:3000",
        "https://perma-client.netlify.app", // dev frontend
      ];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/auth/user", authRoute);
app.use("/api/v1", inventoryRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/secure", adminRoute);

// Error handlers
app.use(notFound);
app.use(error);

export default app;
