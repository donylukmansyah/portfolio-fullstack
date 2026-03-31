"use client";

import { useEffect, useRef } from "react";
import type { JSONContent } from "@tiptap/core";
import { EditorContent, type Editor, useEditor } from "@tiptap/react";

import { BlogEditorToolbar } from "@/components/admin/blog-editor-toolbar";
import { useToast } from "@/hooks/use-toast";
import { uploadAdminFile } from "@/lib/admin-upload";
import {
  EMPTY_BLOG_CONTENT,
  blogContentExtensions,
} from "@/lib/blog-editor-config";

interface BlogEditorProps {
  value: JSONContent;
  onChange: (value: JSONContent) => void;
}

type ToolbarAction = {
  key: string;
};

function syncEditorContent(editor: Editor, value: JSONContent) {
  const current = JSON.stringify(editor.getJSON());
  const next = JSON.stringify(value || EMPTY_BLOG_CONTENT);

  if (current !== next) {
    editor.commands.setContent(value || EMPTY_BLOG_CONTENT, {
      emitUpdate: false,
    });
  }
}

async function insertBlogImageFromFile(
  editor: Editor,
  file: File,
  toast: ReturnType<typeof useToast>["toast"]
) {
  if (file.size > 10 * 1024 * 1024) {
    toast({
      title: "Upload failed",
      description: "Image size must be less than 10MB.",
      variant: "destructive",
    });
    return;
  }

  try {
    const asset = await uploadAdminFile(file, "portfolio/blogs/body");

    editor
      .chain()
      .focus()
      .setImage({
        src: asset.url,
        alt: file.name,
        title: file.name,
      })
      .run();
  } catch (error: any) {
    toast({
      title: "Upload failed",
      description: error.message,
      variant: "destructive",
    });
  }
}

export function BlogEditor({ value, onChange }: BlogEditorProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const editor = useEditor({
    immediatelyRender: false,
    extensions: blogContentExtensions,
    content: value || EMPTY_BLOG_CONTENT,
    editorProps: {
      attributes: {
        class:
          "blog-editor-input min-h-[420px] px-5 py-4 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON());
    },
  });

  useEffect(() => {
    if (!editor) return;
    syncEditorContent(editor, value);
  }, [editor, value]);

  const handleImageUpload = async (file: File) => {
    if (!editor) return;
    await insertBlogImageFromFile(editor, file, toast);
  };

  if (!editor) {
    return (
      <div className="rounded-2xl border border-border/60 bg-background p-4 text-sm text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
      <BlogEditorToolbar
        editor={editor}
        onRequestImageUpload={() => inputRef.current?.click()}
      />

      <EditorContent editor={editor} className="blog-editor" />

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleImageUpload(file);
          }
          event.target.value = "";
        }}
      />
    </div>
  );
}
