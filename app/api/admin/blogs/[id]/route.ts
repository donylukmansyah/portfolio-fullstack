import { NextRequest, NextResponse } from "next/server";
import {
  getRouteId,
  requireAuth,
  unauthorizedResponse,
} from "@/lib/admin-api";
import {
  BLOG_SLUG_IN_USE_ERROR,
  deleteBlog,
  parseBlogInput,
  updateBlog,
} from "@/lib/blog-admin";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  const body = await req.json();
  const parsed = parseBlogInput(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updated = await updateBlog(id, parsed.data);

    if (!updated) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
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

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await requireAuth();
  if (!session) return unauthorizedResponse();

  const id = await getRouteId(params);
  const deleted = await deleteBlog(id);

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
