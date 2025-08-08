import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL!;

// This client will now connect to your Supabase URL
const client = new Pool({ connectionString });
export const db = drizzle(client);

import express, { urlencoded, json } from "express";
import cors from "cors";
import { notFound } from "./middleware/notFound.js";
import { error } from "./middleware/error.js";
import inventoryRoute from "./routes/inventoryRoute.js";
import productRoute from "./routes/productRoute.js";

const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());

// or use dynamic CORS config:
const allowedOrigins = ["http://localhost:3000", "https://yourdomain.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use("/api/v1", inventoryRoute);
app.use("/api/v1/product", productRoute);

app.use(notFound);
app.use(error);

export default app;
