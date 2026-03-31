"use client";

import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  Redo2,
  RemoveFormatting,
  Strikethrough,
  Table2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToolbarAction = {
  key: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: (editor: Editor) => boolean;
  onClick: (editor: Editor) => void;
};

function ToolbarButton({
  active = false,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      className={cn(
        "h-9 w-9 rounded-xl border border-transparent",
        active &&
          "border-primary/20 bg-primary/10 text-primary hover:bg-primary/15"
      )}
    >
      {children}
    </Button>
  );
}

function promptForBlogLink(editor: Editor) {
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  const url = window.prompt("Enter a URL", previousUrl || "https://");

  if (url === null) {
    return;
  }

  if (url.trim() === "") {
    editor.chain().focus().unsetLink().run();
    return;
  }

  editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function getToolbarActions(
  editor: Editor,
  onRequestImageUpload: () => void
): ToolbarAction[] {
  return [
    {
      key: "undo",
      title: "Undo",
      icon: Undo2,
      onClick: (instance) => instance.chain().focus().undo().run(),
    },
    {
      key: "redo",
      title: "Redo",
      icon: Redo2,
      onClick: (instance) => instance.chain().focus().redo().run(),
    },
    {
      key: "bold",
      title: "Bold",
      icon: Bold,
      isActive: (instance) => instance.isActive("bold"),
      onClick: (instance) => instance.chain().focus().toggleBold().run(),
    },
    {
      key: "italic",
      title: "Italic",
      icon: Italic,
      isActive: (instance) => instance.isActive("italic"),
      onClick: (instance) => instance.chain().focus().toggleItalic().run(),
    },
    {
      key: "underline",
      title: "Underline",
      icon: UnderlineIcon,
      isActive: (instance) => instance.isActive("underline"),
      onClick: (instance) => instance.chain().focus().toggleUnderline().run(),
    },
    {
      key: "strike",
      title: "Strikethrough",
      icon: Strikethrough,
      isActive: (instance) => instance.isActive("strike"),
      onClick: (instance) => instance.chain().focus().toggleStrike().run(),
    },
    {
      key: "highlight",
      title: "Highlight",
      icon: Highlighter,
      isActive: (instance) => instance.isActive("highlight"),
      onClick: (instance) => instance.chain().focus().toggleHighlight().run(),
    },
    {
      key: "heading-1",
      title: "Heading 1",
      icon: Heading1,
      isActive: (instance) => instance.isActive("heading", { level: 1 }),
      onClick: (instance) =>
        instance.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      key: "heading-2",
      title: "Heading 2",
      icon: Heading2,
      isActive: (instance) => instance.isActive("heading", { level: 2 }),
      onClick: (instance) =>
        instance.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      key: "bullet-list",
      title: "Bullet list",
      icon: List,
      isActive: (instance) => instance.isActive("bulletList"),
      onClick: (instance) => instance.chain().focus().toggleBulletList().run(),
    },
    {
      key: "ordered-list",
      title: "Ordered list",
      icon: ListOrdered,
      isActive: (instance) => instance.isActive("orderedList"),
      onClick: (instance) =>
        instance.chain().focus().toggleOrderedList().run(),
    },
    {
      key: "blockquote",
      title: "Blockquote",
      icon: Quote,
      isActive: (instance) => instance.isActive("blockquote"),
      onClick: (instance) => instance.chain().focus().toggleBlockquote().run(),
    },
    {
      key: "link",
      title: "Add link",
      icon: Link2,
      isActive: (instance) => instance.isActive("link"),
      onClick: (instance) => promptForBlogLink(instance),
    },
    {
      key: "align-left",
      title: "Align left",
      icon: AlignLeft,
      onClick: (instance) => instance.chain().focus().setTextAlign("left").run(),
    },
    {
      key: "align-center",
      title: "Align center",
      icon: AlignCenter,
      onClick: (instance) =>
        instance.chain().focus().setTextAlign("center").run(),
    },
    {
      key: "align-right",
      title: "Align right",
      icon: AlignRight,
      onClick: (instance) =>
        instance.chain().focus().setTextAlign("right").run(),
    },
    {
      key: "table",
      title: "Insert table",
      icon: Table2,
      onClick: (instance) =>
        instance
          .chain()
          .focus()
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
    {
      key: "image",
      title: "Upload image",
      icon: ImagePlus,
      onClick: () => onRequestImageUpload(),
    },
    {
      key: "clear-formatting",
      title: "Clear formatting",
      icon: RemoveFormatting,
      onClick: (instance) =>
        instance.chain().focus().unsetAllMarks().clearNodes().run(),
    },
  ];
}

interface BlogEditorToolbarProps {
  editor: Editor;
  onRequestImageUpload: () => void;
}

export function BlogEditorToolbar({
  editor,
  onRequestImageUpload,
}: BlogEditorToolbarProps) {
  const toolbarActions = getToolbarActions(editor, onRequestImageUpload);

  return (
    <div className="flex flex-wrap gap-2 border-b border-border/60 bg-muted/30 p-3">
      {toolbarActions.map((action) => {
        const Icon = action.icon;

        return (
          <ToolbarButton
            key={action.key}
            title={action.title}
            active={action.isActive?.(editor) ?? false}
            onClick={() => action.onClick(editor)}
          >
            <Icon className="h-4 w-4" />
          </ToolbarButton>
        );
      })}
    </div>
  );
}
