"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import {
  ProjectBasicsSection,
  getProjectFormDefaultValues,
  ProjectScheduleSection,
  ProjectTaxonomySection,
} from "@/components/admin/project-form-sections";
import {
  ProjectDetailsSection,
  ProjectMediaSection,
} from "@/components/admin/project-form-content-sections";
import { ProjectFormPreview } from "@/components/admin/project-form-preview";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { projectSchema, type ProjectInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface ProjectFormProps {
  initialData?: ProjectInput & { id: string };
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: getProjectFormDefaultValues(initialData),
  });

  const {
    fields: paragraphs,
    append: appendParagraph,
    remove: removeParagraph,
  } = useFieldArray({
    control: form.control,
    name: "descriptionDetails.paragraphs" as never, // TS workaround for deep paths
  });

  const {
    fields: bullets,
    append: appendBullet,
    remove: removeBullet,
  } = useFieldArray({
    control: form.control,
    name: "descriptionDetails.bullets" as never,
  });

  const {
    fields: imgArr,
    append: appendImg,
    remove: removeImg,
  } = useFieldArray({
    control: form.control,
    name: "pagesInfo.imgArr" as never,
  });

  async function onSubmit(data: ProjectInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit
        ? `/api/admin/projects/${initialData.id}`
        : "/api/admin/projects";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-10">
        <AdminFormShell
          title={initialData ? "Edit Project" : "Create Project"}
          description="Manage the full project story, from basic metadata to detail-page content and gallery assets."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/projects")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Project
              </Button>
            </>
          }
          preview={
            <ProjectFormPreview form={form} galleryCount={imgArr.length} />
          }
        >
          <ProjectBasicsSection form={form} />
          <ProjectScheduleSection form={form} />
          <ProjectTaxonomySection form={form} />
          <ProjectMediaSection
            form={form}
            galleryImages={imgArr}
            appendGalleryImage={appendImg}
            removeGalleryImage={removeImg}
          />
          <ProjectDetailsSection
            form={form}
            paragraphs={paragraphs}
            bullets={bullets}
            appendParagraph={appendParagraph}
            appendBullet={appendBullet}
            removeParagraph={removeParagraph}
            removeBullet={removeBullet}
          />
        </AdminFormShell>
      </form>
    </Form>
  );
}
