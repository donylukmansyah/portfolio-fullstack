import { NextRequest, NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/admin-api";
import {
  BLOG_SLUG_IN_USE_ERROR,
  createBlog,
  parseBlogInput,
} from "@/lib/blog-admin";
import { getAdminBlogs } from "@/lib/queries";

export async function GET() {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const data = await getAdminBlogs();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const body = await req.json();
  const parsed = parseBlogInput(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const created = await createBlog(parsed.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "BLOG_SLUG_CONFLICT") {
      return NextResponse.json(
        { error: BLOG_SLUG_IN_USE_ERROR },
        { status: 409 }
      );
    }

    throw error;
  }
}
