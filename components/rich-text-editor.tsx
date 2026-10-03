"use client";

import { Bold, Italic, Link2, RemoveFormatting, Strikethrough, Underline } from "lucide-react";
import { useRef, useState } from "react";

import { plainTextToRichHtml } from "@/lib/rich-text";

type RichTextEditorProps = {
  html?: string;
  text: string;
  onChange: (html: string, text: string) => void;
};

const formats = [
  { command: "bold", label: "Bold", icon: Bold },
  { command: "italic", label: "Italic", icon: Italic },
  { command: "underline", label: "Underline", icon: Underline },
  { command: "strikeThrough", label: "Strikethrough", icon: Strikethrough },
  { command: "removeFormat", label: "Clear formatting", icon: RemoveFormatting },
] as const;

export function RichTextEditor({ html, text, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [initialHtml] = useState(() => html?.trim() || plainTextToRichHtml(text));

  function emitChange() {
    const editor = editorRef.current;
    if (!editor) return;
    onChange(editor.innerHTML, editor.innerText);
  }

  function rememberSelection() {
    const editor = editorRef.current;
    const selection = window.getSelection();
    if (!editor || !selection?.rangeCount || !editor.contains(selection.anchorNode)) return;
    selectionRef.current = selection.getRangeAt(0).cloneRange();
  }

  function applyFormat(command: string) {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (selectionRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(selectionRef.current);
    }
    document.execCommand(command, false);
    rememberSelection();
    emitChange();
  }

  function applyLink() {
    const editor = editorRef.current;
    if (!editor || !selectionRef.current || selectionRef.current.collapsed) {
      window.alert("Select the text you want to link first.");
      return;
    }

    const enteredUrl = window.prompt("Enter the destination URL", "https://");
    if (enteredUrl === null) return;
    const value = enteredUrl.trim();
    if (!value) return;

    const hasAllowedProtocol = /^(https?:\/\/|mailto:|tel:)/i.test(value);
    const isRelativeUrl = value.startsWith("/") && !value.startsWith("//");
    const hasOtherProtocol = /^[a-z][a-z0-9+.-]*:/i.test(value);
    const linkUrl = hasAllowedProtocol || isRelativeUrl
      ? value
      : hasOtherProtocol
        ? ""
        : `https://${value}`;

    if (!linkUrl) {
      window.alert("Use an HTTPS, HTTP, email, telephone or website-relative link.");
      return;
    }

    editor.focus();
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(selectionRef.current);
    document.execCommand("createLink", false, linkUrl);
    rememberSelection();
    emitChange();
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar" role="toolbar" aria-label="Paragraph formatting">
        {formats.map(({ command, label, icon: Icon }) => (
          <button
            type="button"
            key={command}
            title={label}
            aria-label={label}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => applyFormat(command)}
          >
            <Icon aria-hidden="true" />
          </button>
        ))}
        <button
          type="button"
          title="Link"
          aria-label="Link"
          onMouseDown={(event) => event.preventDefault()}
          onClick={applyLink}
        >
          <Link2 aria-hidden="true" />
        </button>
      </div>
      <div
        ref={editorRef}
        className="rich-editor__surface"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder="Write paragraph…"
        dangerouslySetInnerHTML={{ __html: initialHtml }}
        onInput={emitChange}
        onKeyUp={rememberSelection}
        onMouseUp={rememberSelection}
        onBlur={() => { rememberSelection(); emitChange(); }}
        onPaste={(event) => {
          event.preventDefault();
          document.execCommand("insertText", false, event.clipboardData.getData("text/plain"));
          emitChange();
        }}
      />
    </div>
  );
}
