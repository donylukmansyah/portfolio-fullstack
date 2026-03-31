import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/db";
import { heroContent } from "@/db/schema";
import { desc } from "drizzle-orm";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Home } from "lucide-react";
import { HeroDeleteButton } from "./hero-delete-button";

export const metadata: Metadata = { title: "Hero Content" };

async function getHeroEntries() {
  return db.select().from(heroContent).orderBy(desc(heroContent.createdAt));
}

export default async function HeroAdminPage() {
  const entries = await getHeroEntries();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Homepage"
        title="Hero Content"
        description="Manage the primary homepage hero section. Only one hero entry should be active at any time."
        badge={`${entries.filter((entry) => entry.isActive).length} active`}
        actions={
          <Link href="/admin/hero/new">
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Hero
            </Button>
          </Link>
        }
      />

      {entries.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Home className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-1">No hero content yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
              Create your first hero content to display on the homepage. The default placeholder text will be shown until you add active content.
            </p>
            <Link href="/admin/hero/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" /> Create First Hero
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className={`border-border/60 transition-all ${
                entry.isActive
                  ? "ring-2 ring-primary/30 border-primary/50 bg-primary/5"
                  : ""
              }`}
            >
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{entry.name}</CardTitle>
                    {entry.isActive && (
                      <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {entry.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/hero/${entry.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                    </Button>
                  </Link>
                  <HeroDeleteButton id={entry.id} name={entry.name} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {entry.description}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-3">
                  Created: {new Date(entry.createdAt).toLocaleDateString()} · Updated: {new Date(entry.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
