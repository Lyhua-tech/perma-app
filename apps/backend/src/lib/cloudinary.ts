import { v2 as cloudinary } from "cloudinary";
import type { UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Upload a single image
export const cloudinaryUploadImage = async (
  fileBuffer: Buffer
): Promise<UploadApiResponse> => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
      },
      async (error, result) => {
        if (error || !result) throw error;
      }
    );

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
          if (error || !result) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Internal Server Error (cloudinary upload)");
  }
};

// Remove a single image by public ID
export const cloudinaryRemoveImage = async (
  imagePublicId: string
): Promise<{ result: string }> => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  } catch (error) {
    console.error("Cloudinary remove error:", error);
    throw new Error("Internal Server Error (cloudinary remove)");
  }
};

// Remove multiple images by array of public IDs
export const cloudinaryRemoveMultipleImage = async (
  publicIds: string[]
): Promise<any> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error("Cloudinary remove multiple error:", error);
    throw new Error("Internal Server Error (cloudinary bulk remove)");
  }
};
