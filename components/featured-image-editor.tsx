"use client";

import { ImagePlus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const acceptedImages = "image/jpeg,image/png,image/webp,image/gif,image/avif";

export function FeaturedImageEditor({
  image,
  alternativeText,
  onImageChange,
  onAlternativeTextChange,
}: {
  image: string;
  alternativeText: string;
  onImageChange: (value: string) => void;
  onAlternativeTextChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef("");
  const [uploadPreview, setUploadPreview] = useState("");

  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  function clearUpload() {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = "";
    setUploadPreview("");
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeImage() {
    clearUpload();
    onImageChange("");
    onAlternativeTextChange("");
  }

  const preview = uploadPreview || image;

  return (
    <div className="featured-image-editor">
      <input type="hidden" name="featuredImage" value={image} />
      {preview ? (
        <figure>
          <img src={preview} alt="" />
          <button type="button" onClick={removeImage}><Trash2 /> Remove featured image</button>
        </figure>
      ) : (
        <div className="featured-image-editor__empty"><ImagePlus /><span>No featured image</span></div>
      )}
      <label className="editor-upload">
        <span>Upload featured image</span>
        <input
          ref={inputRef}
          name="featuredImageUpload"
          type="file"
          accept={acceptedImages}
          onChange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (!file) return;
            if (previewRef.current) URL.revokeObjectURL(previewRef.current);
            const nextPreview = URL.createObjectURL(file);
            previewRef.current = nextPreview;
            setUploadPreview(nextPreview);
            if (!alternativeText.trim()) onAlternativeTextChange(file.name.replace(/\.[^.]+$/, ""));
          }}
        />
      </label>
      <label>
        Image alternative text
        <input
          name="featuredImageAlt"
          value={alternativeText}
          onChange={(event) => onAlternativeTextChange(event.target.value)}
          required={Boolean(preview)}
          placeholder="Describe the image"
        />
        <small>This text is used for accessibility and is also shown as the image caption.</small>
      </label>
      <details className="featured-image-editor__url">
        <summary>Advanced: use an image URL</summary>
        <label>
          Featured image URL
          <input
            value={image}
            onChange={(event) => {
              clearUpload();
              onImageChange(event.target.value);
            }}
            placeholder="/media/image.jpg or https://…"
          />
        </label>
      </details>
    </div>
  );
}
