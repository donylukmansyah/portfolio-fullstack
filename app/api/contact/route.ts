import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { checkContactRateLimit } from "@/lib/contact-rate-limit";
import { contactSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const rateLimit = checkContactRateLimit(ip);

  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please wait before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.retryAfterMs / 1000)),
        },
      }
    );
  }

  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid form data", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await db.insert(contactSubmissions).values({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    social: parsed.data.social || null,
    ipAddress: ip,
    isRead: false,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
