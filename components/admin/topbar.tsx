"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  admin: "Admin",
  dashboard: "Dashboard",
  hero: "Hero Content",
  projects: "Projects",
  experience: "Experience",
  skills: "Skills",
  contributions: "Contributions",
  "social-links": "Social Links",
  contacts: "Messages",
  settings: "Settings",
  new: "New",
  edit: "Edit",
  login: "Login",
};

function prettifySegment(segment: string) {
  if (LABELS[segment]) {
    return LABELS[segment];
  }

  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function AdminTopbar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const pageTitle = prettifySegment(
    segments[segments.length - 1] ?? "dashboard"
  );

  const crumbs = segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: prettifySegment(segment),
  }));

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/85 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-5" />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {crumbs.map((crumb, index) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {index > 0 ? <span className="text-border">/</span> : null}
                {index === crumbs.length - 1 ? (
                  <span className="font-medium text-foreground">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-foreground sm:text-base">
              {pageTitle}
            </h2>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-[11px]"
            >
              Portfolio CMS
            </Badge>
          </div>
        </div>
        <div className="hidden text-right md:block">
          <p className="text-xs font-medium text-foreground">Ctrl/Cmd + B</p>
          <p className="text-xs text-muted-foreground">Toggle sidebar</p>
        </div>
      </div>
    </header>
  );
}
