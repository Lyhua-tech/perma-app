import path from "path";
import multer, { type FileFilterCallback } from "multer";
import type { StorageEngine } from "multer";
import type { Request } from "express";

// Photo Storage Configuration
const photoStorage = multer.memoryStorage(); // ✅ replaces diskStorage

// File Filter Function
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"));
  }
};

// Photo Upload Middleware
export const photoUpload = multer({
  storage: photoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 },
});
