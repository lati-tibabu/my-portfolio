"use client";

import { marked } from "marked";
import RichHtml from "./RichHtml";

type BlogContentProps = {
  content: string;
  format: "html" | "md";
  variant?: "default" | "article";
};

export default function BlogContent({
  content,
  format,
  variant = "article",
}: BlogContentProps) {
  const html =
    format === "md" ? marked.parse(content, { async: false }) : content;

  return <RichHtml html={html} variant={variant} />;
}
