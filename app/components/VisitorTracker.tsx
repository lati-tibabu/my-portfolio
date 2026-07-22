"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackVisit } from "../lib/trackVisit";

export default function VisitorTracker() {
  const pathname = usePathname();

  useEffect(() => {
    void trackVisit(pathname, window.location.search);
  }, [pathname]);

  return null;
}
