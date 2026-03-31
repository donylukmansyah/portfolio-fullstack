import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

import type { BlogMeta, BlogPost } from "./blogs";

export function resolveBlogImageUrl(coverImage?: string) {
  if (!coverImage) {
    return siteConfig.ogImage;
  }

  return coverImage.startsWith("http")
    ? coverImage
    : `${siteConfig.url}${coverImage}`;
}

export function formatBlogDisplayDate(
  date: string,
  locale = "en-US",
  options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  }
) {
  return new Date(date).toLocaleDateString(locale, options);
}

function getBlogKeywords(tags: string[]) {
  return tags.join(", ");
}

function getBlogWordCount(contentHtml: string) {
  return contentHtml
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function buildBlogListStructuredData(
  blogs: BlogMeta[],
  description: string
) {
  return {
    blogListSchema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `${siteConfig.authorName} — Blog`,
      description,
      url: `${siteConfig.url}/blogs`,
      isPartOf: {
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      author: {
        "@type": "Person",
        name: siteConfig.authorName,
        url: siteConfig.url,
      },
      mainEntity: {
        "@type": "Blog",
        name: `${siteConfig.authorName}'s Blog`,
        description,
        url: `${siteConfig.url}/blogs`,
        author: {
          "@type": "Person",
          name: siteConfig.authorName,
          url: siteConfig.url,
        },
        blogPost: blogs.map((blog) => ({
          "@type": "BlogPosting",
          headline: blog.title,
          description: blog.description,
          datePublished: blog.date,
          url: `${siteConfig.url}/blogs/${blog.slug}`,
          author: {
            "@type": "Person",
            name: siteConfig.authorName,
          },
          keywords: getBlogKeywords(blog.tags),
          image: resolveBlogImageUrl(blog.coverImage),
        })),
      },
    },
    breadcrumbSchema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: `${siteConfig.url}/blogs`,
        },
      ],
    },
  };
}

export function buildBlogPostMetadata(post: BlogPost): Metadata {
  const url = `${siteConfig.url}/blogs/${post.slug}`;
  const image = resolveBlogImageUrl(post.coverImage);
  const modifiedTime = post.updatedAt ?? post.date;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: siteConfig.authorName, url: siteConfig.url }],
    keywords: post.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.name,
      type: "article",
      publishedTime: post.date,
      modifiedTime,
      authors: [siteConfig.authorName],
      tags: post.tags,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [image],
      creator: `@${siteConfig.username}`,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  };
}

export function buildBlogPostStructuredData(post: BlogPost) {
  const url = `${siteConfig.url}/blogs/${post.slug}`;
  const publishedTime = new Date(post.date).toISOString();
  const modifiedTime = new Date(post.updatedAt ?? post.date).toISOString();

  return {
    blogPostSchema: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: publishedTime,
      dateModified: modifiedTime,
      author: {
        "@type": "Person",
        name: siteConfig.authorName,
        url: siteConfig.url,
        sameAs: [siteConfig.links.github, siteConfig.links.twitter],
      },
      publisher: {
        "@type": "Person",
        name: siteConfig.authorName,
        url: siteConfig.url,
      },
      url,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      image: resolveBlogImageUrl(post.coverImage),
      keywords: getBlogKeywords(post.tags),
      wordCount: getBlogWordCount(post.contentHtml),
      ...(post.readingTime && {
        timeRequired: `PT${post.readingTime}M`,
      }),
      inLanguage: "en-US",
      isPartOf: {
        "@type": "Blog",
        name: `${siteConfig.authorName}'s Blog`,
        url: `${siteConfig.url}/blogs`,
      },
    },
    breadcrumbSchema: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blogs",
          item: `${siteConfig.url}/blogs`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: url,
        },
      ],
    },
  };
}
