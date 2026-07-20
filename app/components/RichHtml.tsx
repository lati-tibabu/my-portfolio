"use client";

import { useEffect, useRef } from "react";

type RichHtmlProps = {
  html: string;
  className?: string;
  variant?: "default" | "article";
};

const shadowStyles = `
  :host {
    display: block;
    width: 100%;
    min-width: 0;
    color: var(--color-on-surface-variant);
    font-family: var(--font-body), "Lexend", "Segoe UI", Arial, sans-serif;
  }

  .rich-html {
    width: 100%;
    min-width: 0;
    max-width: none;
    font-size: 0.95rem;
    line-height: 1.85;
    overflow-wrap: break-word;
    word-break: break-word;
  }

  .rich-html h1,
  .rich-html h2,
  .rich-html h3,
  .rich-html h4,
  .rich-html h5,
  .rich-html h6 {
    margin: 0 0 0.75rem;
    color: var(--color-on-surface);
    font-family: var(--font-body), "Lexend", "Segoe UI", Arial, sans-serif;
    line-height: 1.2;
  }

  .rich-html h1 { font-size: clamp(1.6rem, 3vw, 2.4rem); }
  .rich-html h2 { font-size: clamp(1.25rem, 2.2vw, 1.7rem); }
  .rich-html h3 { font-size: clamp(1.1rem, 2vw, 1.35rem); }

  .rich-html p {
    margin: 0 0 1rem;
  }

  .rich-html p:last-child,
  .rich-html ul:last-child,
  .rich-html ol:last-child,
  .rich-html blockquote:last-child,
  .rich-html pre:last-child,
  .rich-html table:last-child {
    margin-bottom: 0;
  }

  .rich-html ul,
  .rich-html ol {
    margin: 0 0 1rem;
    padding-left: 1.25rem;
  }

  .rich-html li + li {
    margin-top: 0.35rem;
  }

  .rich-html a {
    color: var(--color-electric-blue);
    text-decoration: underline;
    text-underline-offset: 0.15em;
  }

  .rich-html img,
  .rich-html video,
  .rich-html iframe,
  .rich-html svg,
  .rich-html canvas {
    max-width: 100%;
    height: auto;
  }

  .rich-html img {
    border-radius: 0.75rem;
  }

  .rich-html table {
    width: 100%;
    border-collapse: collapse;
    margin: 0 0 1rem;
    display: block;
    overflow-x: auto;
  }

  .rich-html th,
  .rich-html td {
    border: 1px solid var(--color-surface-border);
    padding: 0.65rem 0.75rem;
    text-align: left;
    vertical-align: top;
  }

  .rich-html th {
    background: var(--color-surface-container-low);
    color: var(--color-on-surface);
    font-weight: 600;
  }

  .rich-html blockquote {
    margin: 0 0 1rem;
    padding: 0.75rem 1rem;
    border-left: 3px solid var(--color-electric-blue);
    background: var(--color-surface-container-lowest);
    border-radius: 0 0.75rem 0.75rem 0;
  }

  .rich-html pre {
    margin: 0 0 1rem;
    padding: 1rem;
    border-radius: 0.75rem;
    background: var(--color-deep-navy);
    color: var(--color-inverse-on-surface);
    overflow-x: auto;
  }

  .rich-html code {
    font-family: var(--font-mono), "JetBrains Mono", "SFMono-Regular", monospace;
  }

  .rich-html section + section {
    margin-top: 1.25rem;
  }

  .rich-html.article {
    color: var(--color-slate-text);
    font-size: 1.08rem;
    line-height: 1.95;
  }

  .rich-html.article h1,
  .rich-html.article h2,
  .rich-html.article h3,
  .rich-html.article h4,
  .rich-html.article h5,
  .rich-html.article h6 {
    margin-top: 2.5rem;
    margin-bottom: 0.9rem;
    letter-spacing: -0.025em;
  }

  .rich-html.article p {
    margin-bottom: 1.4rem;
  }

  .rich-html.article ul,
  .rich-html.article ol,
  .rich-html.article blockquote,
  .rich-html.article pre,
  .rich-html.article table {
    margin-bottom: 1.5rem;
  }

  .rich-html.article section + section {
    margin-top: 2.5rem;
  }

  @media (max-width: 640px) {
    .rich-html.article {
      font-size: 1rem;
      line-height: 1.85;
    }
  }
`;

export default function RichHtml({
  html,
  className = "",
  variant = "default",
}: RichHtmlProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const shadowRoot = host.shadowRoot ?? host.attachShadow({ mode: "open" });
    shadowRoot.innerHTML = `<style>${shadowStyles}</style><div class="rich-html ${variant}">${html}</div>`;
  }, [html, variant]);

  return <div ref={hostRef} className={className} suppressHydrationWarning />;
}
