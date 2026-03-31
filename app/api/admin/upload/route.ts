import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import { cloudinary } from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/svg+xml",
  "video/mp4", "video/webm",
  "application/pdf",
];
const MAX_BYTES = 10_000_000; // 10 MB

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "portfolio/misc";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File exceeds 10MB limit" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "auto",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "svg", "mp4", "webm", "pdf"],
          timeout: 30000,
        },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as { secure_url: string; public_id: string });
        }
      ).end(buffer);
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);

    if (error?.code === "ENOTFOUND" || error?.syscall === "getaddrinfo") {
      return NextResponse.json(
        { error: "Cannot reach Cloudinary. Please check your internet connection and try again." },
        { status: 502 }
      );
    }

    if (error?.name === "TimeoutError" || error?.http_code === 499) {
      return NextResponse.json(
        { error: "Upload timed out. Please try again or use a smaller file." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
