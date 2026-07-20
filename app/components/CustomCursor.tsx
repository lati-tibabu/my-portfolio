"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Custom cursor: a precise dot that tracks the pointer 1:1 and a larger ring
 * that trails with easing. Uses `mix-blend-mode: difference` so it reads
 * against any surface (light or dark). The ring enlarges over interactive
 * elements (a, button, [data-cursor]) for affordance feedback.
 *
 * Automatically disabled on touch-primary devices and when the user prefers
 * reduced motion — the native cursor stays untouched in those cases.
 */
export default function CustomCursor() {
  const pathname = usePathname();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip on touch devices — a custom cursor there only gets in the way.
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (isTouch || reducedMotion || pathname?.startsWith("/admin")) return;

    document.documentElement.dataset.cursor = "custom";

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...mouse };
    let raf = 0;
    let visible = false;

    const isInteractive = (target: EventTarget | null): boolean => {
      const el = target instanceof Element ? target : null;
      if (!el) return false;
      return !!el.closest('a, button, input, textarea, select, [data-cursor], [role="button"]');
    };

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!visible) {
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
      const hot = isInteractive(e.target);
      ring.dataset.hot = hot ? "true" : "false";
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onDown = () => {
      ring.dataset.down = "true";
    };
    const onUp = () => {
      delete ring.dataset.down;
    };

    // Trailing ring loop — eases toward the pointer each frame.
    const tick = () => {
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      delete document.documentElement.dataset.cursor;
    };
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="custom-cursor custom-cursor-dot"
      />
      <div
        ref={ringRef}
        aria-hidden
        className="custom-cursor custom-cursor-ring"
      />
    </>
  );
}
