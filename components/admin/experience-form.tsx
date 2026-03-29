"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImageUpload } from "@/components/admin/image-upload";
import { TagsInput } from "@/components/admin/tags-input";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface ExperienceFormProps {
  initialData?: ExperienceInput & { id: string };
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: initialData || {
      slug: "",
      position: "",
      company: "",
      location: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: null,
      isCurrent: false,
      description: [""],
      achievements: [""],
      skills: [],
      companyUrl: "",
      logo: "",
      sortOrder: 0,
    },
  });

  const { fields: description, append: appendDesc, remove: removeDesc } = useFieldArray({
    control: form.control,
    name: "description" as never,
  });

  const { fields: achievements, append: appendAchievement, remove: removeAchievement } = useFieldArray({
    control: form.control,
    name: "achievements" as never,
  });

  async function onSubmit(data: ExperienceInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit ? `/api/admin/experience/${initialData.id}` : "/api/admin/experience";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error ? JSON.stringify(errorData.error) : "Something went wrong");
      }

      toast({
        title: isEdit ? "Experience updated" : "Experience created",
        description: "Your changes have been saved successfully.",
      });

      router.push("/admin/experience");
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

  const isCurrent = form.watch("isCurrent");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-10">
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/experience")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Experience
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl><Input placeholder="E.g. Acme Corp" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position / Role</FormLabel>
                  <FormControl><Input placeholder="E.g. Senior Developer" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl><Input placeholder="acme-corp-senior-dev" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="E.g. Remote, NY" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="companyUrl"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Company Website Link</FormLabel>
                   <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Timeline & Media</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="isCurrent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Current Role</FormLabel>
                    <div className="text-sm text-muted-foreground">Is this your current position?</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={(val) => {
                      field.onChange(val);
                      if (val) form.setValue("endDate", null);
                    }} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isCurrent && (
               <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl><Input type="date" value={field.value || ""} onChange={field.onChange} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
             <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logo"
              render={({ field }) => (
                <FormItem className="md:col-span-2 mt-4">
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value || ""} onChange={field.onChange} folder="portfolio/experience/logos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Details & Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills Used</FormLabel>
                  <FormControl>
                    <TagsInput value={field.value || []} onChange={field.onChange} placeholder="E.g. React" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4 border-t">
              <div className="text-sm font-medium">Description Paragraphs</div>
              {description.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`description.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormControl className="flex-1">
                        <Textarea placeholder="Responsibility text..." {...field} />
                      </FormControl>
                      <Button type="button" variant="destructive" size="icon" className="mt-0" onClick={() => removeDesc(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendDesc("")}>
                <Plus className="mr-2 h-4 w-4" /> Add Paragraph
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="text-sm font-medium">Key Achievements</div>
              {achievements.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`achievements.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl className="flex-1">
                        <Input placeholder="Achievement..." {...field} />
                      </FormControl>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeAchievement(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendAchievement("")}>
                <Plus className="mr-2 h-4 w-4" /> Add Achievement
              </Button>
            </div>
            
          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/experience")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Experience
          </Button>
        </div>
      </form>
    </Form>
  );
}
