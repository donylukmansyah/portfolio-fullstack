import type { Metadata } from "next";

import { getAdminBlogs } from "@/lib/queries";
import { BlogsClient } from "./blogs-client";

export const metadata: Metadata = { title: "Blogs" };
export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  const data = await getAdminBlogs();

  return <BlogsClient initialData={data as any} />;
}
