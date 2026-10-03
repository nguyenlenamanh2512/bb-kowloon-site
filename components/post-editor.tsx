"use client";

import {
  ChevronDown,
  ChevronUp,
  Images,
  List,
  MessageSquareQuote,
  Plus,
  Text,
  Trash2,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { savePostAction } from "@/app/admin/actions";
import { FeaturedImageEditor } from "@/components/featured-image-editor";
import { GalleryEditor } from "@/components/gallery-editor";
import { RichTextEditor } from "@/components/rich-text-editor";
import { contentTypeLabels, type CmsPost, type ContentBlock } from "@/lib/cms-types";

function id() {
  return globalThis.crypto?.randomUUID?.() || `block-${Date.now()}-${Math.random()}`;
}

function emptyBlock(type: ContentBlock["type"]): ContentBlock {
  if (type === "heading") return { id: id(), type, level: 2, text: "" };
  if (type === "paragraph") return { id: id(), type, text: "" };
  if (type === "quote") return { id: id(), type, text: "", citation: "" };
  if (type === "list") return { id: id(), type, items: [""] };
  if (type === "image") return { id: id(), type: "slideshow", images: [] };
  if (type === "youtube") return { id: id(), type, url: "", caption: "" };
  return { id: id(), type: "slideshow", images: [] };
}

function editableBlock(block: ContentBlock): ContentBlock {
  if (block.type !== "image") return block;
  return {
    id: block.id,
    type: "slideshow",
    images: block.src ? [{ src: block.src, alt: block.alt, caption: block.caption }] : [],
  };
}

function dateInputValue(value?: string) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString().slice(0, 10) : date.toISOString().slice(0, 10);
}

