"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface AdminFormShellProps {
  title: string;
  description: string;
  actions: ReactNode;
  modeLabel?: string;
  preview?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AdminFormShell({
  title,
  description,
  actions,
  modeLabel,
  preview,
  children,
  className,
}: AdminFormShellProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <section className="rounded-3xl border border-border/60 bg-background px-5 py-5 shadow-sm sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            {modeLabel ? (
              <Badge
                variant="secondary"
                className="rounded-full px-3 py-1 text-[11px] font-medium"
              >
                {modeLabel}
              </Badge>
            ) : null}
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        </div>
      </section>

      {preview ? (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-8">{children}</div>
          <aside className="xl:sticky xl:top-24 xl:self-start">
            <section className="rounded-3xl border border-border/60 bg-background p-5 shadow-sm">
              {preview}
            </section>
          </aside>
        </div>
      ) : (
        <div className="space-y-8">{children}</div>
      )}
    </div>
  );
}
