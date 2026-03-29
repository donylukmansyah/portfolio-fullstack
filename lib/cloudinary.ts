import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Returns an optimized Cloudinary URL with auto format + quality + optional width.
 */
export function getOptimizedImageUrl(
  url: string,
  options: { width?: number; quality?: string } = {}
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;
  const { width = 800, quality = "auto" } = options;
  return url.replace("/upload/", `/upload/w_${width},q_${quality},f_auto/`);
}