export function PostEditor({ post, error }: { post?: CmsPost; error?: string }) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(post?.blocks.map(editableBlock) || [emptyBlock("paragraph")]);
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(post?.featuredImageAlt || "");

  function replaceBlock(index: number, block: ContentBlock) {
    setBlocks((current) => current.map((item, itemIndex) => itemIndex === index ? block : item));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    setBlocks((current) => {
      const destination = index + direction;
      if (destination < 0 || destination >= current.length) return current;
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
  }

  return (
    <form action={savePostAction} className="post-editor">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="blocksJson" value={JSON.stringify(blocks)} />
      {error ? <p className="admin-alert admin-alert--error">{error}</p> : null}

      <div className="post-editor__topbar">
        <div>
          <p className="admin-kicker">Block editor</p>
          <h1>{post ? "Edit content" : "Create content"}</h1>
        </div>
        <div className="post-editor__publish">
          <select name="status" defaultValue={post?.status || "published"} aria-label="Publication status">
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <Link href="/admin" className="admin-button admin-button--secondary">
            <X /> Cancel
          </Link>
          <button className="admin-button admin-button--primary" type="submit">
            {post ? "Save changes" : "Publish content"}
          </button>
        </div>
      </div>

      <div className="post-editor__layout">
        <div className="post-editor__canvas">
          <label className="editor-title">
            <span>Title</span>
            <input name="title" defaultValue={post?.title} required placeholder="Add title" />
          </label>
          <label>
            Summary
            <textarea name="summary" defaultValue={post?.summary} required rows={3} placeholder="Short introduction used on the Cargo & Projects page" />
          </label>

          <div className="block-list">
            {blocks.map((block, index) => (
              <article className="editor-block" key={block.id}>
                <div className="editor-block__header">
                  <span>{block.type}</span>
                  <div>
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} aria-label="Move block up"><ChevronUp /></button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === blocks.length - 1} aria-label="Move block down"><ChevronDown /></button>
                    <button type="button" onClick={() => setBlocks((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label="Delete block"><Trash2 /></button>
                  </div>
                </div>

                {block.type === "heading" ? (
                  <div className="editor-block__split">
                    <select value={block.level} onChange={(event) => replaceBlock(index, { ...block, level: Number(event.target.value) === 3 ? 3 : 2 })} aria-label="Heading level">
                      <option value={2}>Heading 2</option><option value={3}>Heading 3</option>
                    </select>
                    <input value={block.text} onChange={(event) => replaceBlock(index, { ...block, text: event.target.value })} placeholder="Heading text" />
                  </div>
                ) : null}
                {block.type === "paragraph" ? (
                  <RichTextEditor
                    text={block.text}
                    html={block.html}
                    onChange={(html, text) => replaceBlock(index, { ...block, html, text })}
                  />
                ) : null}
                {block.type === "quote" ? (
                  <div className="editor-block__stack"><textarea rows={4} value={block.text} onChange={(event) => replaceBlock(index, { ...block, text: event.target.value })} placeholder="Quote" /><input value={block.citation || ""} onChange={(event) => replaceBlock(index, { ...block, citation: event.target.value })} placeholder="Citation" /></div>
                ) : null}
                {block.type === "list" ? <textarea rows={5} value={block.items.join("\n")} onChange={(event) => replaceBlock(index, { ...block, items: event.target.value.split("\n") })} placeholder="One list item per line" /> : null}
                {block.type === "youtube" ? (
                  <div className="editor-block__stack"><input value={block.url} onChange={(event) => replaceBlock(index, { ...block, url: event.target.value })} placeholder="https://www.youtube.com/watch?v=…" /><input value={block.caption || ""} onChange={(event) => replaceBlock(index, { ...block, caption: event.target.value })} placeholder="Caption (optional)" /></div>
                ) : null}
                {block.type === "slideshow" ? (
                  <GalleryEditor
                    blockId={block.id}
                    images={block.images}
                    onChange={(images) => replaceBlock(index, { ...block, images })}
                  />
                ) : null}
              </article>
            ))}
          </div>

          <div className="block-inserter">
            <span><Plus size={18} /> Add block</span>
            <button type="button" onClick={() => setBlocks((current) => [...current, emptyBlock("heading")])}><Text /> Heading</button>
            <button type="button" onClick={() => setBlocks((current) => [...current, emptyBlock("paragraph")])}><Text /> Paragraph</button>
            <button type="button" onClick={() => setBlocks((current) => [...current, emptyBlock("quote")])}><MessageSquareQuote /> Quote</button>
            <button type="button" onClick={() => setBlocks((current) => [...current, emptyBlock("list")])}><List /> List</button>
            <button type="button" onClick={() => setBlocks((current) => [...current, emptyBlock("youtube")])}><Video /> YouTube</button>
            <button type="button" onClick={() => setBlocks((current) => [...current, emptyBlock("slideshow")])}><Images /> Slideshow</button>
          </div>
        </div>

        <aside className="post-editor__sidebar">
          <h2>Content settings</h2>
          <label>Type<select name="type" defaultValue={post?.type || "product"}>{Object.entries(contentTypeLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label>Category<input name="category" defaultValue={post?.category} required placeholder="Project cargo" /></label>
          <label>Slug<input name="slug" defaultValue={post?.slug} placeholder="Generated from title" /></label>
          <label>Publication date<input name="publishedAt" type="date" defaultValue={dateInputValue(post?.publishedAt || post?.createdAt)} required /></label>
          <FeaturedImageEditor
            image={featuredImage}
            alternativeText={featuredImageAlt}
            onImageChange={setFeaturedImage}
            onAlternativeTextChange={setFeaturedImageAlt}
          />
          <details open>
            <summary>Operation details</summary>
            <label>Cargo<input name="cargo" defaultValue={post?.cargo} /></label>
            <label>Route<input name="route" defaultValue={post?.route} /></label>
            <label>Client<input name="client" defaultValue={post?.client} /></label>
            <label>Specification<input name="specification" defaultValue={post?.specification} /></label>
            <label>Scope<textarea name="scope" defaultValue={post?.scope} rows={3} /></label>
          </details>
        </aside>
      </div>
    </form>
  );
}
