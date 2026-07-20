"use client";

import { marked } from "marked";

type MarkdownTextProps = {
  content: string;
  className?: string;
};

/**
 * Lightweight markdown renderer for trusted, admin-authored content
 * (testimonials, hero body). Uses `marked` directly — no shadow DOM —
 * so surrounding Tailwind styles apply cleanly. Output is not sanitized,
 * matching how BlogContent already handles markdown.
 */
export default function MarkdownText({ content, className = "" }: MarkdownTextProps) {
  const html = marked.parse(content ?? "", { async: false }) as string;

  return (
    <div
      className={[
        "[&_p]:my-0",
        "[&_p+p]:mt-3",
        "[&_a]:text-[var(--color-electric-blue)] [&_a]:underline [&_a]:underline-offset-2",
        "[&_strong]:font-semibold [&_strong]:text-[var(--color-on-surface)]",
        "[&_em]:italic",
        "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
        "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
        "[&_li+li]:mt-1",
        "[&_code]:font-mono [&_code]:text-[0.9em]",
        "break-words",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}