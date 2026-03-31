"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

interface FormArrayFieldGroupProps {
  title: string;
  addLabel: string;
  items: { id: string }[];
  onAdd: () => void;
  renderItem: (index: number, itemId: string) => React.ReactNode;
}

export function FormArrayFieldGroup({
  title,
  addLabel,
  items,
  onAdd,
  renderItem,
}: FormArrayFieldGroupProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <div className="text-sm font-medium">{title}</div>
      {items.map((item, index) => renderItem(index, item.id))}
      <Button type="button" variant="outline" size="sm" onClick={onAdd}>
        <Plus className="mr-2 h-4 w-4" /> {addLabel}
      </Button>
    </div>
  );
}
