import type { NextFunction, Request, Response } from "express";
// 1. Import your Cloudinary upload and remove functions
import {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
} from "../lib/cloudinary.js"; // Adjust path if needed

// I'm assuming you have a database connection and schema like this.
// Replace with your actual database import and schema.
import { db } from "../server.js";
import { products } from "../db/schema.js";
import { CustomError } from "../lib/customError.js";

interface Product {
  name: string;
  inventoryId: string;
  sku: string;
  quantity: number;
  price: string;
  imageUrl?: string | undefined;
  addedById: number;
  //   createdAt: string;
  //   updatedAt: string;
}

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let imageUrl: string | undefined;
  let publicId: string | undefined;

  try {
    // 2. Check if a file was uploaded. If so, upload it to Cloudinary.
    if (req.file) {
      const result = await cloudinaryUploadImage(req.file.buffer);
      if (!result) {
        throw new Error("Failed to upload image to Cloudinary.");
      }
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    // 3. Get other product details from the request body
    const { name, sku, price, quantity } = req.body;

    // Basic validation for other fields
    if (!name || !price || !quantity) {
      return res
        .status(400)
        .json({ message: "Name, price, and stock are required." });
    }
    const numQty = Number(quantity);

    // 4. Create the new product object to be saved
    const newProductData: Product = {
      name,
      inventoryId: "a4baa617-5e8d-48b0-b263-46042805235d",
      sku,
      price, // Ensure price is a string
      quantity: numQty, // Ensure stock is an integer
      imageUrl,
      addedById: 1, // Same for the publicId
    };

    // 5. Save the new product to your database
    // This is an example using Drizzle ORM. Replace with your actual DB logic.
    const [createdProduct] = await db
      .insert(products)
      .values(newProductData)
      .returning();

    // 6. Send a success response
    res.status(201).json({
      message: "Product added successfully!",
      product: createdProduct,
    });
  } catch (error) {
    // 7. ROBUST ERROR HANDLING
    // If an image was uploaded to Cloudinary but the database save failed,
    // we should remove the orphaned image from Cloudinary.
    if (publicId) {
      await cloudinaryRemoveImage(publicId);
    }

    // Pass the error to your centralized error handler
    next(new CustomError("fail to create product", 500));
  }
};

export const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allProducts = await db.select().from(products);
    res.status(200).json(allProducts);
  } catch (error) {
    next(new CustomError("Fail to get all product", 500));
  }
};
