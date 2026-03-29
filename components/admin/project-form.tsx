"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface ProjectFormProps {
  initialData?: ProjectInput & { id: string };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      slug: "",
      companyName: "",
      type: "Personal",
      category: [],
      shortDescription: "",
      websiteLink: "",
      githubLink: "",
      techStack: [],
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      companyLogoImg: "",
      descriptionDetails: {
        paragraphs: [""],
        bullets: [""],
      },
      pagesInfo: {
        title: "",
        description: "",
        imgArr: [""],
      },
      isFeatured: false,
      sortOrder: 0,
    },
  });

  const { fields: paragraphs, append: appendParagraph, remove: removeParagraph } = useFieldArray({
    control: form.control,
    name: "descriptionDetails.paragraphs" as never, // TS workaround for deep paths
  });

  const { fields: bullets, append: appendBullet, remove: removeBullet } = useFieldArray({
    control: form.control,
    name: "descriptionDetails.bullets" as never,
  });

  const { fields: imgArr, append: appendImg, remove: removeImg } = useFieldArray({
    control: form.control,
    name: "pagesInfo.imgArr" as never,
  });

  async function onSubmit(data: ProjectInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit ? `/api/admin/projects/${initialData.id}` : "/api/admin/projects";
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
        title: isEdit ? "Project updated" : "Project created",
        description: "Your changes have been saved successfully.",
      });

      router.push("/admin/projects");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl pb-10">
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Project
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl><Input placeholder="E.g. E-commerce App" {...field} /></FormControl>
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
                  <FormControl><Input placeholder="e-commerce-app" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Professional">Professional</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured</FormLabel>
                    <div className="text-sm text-muted-foreground">Display this project prominently.</div>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Short Description</FormLabel>
                  <FormControl><Textarea placeholder="Brief summary of the project..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Links & Dates</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="websiteLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website Link</FormLabel>
                  <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Link</FormLabel>
                  <FormControl><Input placeholder="https://github.com/..." {...field} /></FormControl>
                  <FormMessage />
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
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
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
                    <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories & Tech Stack</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <FormControl>
                    <TagsInput value={field.value || []} onChange={field.onChange} placeholder="E.g. Fullstack" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tech Stack</FormLabel>
                  <FormControl>
                    <TagsInput value={field.value || []} onChange={field.onChange} placeholder="E.g. React" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="companyLogoImg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Logo</FormLabel>
                  <FormControl>
                    <ImageUpload value={field.value || ""} onChange={field.onChange} folder="portfolio/projects/logos" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <div className="text-sm font-medium">Project Gallery Images</div>
              {imgArr.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`pagesInfo.imgArr.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex items-end gap-2">
                      <div className="flex-1">
                         <ImageUpload value={field.value || ""} onChange={field.onChange} folder="portfolio/projects/gallery" />
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeImg(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendImg("")}>
                <Plus className="mr-2 h-4 w-4" /> Add Image
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Description</CardTitle>
            <CardDescription>Content for the project detail page.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="pagesInfo.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Title</FormLabel>
                    <FormControl><Input placeholder="Detailed page title..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pagesInfo.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Description</FormLabel>
                    <FormControl><Textarea placeholder="Overview description..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <div className="text-sm font-medium">Paragraphs</div>
              {paragraphs.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`descriptionDetails.paragraphs.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex gap-2">
                      <FormControl className="flex-1">
                        <Textarea placeholder="Paragraph text..." {...field} />
                      </FormControl>
                      <Button type="button" variant="destructive" size="icon" className="mt-0" onClick={() => removeParagraph(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendParagraph("")}>
                <Plus className="mr-2 h-4 w-4" /> Add Paragraph
              </Button>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="text-sm font-medium">Bullet Points</div>
              {bullets.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`descriptionDetails.bullets.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl className="flex-1">
                        <Input placeholder="Key achievement or feature..." {...field} />
                      </FormControl>
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeBullet(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => appendBullet("")}>
                <Plus className="mr-2 h-4 w-4" /> Add Bullet Point
              </Button>
            </div>

          </CardContent>
        </Card>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/projects")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
