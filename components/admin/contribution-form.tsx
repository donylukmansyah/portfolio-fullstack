"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { contributionSchema, type ContributionInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ContributionFormProps {
  initialData?: ContributionInput & { id: string };
}

export function ContributionForm({ initialData }: ContributionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ContributionInput>({
    resolver: zodResolver(contributionSchema),
    defaultValues: initialData || {
      repo: "",
      description: "",
      repoOwner: "",
      link: "",
      isFeatured: false,
      sortOrder: 0,
    },
  });

  async function onSubmit(data: ContributionInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit
        ? `/api/admin/contributions/${initialData.id}`
        : "/api/admin/contributions";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

      toast({
        title: isEdit ? "Contribution updated" : "Contribution added",
        description: "Your changes have been saved successfully.",
      });

      router.push("/admin/contributions");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminFormShell
          title={initialData ? "Edit Contribution" : "Create Contribution"}
          description="Track repository contributions with cleaner metadata, stronger featured controls, and quick outbound verification."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/contributions")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Contribution
              </Button>
            </>
          }
          preview={
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Preview
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  {form.watch("repoOwner") || "owner"}/
                  {form.watch("repo") || "repository"}
                </h2>
                <p className="text-muted-foreground">
                  {form.watch("description") ||
                    "Add a short description to summarize the contribution."}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Visibility
                </div>
                <p className="mt-2 text-muted-foreground">
                  {form.watch("isFeatured")
                    ? "Featured contribution"
                    : "Standard contribution"}
                </p>
              </div>
              {form.watch("link") ? (
                <a
                  href={form.watch("link")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Open contribution link
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Contribution Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="repo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. next.js" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repoOwner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repository Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. vercel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="What did you contribute?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contribution Link</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Featured</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Highlight this contribution in key showcase sections.
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sortOrder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </AdminFormShell>
      </form>
    </Form>
  );
}
