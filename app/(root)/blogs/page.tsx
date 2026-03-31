import { Metadata } from "next";
import Script from "next/script";

import BlogCard from "@/components/blogs/blog-card";
import { AnimatedSection } from "@/components/common/animated-section";
import PageContainer from "@/components/common/page-container";
import { pagesConfig } from "@/config/pages";
import { siteConfig } from "@/config/site";
import { getAllBlogsMeta } from "@/lib/blogs";
import { buildBlogListStructuredData } from "@/lib/blog-metadata";

export const metadata: Metadata = {
  title: pagesConfig.blogs.metadata.title,
  description: pagesConfig.blogs.metadata.description,
  alternates: {
    canonical: `${siteConfig.url}/blogs`,
  },
  openGraph: {
    title: `${pagesConfig.blogs.metadata.title} | ${siteConfig.name}`,
    description: pagesConfig.blogs.metadata.description,
    url: `${siteConfig.url}/blogs`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.authorName} Blog`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pagesConfig.blogs.metadata.title} | ${siteConfig.name}`,
    description: pagesConfig.blogs.metadata.description,
    images: [siteConfig.ogImage],
    creator: `@${siteConfig.username}`,
  },
};

export default async function BlogsPage() {
  const blogs = await getAllBlogsMeta();
  const { blogListSchema, breadcrumbSchema } = buildBlogListStructuredData(
    blogs,
    pagesConfig.blogs.metadata.description
  );

  return (
    <>
      <Script
        id="schema-blog-list"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <Script
        id="schema-breadcrumb-blogs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <PageContainer
        title={pagesConfig.blogs.title}
        description={pagesConfig.blogs.description}
      >
        {blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl mb-4">✍️</p>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No posts yet
            </h3>
            <p className="text-muted-foreground text-sm">
              Check back soon — posts are coming.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
            {blogs.map((blog, index) => (
              <AnimatedSection
                key={blog.slug}
                delay={0.05 * index}
                direction="up"
                className="h-full"
              >
                <BlogCard blog={blog} />
              </AnimatedSection>
            ))}
          </div>
        )}
      </PageContainer>
    </>
  );
}
