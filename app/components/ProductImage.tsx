"use client";
import Image from "next/image";
import { useState } from "react";
import { FiBox } from "react-icons/fi";

export default function ProductImage({
  src,
  name,
  sizes = "(min-width: 1024px) 400px, 90vw",
}: {
  src?: string;
  name: string;
  sizes?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string>();
  return src?.trim() && failedSrc !== src && !src.includes("placehold.co") ? (
    <Image
      src={src}
      alt={`${name} preview`}
      fill
      sizes={sizes}
      className="object-contain p-3"
      unoptimized
      onError={() => setFailedSrc(src)}
    />
  ) : (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center text-[var(--color-electric-blue)]">
      <FiBox size={44} strokeWidth={1} aria-hidden />
      <span className="font-heading text-lg">{name}</span>
    </div>
  );
}
