"use client";

import { useEffect, useState } from "react";
import HandDrawnIcon from "./HandDrawnIcon";

function formatCount(count: number) {
  if (count >= 1000000) {
    return `${Math.floor(count / 100000) / 10}m`.replace(/\.0m$/, "m");
  }

  if (count >= 1000) {
    return `${Math.floor(count / 100) / 10}k`.replace(/\.0k$/, "k");
  }

  return `${count}`;
}

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCounter() {
      try {
        const response = await fetch("/api/visitors", { cache: "no-store" });
        const data = (await response.json()) as { count?: number };

        if (active) {
          setCount(typeof data.count === "number" ? data.count : 0);
        }
      } catch {
        if (active) {
          setCount(0);
        }
      }
    }

    loadCounter();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-500 shadow-sm">
      <HandDrawnIcon name="visitor" size={12} />
      <span>{count === null ? "..." : formatCount(count)}</span>
    </div>
  );
}