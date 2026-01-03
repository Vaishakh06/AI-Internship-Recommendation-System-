const ApiError = require("./ApiError");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async ({ file, publicId }) => {
  // Upload an image
  const uploadResult = await cloudinary.uploader
    .upload(file, {
      public_id: publicId,
      folder: "ChatX/avatars/",
      overwrite: true,
      invalidate: true,
    })
    .catch((error) => {
      console.error("Cloudinary upload failed:", error);
      throw new ApiError("Failed to upload image", 500);
    });

  // Optimize delivery by resizing and applying auto-format and auto-quality
  const optimizeUrl = cloudinary.url(uploadResult.public_id, {
    fetch_format: "auto",
    quality: "auto",
    version: uploadResult.version,
  });

  // Transform the image: auto-crop to square aspect_ratio
  const autoCropUrl = cloudinary.url(uploadResult.public_id, {
    crop: "auto",
    gravity: "auto",
    width: 500,
    height: 500,
    version: uploadResult.version,
  });

  return autoCropUrl;
};

const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId)
      throw new ApiError("publicId is required to delete image", 400);

    const result = await cloudinary.uploader.destroy(publicId);

    // result example: { result: 'ok' } on success
    if (result.result !== "ok") {
      throw new ApiError("Failed to delete image from Cloudinary", 500);
    }

    return result;
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to delete image", 500);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };