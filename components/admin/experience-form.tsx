"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import {
  ExperienceBasicsSection,
  ExperienceFormPreview,
  getExperienceFormDefaultValues,
  ExperienceTimelineSection,
} from "@/components/admin/experience-form-sections";
import { ExperienceDetailsSection } from "@/components/admin/experience-form-content-sections";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitAdminForm } from "@/lib/admin-client";
import { experienceSchema, type ExperienceInput } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface ExperienceFormProps {
  initialData?: ExperienceInput & { id: string };
}

export function ExperienceForm({ initialData }: ExperienceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: getExperienceFormDefaultValues(initialData),
  });

  const {
    fields: description,
    append: appendDesc,
    remove: removeDesc,
  } = useFieldArray({
    control: form.control,
    name: "description" as never,
  });

  const {
    fields: achievements,
    append: appendAchievement,
    remove: removeAchievement,
  } = useFieldArray({
    control: form.control,
    name: "achievements" as never,
  });

  async function onSubmit(data: ExperienceInput) {
    setIsLoading(true);
    try {
      const isEdit = !!initialData;
      const url = isEdit
        ? `/api/admin/experience/${initialData.id}`
        : "/api/admin/experience";
      const method = isEdit ? "PUT" : "POST";

      await submitAdminForm(url, method, data);

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pb-10">
        <AdminFormShell
          title={initialData ? "Edit Experience" : "Create Experience"}
          description="Maintain your professional timeline with cleaner sections, clearer status, and a quick preview of what will appear publicly."
          modeLabel={initialData ? "Edit Mode" : "Create Mode"}
          actions={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => router.push("/admin/experience")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Experience
              </Button>
            </>
          }
          preview={
            <ExperienceFormPreview
              form={form}
              descriptionCount={description.length}
              achievementCount={achievements.length}
            />
          }
        >
          <ExperienceBasicsSection form={form} />
          <ExperienceTimelineSection form={form} />
          <ExperienceDetailsSection
            form={form}
            descriptions={description}
            achievements={achievements}
            appendDescription={appendDesc}
            appendAchievement={appendAchievement}
            removeDescription={removeDesc}
            removeAchievement={removeAchievement}
          />
        </AdminFormShell>
      </form>
    </Form>
  );
}
