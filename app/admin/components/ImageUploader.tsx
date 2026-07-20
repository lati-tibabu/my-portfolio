"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../lib/constants";
import { inputClass, labelClass } from "../lib/constants";

type ImageUploaderProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  imageUrl: string;
  onImageUrlChange: (url: string) => void;
  title: string;
  description: string;
};

export default function ImageUploader({
  file,
  onFileChange,
  imageUrl,
  onImageUrlChange,
  title,
  description,
}: ImageUploaderProps) {
  const [previewObjectUrl, setPreviewObjectUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewObjectUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewObjectUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="grid gap-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <label className={labelClass}>
          Upload an image file
          <input
            className={inputClass}
            type="file"
            accept="image/*"
            onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
          />
        </label>
        <label className={labelClass}>
          Image URL fallback
          <input
            className={inputClass}
            value={imageUrl}
            onChange={(event) => onImageUrlChange(event.target.value)}
          />
        </label>
        <p className="text-xs text-[var(--color-on-surface-variant)]">
          Upload is used first. URL fallback is used when no file is selected.
        </p>
      </div>
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
          Preview
        </p>
        <div className="overflow-hidden rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)]">
          <div className="relative aspect-[16/10] bg-[var(--color-surface-container)]">
            <Image
              src={
                previewObjectUrl ||
                imageUrl.trim() ||
                DEFAULT_PLACEHOLDER_IMAGE
              }
              alt={title || "Graphics preview image"}
              fill
              sizes="(min-width: 1024px) 360px, 100vw"
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="space-y-2 p-3">
            <p className="text-sm font-semibold text-[var(--color-on-surface)]">
              {title || "Untitled graphic"}
            </p>
            <p className="line-clamp-3 text-xs text-[var(--color-on-surface-variant)]">
              {description || "Add a short description for better gallery context."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
