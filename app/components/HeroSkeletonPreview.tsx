"use client";

import type { HeroLayout } from "../data/cms";

type HeroSkeletonPreviewProps = {
  layout: HeroLayout;
  imageEnabled: boolean;
};

const bar = (width: string, faded = false) => (
  <div
    className={`h-2.5 rounded-full ${faded ? "bg-[var(--color-surface-border)]" : "bg-[var(--color-on-surface-variant)]/30"}`}
    style={{ width }}
  />
);

const imageBlock = (
  <div
    aria-hidden="true"
    className="aspect-square w-full rounded-md border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)]"
  />
);

const textStack = (
  <div className="flex flex-1 flex-col gap-2">
    <div className="mb-1 h-2 w-20 rounded-full bg-[var(--color-electric-blue)]/50" />
    {bar("90%")}
    {bar("70%")}
    <div className="mt-2 flex flex-col gap-1.5">
      {bar("100%", true)}
      {bar("80%", true)}
    </div>
    <div className="mt-2 flex gap-2">
      <div className="h-5 w-16 rounded bg-[var(--color-electric-blue)]/60" />
      <div className="h-5 w-16 rounded border border-[var(--color-surface-border)]" />
    </div>
  </div>
);

export default function HeroSkeletonPreview({
  layout,
  imageEnabled,
}: HeroSkeletonPreviewProps) {
  const showImage = imageEnabled && layout !== "centered";

  if (layout === "centered") {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-4">
        <div className="mb-1 h-2 w-20 rounded-full bg-[var(--color-electric-blue)]/50" />
        {bar("60%")}
        {bar("45%")}
        <div className="mt-2 flex flex-col items-center gap-1.5">
          {bar("70%", true)}
          {bar("50%", true)}
        </div>
        <div className="mt-2 flex justify-center gap-2">
          <div className="h-5 w-16 rounded bg-[var(--color-electric-blue)]/60" />
          <div className="h-5 w-16 rounded border border-[var(--color-surface-border)]" />
        </div>
      </div>
    );
  }

  const image = <div className="flex-1">{imageBlock}</div>;

  if (!showImage) {
    // Split layout chosen but image disabled → text spans full width.
    return (
      <div className="rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-4">
        {textStack}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-4">
      {layout === "image-left-text-right" ? image : textStack}
      {layout === "image-left-text-right" ? textStack : image}
    </div>
  );
}
