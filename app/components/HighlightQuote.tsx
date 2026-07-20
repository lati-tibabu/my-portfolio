"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type HighlightQuoteProps = {
  url: string;
  title: string;
  author: string;
  children: React.ReactNode;
};

type Popup = {
  text: string;
  top: number;
  left: number;
};

type Feedback = "idle" | "quoted" | "copied";

const MAX_QUOTE_LENGTH = 600;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Build a self-contained HTML blockquote a reader can paste into any CMS or
 * rich-text editor. Carries the quote, attribution, and a link back.
 */
const buildQuoteHtml = (quote: string, url: string, title: string, author: string) =>
  `<blockquote cite="${escapeHtml(url)}">` +
  `<p>&ldquo;${escapeHtml(quote)}&rdquo;</p>` +
  `<footer>&mdash; <cite><a href="${escapeHtml(url)}">${escapeHtml(
    author,
  )} &middot; ${escapeHtml(title)}</a></cite></footer>` +
  `</blockquote>`;

const buildQuoteText = (quote: string, url: string, title: string, author: string) =>
  `"${quote}" — ${author}, ${title} ${url}`;

export default function HighlightQuote({
  url,
  title,
  author,
  children,
}: HighlightQuoteProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [popup, setPopup] = useState<Popup | null>(null);
  const [feedback, setFeedback] = useState<Feedback>("idle");

  const hide = useCallback(() => {
    setPopup(null);
    setFeedback("idle");
  }, []);

  const selectionIsInside = useCallback(() => {
    const wrap = wrapRef.current;
    const selection = window.getSelection();
    if (!wrap || !selection || selection.rangeCount === 0) {
      return false;
    }
    // Selections inside RichHtml's open shadow root are retargeted to the
    // shadow host, which lives inside this wrapper — so contains() works.
    return (
      wrap.contains(selection.anchorNode) &&
      wrap.contains(selection.focusNode)
    );
  }, []);

  const updateFromSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? "";

    if (!selection || !text || text.length > MAX_QUOTE_LENGTH || !selectionIsInside()) {
      setPopup(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
      setPopup(null);
      return;
    }

    setFeedback("idle");
    setPopup({
      text,
      top: rect.top,
      left: rect.left + rect.width / 2,
    });
  }, [selectionIsInside]);

  useEffect(() => {
    const onMouseUp = (event: MouseEvent) => {
      if (popupRef.current?.contains(event.target as Node)) {
        return;
      }
      // Wait a tick so the browser finalizes the selection.
      window.setTimeout(updateFromSelection, 10);
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.shiftKey || event.key === "Shift") {
        updateFromSelection();
      }
    };
    const onHide = () => hide();

    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("keyup", onKeyUp);
    document.addEventListener("selectionchange", () => {
      if (!window.getSelection()?.toString().trim()) {
        hide();
      }
    });
    window.addEventListener("scroll", onHide, { passive: true });
    window.addEventListener("resize", onHide);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("scroll", onHide);
      window.removeEventListener("resize", onHide);
    };
  }, [updateFromSelection, hide]);

  const copyAsHtml = async (quote: string) => {
    const html = buildQuoteHtml(quote, url, title, author);
    const text = buildQuoteText(quote, url, title, author);

    try {
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
        const item = new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([text], { type: "text/plain" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(text);
      }
      setFeedback("quoted");
      window.setTimeout(() => setFeedback("idle"), 1800);
    } catch {
      setFeedback("idle");
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback("copied");
      window.setTimeout(() => setFeedback("idle"), 1800);
    } catch {
      setFeedback("idle");
    }
  };

  const shareOnX = (quote: string) => {
    const intent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `"${quote}" — ${author}`,
    )}&url=${encodeURIComponent(url)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const intent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url,
    )}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={wrapRef} className="relative">
      {children}

      {popup && (
        <div
          ref={popupRef}
          role="toolbar"
          aria-label="Quote and share selection"
          className="fixed z-[10000] -translate-x-1/2 -translate-y-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] shadow-[0_12px_30px_-8px_rgba(0,0,0,0.35)]"
          style={{ top: popup.top - 10, left: popup.left }}
          onMouseDown={(event) => event.preventDefault()}
        >
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => void copyAsHtml(popup.text)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-on-surface)] transition hover:text-[var(--color-electric-blue)]"
              title="Copy selection as a quote (HTML) to paste anywhere"
            >
              <Icon name="quote" size={14} />
              {feedback === "quoted" ? "Quoted!" : "Quote"}
            </button>
            <span className="h-5 w-px bg-[var(--color-surface-border)]" />
            <button
              type="button"
              onClick={() => shareOnX(popup.text)}
              className="inline-flex items-center px-2.5 py-2 text-[var(--color-on-surface)] transition hover:text-[var(--color-electric-blue)]"
              title="Share selection on X"
            >
              <Icon name="x" size={15} />
            </button>
            <button
              type="button"
              onClick={shareOnLinkedIn}
              className="inline-flex items-center px-2.5 py-2 text-[var(--color-on-surface)] transition hover:text-[var(--color-electric-blue)]"
              title="Share on LinkedIn"
            >
              <Icon name="linkedin" size={15} />
            </button>
            <span className="h-5 w-px bg-[var(--color-surface-border)]" />
            <button
              type="button"
              onClick={() => void copyLink()}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--color-on-surface)] transition hover:text-[var(--color-electric-blue)]"
              title="Copy link to this article"
            >
              <Icon name="link" size={14} />
              {feedback === "copied" ? "Copied" : "Link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}