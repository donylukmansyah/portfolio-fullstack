"use client";

import Link from "next/link";
import * as React from "react";

import { Icons } from "@/components/common/icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type GitHubStarBadgeProps = {
  className?: string;
};

export function GitHubStarBadge({ className }: GitHubStarBadgeProps) {
  return (
    <Link
      href={siteConfig.links.github}
      target="_blank"
      rel="noreferrer"
      aria-label="View GitHub profile"
      className={cn(
        "inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background/60 px-4 text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-accent hover:text-foreground",
        className
      )}
    >
      <span className="flex items-center gap-2">
        <Icons.gitHub className="h-4 w-4 text-foreground" />
        <span className="font-medium text-foreground">GitHub</span>
      </span>
    </Link>
  );
}
