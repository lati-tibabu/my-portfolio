"use client";

import React, { useState } from "react";
import Image from "next/image";
import DialogModal from "./DialogModal";

type GraphicImage = { src: string; alt: string };

type GraphicsGalleryProps = {
  images: GraphicImage[];
};

export default function GraphicsGallery({ images }: GraphicsGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GraphicImage | null>(null);

  return (
    <>
      <section className="px-6 pb-20">
        <div className="max-w-[1100px] mx-auto columns-2 sm:columns-3 md:columns-4 gap-4">
          {images.map((img) => (
            <button
              type="button"
              key={img.src}
              className="mb-4 w-full overflow-hidden rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] transition hover:shadow-[0_20px_25px_-5px_rgba(15,23,42,0.08)]"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={600}
                height={800}
                className="w-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      <DialogModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)}>
        {selectedImage && (
          <Image
            className="max-w-full max-h-[70vh] mx-auto rounded-lg"
            src={selectedImage.src}
            alt={selectedImage.alt}
            width={900}
            height={900}
            style={{ objectFit: "contain" }}
          />
        )}
      </DialogModal>
    </>
  );
}
