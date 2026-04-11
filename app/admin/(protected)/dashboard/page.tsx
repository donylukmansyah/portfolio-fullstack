import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import {
  projects,
  experiences,
  skills,
  certificates,
  contactSubmissions,
  siteSettings,
} from "@/db/schema";
import { count, desc, eq } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/page-header";
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
  ArrowRight,
  Clock3,
  SquarePen,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

async function getStats() {
  const [
    [projectCount],
    [experienceCount],
    [skillCount],
    [certificateCount],
    [messageCount],
    [unreadCount],
    latestProjects,
    latestMessages,
  ] = await Promise.all([
    db.select({ count: count() }).from(projects),
    db.select({ count: count() }).from(experiences),
    db.select({ count: count() }).from(skills),
    db.select({ count: count() }).from(certificates),
    db.select({ count: count() }).from(contactSubmissions),
    db.select({ count: count() }).from(contactSubmissions).where(eq(contactSubmissions.isRead, false)),
    db
      .select({
        id: projects.id,
        title: projects.companyName,
        slug: projects.slug,
        createdAt: projects.createdAt,
      })
      .from(projects)
      .orderBy(desc(projects.createdAt))
      .limit(4),
    db
      .select({
        id: contactSubmissions.id,
        title: contactSubmissions.name,
        subtitle: contactSubmissions.email,
        isRead: contactSubmissions.isRead,
        createdAt: contactSubmissions.createdAt,
      })
      .from(contactSubmissions)
      .orderBy(desc(contactSubmissions.createdAt))
      .limit(4),
  ]);

  return {
    projects: projectCount.count,
    experiences: experienceCount.count,
    skills: skillCount.count,
    certificates: certificateCount.count,
    messages: messageCount.count,
    unread: unreadCount.count,
    latestProjects,
    latestMessages,
  };
}

const statCards = (stats: Awaited<ReturnType<typeof getStats>>) => [
  { label: "Projects", value: stats.projects, icon: FolderOpen, href: "/admin/projects", color: "text-blue-500" },
  { label: "Experiences", value: stats.experiences, icon: Briefcase, href: "/admin/experience", color: "text-violet-500" },
  { label: "Skills", value: stats.skills, icon: Zap, href: "/admin/skills", color: "text-yellow-500" },
  { label: "Certificates", value: stats.certificates, icon: GitMerge, href: "/admin/certificates", color: "text-green-500" },
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
      <AdminPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Monitor content health, jump into common admin tasks, and keep the portfolio updated without digging through multiple pages."
        badge={stats.unread > 0 ? `${stats.unread} unread messages` : "Inbox clear"}
        actions={
          <Link
            href="/admin/projects/new"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            <SquarePen className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        }
      />

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href}>
              <Card className="cursor-pointer border-border/60 bg-background/90 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
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
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[
              { label: "Add Project", href: "/admin/projects/new" },
              { label: "Add Experience", href: "/admin/experience/new" },
              { label: "Add Skill", href: "/admin/skills/new" },
              { label: "Edit Hero", href: "/admin/hero" },
              { label: "Site Settings", href: "/admin/settings" },
              { label: "View Messages", href: "/admin/contacts" },
              { label: "Add Certificate", href: "/admin/certificates/new" },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex items-center justify-between rounded-xl border border-border/50 px-3 py-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span>{action.label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-primary" />
              Recent Projects
            </CardTitle>
            <Link href="/admin/projects" className="text-sm text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.latestProjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">No project records yet.</p>
            ) : (
              stats.latestProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium text-foreground">{project.title}</p>
                    <p className="text-sm text-muted-foreground">/{project.slug}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Inbox Snapshot
            </CardTitle>
            <Link href="/admin/contacts" className="text-sm text-primary hover:underline">
              Open inbox
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.latestMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No incoming messages yet.</p>
            ) : (
              stats.latestMessages.map((message) => (
                <Link
                  key={message.id}
                  href="/admin/contacts"
                  className="flex items-center justify-between rounded-xl border border-border/50 px-4 py-3 transition-colors hover:bg-accent"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{message.title}</p>
                      {!message.isRead ? <Badge variant="destructive">Unread</Badge> : null}
                    </div>
                    <p className="text-sm text-muted-foreground">{message.subtitle}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(message.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
