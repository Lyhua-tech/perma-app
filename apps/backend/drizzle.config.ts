import "dotenv/config"; // This line loads the .env file
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // It reads the URL directly from your environment variables
    url: process.env.DATABASE_URL!,
  },
});
