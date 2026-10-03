"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { CmsImage } from "@/lib/cms-types";

const acceptedImages = "image/jpeg,image/png,image/webp,image/gif,image/avif";

type PendingImage = { file: File; preview: string };

export function GalleryEditor({
  blockId,
  images,
  onChange,
}: {
  blockId: string;
  images: CmsImage[];
  onChange: (images: CmsImage[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<PendingImage[]>([]);
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [newImage, setNewImage] = useState<CmsImage>({ src: "", alt: "", caption: "" });

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(() => () => {
    pendingRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
  }, []);

  function selectFiles(files: FileList | null) {
    pendingRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    const next = Array.from(files || []).map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPending(next);
  }

  function removePending(index: number) {
    const removed = pending[index];
    if (removed) URL.revokeObjectURL(removed.preview);
    const next = pending.filter((_, itemIndex) => itemIndex !== index);
    setPending(next);
    if (!inputRef.current) return;
    if (!next.length) {
      inputRef.current.value = "";
      return;
    }
    const transfer = new DataTransfer();
    next.forEach((item) => transfer.items.add(item.file));
    inputRef.current.files = transfer.files;
  }

  function updateImage(index: number, update: Partial<CmsImage>) {
    onChange(images.map((image, itemIndex) => itemIndex === index ? { ...image, ...update } : image));
  }

  return (
    <div className="gallery-editor">
      <label className="editor-upload editor-upload--gallery">
        <span>Upload multiple images</span>
        <input
          ref={inputRef}
          type="file"
          name={`slideshowUpload:${blockId}`}
          accept={acceptedImages}
          multiple
          onChange={(event) => selectFiles(event.currentTarget.files)}
        />
        <small>Select all desired images in the file window. They will be added when you save.</small>
      </label>

      {pending.length ? (
        <section className="gallery-editor__section" aria-label="Images waiting to upload">
          <div className="gallery-editor__heading"><strong>Ready to upload</strong><span>{pending.length} images</span></div>
          <div className="gallery-editor__grid">
            {pending.map((item, index) => (
              <article className="gallery-editor__item" key={`${item.file.name}-${item.file.lastModified}`}>
                <img src={item.preview} alt="" />
                <div><strong title={item.file.name}>{item.file.name}</strong><small>{Math.max(1, Math.round(item.file.size / 1024))} KB</small></div>
                <button type="button" onClick={() => removePending(index)} aria-label={`Remove ${item.file.name}`}><Trash2 /> Remove</button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {images.length ? (
        <section className="gallery-editor__section" aria-label="Current gallery images">
          <div className="gallery-editor__heading"><strong>Current gallery</strong><span>{images.length} images</span></div>
          <div className="gallery-editor__grid">
            {images.map((image, index) => (
              <article className="gallery-editor__item gallery-editor__item--saved" key={`${image.src}-${index}`}>
                <img src={image.src} alt={image.alt} />
                <div className="gallery-editor__fields">
                  <label>Alternative text<input value={image.alt} onChange={(event) => updateImage(index, { alt: event.target.value })} /></label>
                  <label>Caption<input value={image.caption || ""} onChange={(event) => updateImage(index, { caption: event.target.value })} /></label>
                </div>
                <button type="button" onClick={() => onChange(images.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove image ${index + 1}`}><Trash2 /> Remove</button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <details className="gallery-editor__url">
        <summary><ImagePlus /> Add an existing image URL</summary>
        <div>
          <label>Image URL<input value={newImage.src} onChange={(event) => setNewImage({ ...newImage, src: event.target.value })} placeholder="/media/image.jpg or https://…" /></label>
          <label>Alternative text<input value={newImage.alt} onChange={(event) => setNewImage({ ...newImage, alt: event.target.value })} /></label>
          <label>Caption<input value={newImage.caption || ""} onChange={(event) => setNewImage({ ...newImage, caption: event.target.value })} /></label>
          <button
            type="button"
            className="admin-button"
            disabled={!newImage.src.trim()}
            onClick={() => {
              onChange([...images, { ...newImage, src: newImage.src.trim() }]);
              setNewImage({ src: "", alt: "", caption: "" });
            }}
          >
            Add image
          </button>
        </div>
      </details>
    </div>
  );
}
