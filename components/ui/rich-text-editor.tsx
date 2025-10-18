// "use client";

// import { cn } from "@/lib/utils";
// import { useEditor, EditorContent } from "@tiptap/react";
// import Document from "@tiptap/extension-document";
// import Paragraph from "@tiptap/extension-paragraph";
// import Text from "@tiptap/extension-text";
// import Bold from "@tiptap/extension-bold";
// import Italic from "@tiptap/extension-italic";
// import { BulletList } from "@tiptap/extension-list";
// import ListItem from "@tiptap/extension-list-item";
// import { Button } from "@/components/ui/button";
// import { Bold as BoldIcon, Italic as ItalicIcon, List } from "lucide-react";
// import { useEffect } from "react";

// interface RichTextEditorProps {
//   value?: string;
//   onChange?: (content: string) => void;
//   placeholder?: string;
//   className?: string;
// }

// export function RichTextEditor({
//   value = "",
//   onChange,
//   className,
// }: RichTextEditorProps) {
//   const editor = useEditor({
//     extensions: [
//       Document,
//       Paragraph,
//       Text,
//       Bold,
//       Italic,
//       BulletList.configure({
//         HTMLAttributes: {
//           class: "list-disc list-inside",
//         },
//       }),
//       ListItem,
//     ],
//     content: value,
//     immediatelyRender: false,
//     editorProps: {
//       attributes: {
//         class: cn(
//           "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm prose prose-sm max-w-none",
//           className
//         ),
//       },
//     },
//     onUpdate: ({ editor }) => {
//       onChange?.(editor.getHTML());
//     },
//   });

//   useEffect(() => {
//     if (editor && value !== editor.getHTML()) {
//       editor.commands.setContent(value);
//     }
//   }, [value, editor]);

//   if (!editor) {
//     return null;
//   }

//   return (
//     <div className="space-y-2">
//       <div className="flex gap-1 border-b pb-2">
//         <Button
//           type="button"
//           size="sm"
//           variant={editor.isActive("bold") ? "default" : "outline"}
//           onClick={() => editor.chain().focus().toggleBold().run()}
//           title="Bold (Cmd+B)"
//         >
//           <BoldIcon className="h-4 w-4" />
//         </Button>
//         <Button
//           type="button"
//           size="sm"
//           variant={editor.isActive("italic") ? "default" : "outline"}
//           onClick={() => editor.chain().focus().toggleItalic().run()}
//           title="Italic (Cmd+I)"
//         >
//           <ItalicIcon className="h-4 w-4" />
//         </Button>
//         <Button
//           type="button"
//           size="sm"
//           variant={editor.isActive("bulletList") ? "default" : "outline"}
//           onClick={() => editor.chain().focus().toggleBulletList().run()}
//           title="Bullet List (Cmd+Shift+8)"
//         >
//           <List className="h-4 w-4" />
//         </Button>
//       </div>
//       <EditorContent editor={editor} />
//     </div>
//   );
// }

"use client";

import * as React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Toggle } from "./toggle";
import { Separator } from "./separator";
import { Button } from "./button";

interface MinimalTiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

export default function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start typing...",
  editable = true,
  className,
}: MinimalTiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
        link: {
          openOnClick: true,
          enableClickSelection: true,
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none",
          "h-full p-4"
        ),
      },
    },
    immediatelyRender: false,
  });

  // Update editor content when the content prop changes (e.g., from streaming)
  React.useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden flex flex-col",
        className
      )}
    >
      <div className="border-b p-2 flex flex-wrap items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          <List className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>

        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          <Quote className="h-4 w-4" />
        </Toggle>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="ghost"
          type="button"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
}
