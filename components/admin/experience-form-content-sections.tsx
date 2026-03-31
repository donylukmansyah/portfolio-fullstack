"use client";

import type { UseFormReturn } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { FormArrayFieldGroup } from "@/components/admin/form-array-field";
import { TagsInput } from "@/components/admin/tags-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ExperienceInput } from "@/lib/validations";

type FormArrayItem = { id: string };

export function ExperienceDetailsSection({
  form,
  descriptions,
  achievements,
  appendDescription,
  appendAchievement,
  removeDescription,
  removeAchievement,
}: {
  form: UseFormReturn<ExperienceInput>;
  descriptions: FormArrayItem[];
  achievements: FormArrayItem[];
  appendDescription: (value: string) => void;
  appendAchievement: (value: string) => void;
  removeDescription: (index: number) => void;
  removeAchievement: (index: number) => void;
}) {
  return (
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
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="E.g. React"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormArrayFieldGroup
          title="Description Paragraphs"
          items={descriptions}
          addLabel="Add Paragraph"
          onAdd={() => appendDescription("")}
          renderItem={(index, itemId) => (
            <FormField
              key={itemId}
              control={form.control}
              name={`description.${index}`}
              render={({ field }) => (
                <FormItem className="flex gap-2">
                  <FormControl className="flex-1">
                    <Textarea placeholder="Responsibility text..." {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeDescription(index)}
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
          title="Key Achievements"
          items={achievements}
          addLabel="Add Achievement"
          onAdd={() => appendAchievement("")}
          renderItem={(index, itemId) => (
            <FormField
              key={itemId}
              control={form.control}
              name={`achievements.${index}`}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl className="flex-1">
                    <Input placeholder="Achievement..." {...field} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeAchievement(index)}
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
