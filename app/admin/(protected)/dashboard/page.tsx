import type { Metadata } from "next";
import { db } from "@/db";
import {
  projects,
  experiences,
  skills,
  contributions,
  contactSubmissions,
  siteSettings,
} from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderOpen,
  Briefcase,
  Zap,
  GitMerge,
  MessageSquare,
  Settings,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [
    [projectCount],
    [experienceCount],
    [skillCount],
    [contributionCount],
    [messageCount],
    [unreadCount],
  ] = await Promise.all([
    db.select({ count: count() }).from(projects),
    db.select({ count: count() }).from(experiences),
    db.select({ count: count() }).from(skills),
    db.select({ count: count() }).from(contributions),
    db.select({ count: count() }).from(contactSubmissions),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.isRead, false)),
  ]);

  return {
    projects: projectCount.count,
    experiences: experienceCount.count,
    skills: skillCount.count,
    contributions: contributionCount.count,
    messages: messageCount.count,
    unread: unreadCount.count,
  };
}

const statCards = (stats: Awaited<ReturnType<typeof getStats>>) => [
  { label: "Projects", value: stats.projects, icon: FolderOpen, href: "/admin/projects", color: "text-blue-500" },
  { label: "Experiences", value: stats.experiences, icon: Briefcase, href: "/admin/experience", color: "text-violet-500" },
  { label: "Skills", value: stats.skills, icon: Zap, href: "/admin/skills", color: "text-yellow-500" },
  { label: "Contributions", value: stats.contributions, icon: GitMerge, href: "/admin/contributions", color: "text-green-500" },
  {
    label: "Messages",
    value: stats.messages,
    badge: stats.unread > 0 ? `${stats.unread} unread` : undefined,
    icon: MessageSquare,
    href: "/admin/contacts",
    color: "text-orange-500",
  },
];

export default async function DashboardPage() {
  const stats = await getStats();
  const cards = statCards(stats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of your portfolio content
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <a key={card.label} href={card.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer border-border/60 hover:border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold tracking-tight">{card.value}</span>
                    {card.badge && (
                      <Badge variant="destructive" className="mb-0.5 text-xs">
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { label: "Add Project", href: "/admin/projects/new" },
              { label: "Add Experience", href: "/admin/experience/new" },
              { label: "Add Skill", href: "/admin/skills/new" },
              { label: "Edit Hero", href: "/admin/hero" },
              { label: "Site Settings", href: "/admin/settings" },
              { label: "View Messages", href: "/admin/contacts" },
              { label: "Add Contribution", href: "/admin/contributions/new" },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="flex items-center gap-2 rounded-lg border border-border/50 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {action.label}
              </a>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Database", status: "Connected", ok: true },
              { label: "Authentication", status: "Active", ok: true },
              { label: "Cloudinary", status: process.env.CLOUDINARY_API_KEY ? "Configured" : "Not configured", ok: !!process.env.CLOUDINARY_API_KEY },
              { label: "Analytics (Umami)", status: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ? "Configured" : "Not configured", ok: !!process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <Badge variant={item.ok ? "outline" : "secondary"} className={item.ok ? "text-green-600 border-green-600/30 bg-green-50 dark:bg-green-950/20" : ""}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
