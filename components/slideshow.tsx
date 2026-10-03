"use client";

import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { useEffect, useState } from "react";

export type Slide = { src: string; alt: string; caption?: string };

export function Slideshow({ images }: { images: Slide[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const previous = () => setActive((value) => (value - 1 + images.length) % images.length);
  const next = () => setActive((value) => (value + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") setActive((value) => (value - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActive((value) => (value + 1) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, images.length]);

  if (!images.length) return null;
  const image = images[active];

  return (
    <div className={`media-gallery${images.length === 1 ? " media-gallery--single" : ""}`} aria-label="Image gallery">
      <div className="media-gallery__grid">
        {images.map((slide, index) => (
          <button
            type="button"
            key={`${slide.src}-${index}`}
            onClick={() => { setActive(index); setOpen(true); }}
            aria-label={`Open image ${index + 1} of ${images.length}`}
          >
            <img src={slide.src} alt={slide.alt} loading="lazy" />
            <span><ZoomIn aria-hidden="true" /> View</span>
          </button>
        ))}
      </div>
      {open ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image slideshow" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
          <button type="button" className="lightbox__close" onClick={() => setOpen(false)} aria-label="Close slideshow"><X /></button>
          {images.length > 1 ? <button type="button" className="lightbox__previous" onClick={previous} aria-label="Previous image"><ChevronLeft /></button> : null}
          <figure>
            <img src={image.src} alt={image.alt} />
            <figcaption><span>{image.caption || image.alt}</span><strong>{active + 1} / {images.length}</strong></figcaption>
          </figure>
          {images.length > 1 ? <button type="button" className="lightbox__next" onClick={next} aria-label="Next image"><ChevronRight /></button> : null}
        </div>
      ) : null}
    </div>
  );
}
