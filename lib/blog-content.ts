import "server-only";

import type { JSONContent } from "@tiptap/core";
import { generateHTML } from "@tiptap/html/server";

import {
  EMPTY_BLOG_CONTENT,
  blogContentExtensions,
  isBlogContentDocument,
} from "./blog-editor-config";

const sanitizeHtml = require("sanitize-html") as {
  (dirty: string, options?: Record<string, unknown>): string;
  simpleTransform: (
    tagName: string,
    attribs: Record<string, string>
  ) => unknown;
};

const blogSanitizeOptions = {
  allowedTags: [
    "p",
    "h1",
    "h2",
    "h3",
    "h4",
    "blockquote",
    "ul",
    "ol",
    "li",
    "a",
    "strong",
    "em",
    "s",
    "u",
    "code",
    "pre",
    "hr",
    "br",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "mark",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "data-public-id"],
    p: ["style"],
    h1: ["style"],
    h2: ["style"],
    h3: ["style"],
    h4: ["style"],
    th: ["colspan", "rowspan", "colwidth"],
    td: ["colspan", "rowspan", "colwidth"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: {
    img: ["http", "https"],
  },
  allowedStyles: {
    p: {
      "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
    },
    h1: {
      "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
    },
    h2: {
      "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
    },
    h3: {
      "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
    },
    h4: {
      "text-align": [/^left$/, /^center$/, /^right$/, /^justify$/],
    },
  },
  transformTags: {
    a: sanitizeHtml.simpleTransform("a", {
      rel: "noopener noreferrer nofollow",
      target: "_blank",
    }),
  },
};

export function normalizeBlogContent(value: unknown): JSONContent {
  if (!isBlogContentDocument(value)) {
    return EMPTY_BLOG_CONTENT;
  }

  return value as JSONContent;
}

export function renderBlogContentHtml(content: JSONContent): string {
  const html = generateHTML(content, blogContentExtensions);
  return sanitizeHtml(html, blogSanitizeOptions);
}

export function getBlogPlainTextFromHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingTimeFromText(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  if (!wordCount) {
    return 1;
  }

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export function prepareStoredBlogContent(content: unknown) {
  const normalizedContent = normalizeBlogContent(content);
  const contentHtml = renderBlogContentHtml(normalizedContent);
  const contentText = getBlogPlainTextFromHtml(contentHtml);

  return {
    contentJson: normalizedContent,
    contentHtml,
    contentText,
    readingTime: estimateReadingTimeFromText(contentText),
  };
}
