import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "./config.js";
// Configuration
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

const options = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export const uploadImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "rentals", // optional folder
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return "";
  }
};
