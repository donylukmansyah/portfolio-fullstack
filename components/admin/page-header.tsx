"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  description,
  badge,
  eyebrow,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-3xl border border-border/60 bg-background px-5 py-5 shadow-sm sm:px-6",
        "lg:flex-row lg:items-start lg:justify-between",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {eyebrow ? (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/80">
              {eyebrow}
            </span>
          ) : null}
          {badge ? (
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-[11px] font-medium"
            >
              {badge}
            </Badge>
          ) : null}
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3">{actions}</div>
      ) : null}
    </section>
  );
}
