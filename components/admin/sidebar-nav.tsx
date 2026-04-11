"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import {
  Award,
  Briefcase,
  ChevronRight,
  FileText,
  FolderOpen,
  Home,
  LayoutDashboard,
  Link2,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navGroups = [
  {
    label: "Workspace",
    items: [
      { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/hero", label: "Hero Content", icon: Home },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blogs", label: "Blogs", icon: FileText },
      { href: "/admin/projects", label: "Projects", icon: FolderOpen },
      { href: "/admin/experience", label: "Experience", icon: Briefcase },
      { href: "/admin/skills", label: "Skills", icon: Zap },
      { href: "/admin/certificates", label: "Certificates", icon: Award },
      { href: "/admin/social-links", label: "Social Links", icon: Link2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/contacts", label: "Messages", icon: MessageSquare },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AdminSidebarNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar/95">
      <SidebarHeader className="border-b border-border/50 px-4 py-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2.5 group"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-sm ring-1 ring-primary/15">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">
              Admin Studio
            </p>
            <p className="text-xs text-muted-foreground">
              Portfolio CMS workspace
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4">
        <div className="mb-4 rounded-2xl border border-border/60 bg-background/80 px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Workflow
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">
            Edit content, review messages, publish faster.
          </p>
        </div>

        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="mb-1 px-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin/dashboard" &&
                      pathname.startsWith(item.href));

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "w-full rounded-xl px-3 py-2.5 text-sm transition-all",
                          isActive
                            ? "bg-primary/12 font-medium text-primary shadow-sm ring-1 ring-primary/15"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                        )}
                      >
                        <Link href={item.href}>
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span>{item.label}</span>
                          {isActive ? (
                            <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-60" />
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 px-4 py-4">
        <div className="mb-3 rounded-2xl border border-border/60 bg-background/80 px-3 py-3">
          <p className="text-sm font-medium text-foreground">System ready</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Content changes are routed through the existing admin APIs and saved
            directly to the CMS data layer.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-2.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-3 py-1.5 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
        >
          ↗ View public site
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
