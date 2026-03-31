"use client";

import type { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { FormArrayFieldGroup } from "@/components/admin/form-array-field";
import { ImageUpload } from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ProjectInput } from "@/lib/validations";

type FormArrayItem = { id: string };

export function ProjectMediaSection({
  form,
  galleryImages,
  appendGalleryImage,
  removeGalleryImage,
}: {
  form: UseFormReturn<ProjectInput>;
  galleryImages: FormArrayItem[];
  appendGalleryImage: (value: string) => void;
  removeGalleryImage: (index: number) => void;
}) {
  return (
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
                <ImageUpload
                  value={field.value || ""}
                  onChange={field.onChange}
                  folder="portfolio/projects/logos"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormArrayFieldGroup
          title="Project Gallery Images"
          items={galleryImages}
          addLabel="Add Image"
          onAdd={() => appendGalleryImage("")}
          renderItem={(index, itemId) => (
            <FormField
              key={itemId}
              control={form.control}
              name={`pagesInfo.imgArr.${index}`}
              render={({ field }) => (
                <FormItem className="flex items-end gap-2">
                  <div className="flex-1">
                    <ImageUpload
                      value={field.value || ""}
                      onChange={field.onChange}
                      folder="portfolio/projects/gallery"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}

export function ProjectDetailsSection({
  form,
  paragraphs,
  bullets,
  appendParagraph,
  appendBullet,
  removeParagraph,
  removeBullet,
}: {
  form: UseFormReturn<ProjectInput>;
  paragraphs: FormArrayItem[];
  bullets: FormArrayItem[];
  appendParagraph: (value: string) => void;
  appendBullet: (value: string) => void;
  removeParagraph: (index: number) => void;
  removeBullet: (index: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Description</CardTitle>
        <CardDescription>Content for the project detail page.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="pagesInfo.title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Page Title</FormLabel>
                <FormControl>
                  <Input placeholder="Detailed page title..." {...field} />
                </FormControl>
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
                <FormControl>
                  <Textarea placeholder="Overview description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormArrayFieldGroup
          title="Paragraphs"
          items={paragraphs}
          addLabel="Add Paragraph"
          onAdd={() => appendParagraph("")}
          renderItem={(index, itemId) => (
            <FormField
              key={itemId}
              control={form.control}
              name={`descriptionDetails.paragraphs.${index}`}
              render={({ field }) => (
                <FormItem className="flex gap-2">
                  <FormControl className="flex-1">
                    <Textarea placeholder="Paragraph text..." {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeParagraph(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />
        <FormArrayFieldGroup
          title="Bullet Points"
          items={bullets}
          addLabel="Add Bullet Point"
          onAdd={() => appendBullet("")}
          renderItem={(index, itemId) => (
            <FormField
              key={itemId}
              control={form.control}
              name={`descriptionDetails.bullets.${index}`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl className="flex-1">
                    <Input placeholder="Key achievement or feature..." {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeBullet(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />
      </CardContent>
    </Card>
  );
}
