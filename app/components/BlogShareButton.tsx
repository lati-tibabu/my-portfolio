"use client";

import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

type BlogShareButtonProps = {
  url: string;
  title: string;
  text?: string;
};

type CopyState = "idle" | "copied";

const shareLinks = (url: string, title: string, text?: string) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(text ?? "");
  return [
    {
      key: "x",
      label: "Share on X",
      icon: "x" as const,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      key: "linkedin",
      label: "Share on LinkedIn",
      icon: "linkedin" as const,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      key: "facebook",
      label: "Share on Facebook",
      icon: "facebook" as const,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      key: "whatsapp",
      label: "Share on WhatsApp",
      icon: "whatsapp" as const,
      href: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    },
    {
      key: "telegram",
      label: "Share on Telegram",
      icon: "telegram" as const,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
  ];
};

export default function BlogShareButton({
  url,
  title,
  text,
}: BlogShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [supportsNative, setSupportsNative] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSupportsNative(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (event: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title,
        text: text ?? title,
        url,
      });
    } catch {
      // User cancelled or share failed — fall back to the menu.
      setOpen(true);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("idle");
    }
  };

  const links = shareLinks(url, title, text);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => {
          if (supportsNative && !open) {
            void handleNativeShare();
            return;
          }
          setOpen((value) => !value);
        }}
        className="inline-flex items-center gap-2 rounded-md border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition hover:border-[var(--color-electric-blue)] hover:text-[var(--color-electric-blue)]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon name="share" size={14} />
        Share
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)]"
        >
          {links.map((item) => (
            <a
              key={item.key}
              role="menuitem"
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-on-surface)] transition hover:bg-[var(--color-surface-container-low)]"
            >
              <Icon name={item.icon} size={16} />
              {item.label}
            </a>
          ))}
          <button
            type="button"
            role="menuitem"
            onClick={copyLink}
            className="flex w-full items-center gap-3 border-t border-[var(--color-surface-border)] px-4 py-2.5 text-left text-sm text-[var(--color-on-surface)] transition hover:bg-[var(--color-surface-container-low)]"
          >
            <Icon name="link" size={16} />
            {copyState === "copied" ? "Link copied" : "Copy link"}
          </button>
        </div>
      )}
    </div>
  );
}