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
import { skillSchema, type SkillInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface SkillFormProps {
  initialData?: SkillInput & { id: string };
}

export function SkillForm({ initialData }: SkillFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      rating: 1,
      iconKey: "",
      isFeatured: false,
      sortOrder: 0,
    },
  });

  async function onSubmit(data: SkillInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit
        ? `/api/admin/skills/${initialData.id}`
        : "/api/admin/skills";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

      toast({
        title: isEdit ? "Skill updated" : "Skill created",
        description: "Your changes have been saved successfully.",
      });

      router.push("/admin/skills");
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
          title={initialData ? "Edit Skill" : "Create Skill"}
          description="Keep the skill taxonomy consistent, featured flags accurate, and ordering intentional."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/skills")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Skill
              </Button>
            </>
          }
          preview={
            <>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Quick Preview
                </p>
                <h2 className="text-lg font-semibold text-foreground">
                  {form.watch("name") || "Untitled skill"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {form.watch("description") ||
                    "Add a short description to explain what this skill category represents."}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 p-3 text-sm">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <Star className="h-4 w-4 text-primary" />
                  Skill status
                </div>
                <p className="mt-2 text-muted-foreground">
                  Rating {form.watch("rating")} / 5 •{" "}
                  {form.watch("isFeatured") ? "Featured" : "Standard"}
                </p>
              </div>
            </>
          }
        >
          <Card>
            <CardHeader>
              <CardTitle>Skill Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. React" {...field} />
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
                        placeholder="E.g. Frontend, Backend, Tools..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="iconKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon Key</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g. react, nodejs..."
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={5}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
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
                        Highlight this skill on prominent sections.
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
