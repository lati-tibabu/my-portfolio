const visitorStorageKey = "portfolio-visitor-id";
const sessionStorageKey = "portfolio-session-id";

const getId = (storage: Storage, key: string) => {
  let value = storage.getItem(key);
  if (!value) {
    value = crypto.randomUUID();
    storage.setItem(key, value);
  }
  return value;
};

export async function trackVisit(pathname: string, search: string) {
  if (pathname.startsWith("/admin")) return;

  const visitorId = getId(localStorage, visitorStorageKey);
  const sessionId = getId(sessionStorage, sessionStorageKey);

  await fetch("/api/visit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      visitorId,
      sessionId,
      page: pathname,
      query: search,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      colorScheme: window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
      screenWidth: screen.width,
      screenHeight: screen.height,
      pixelRatio: window.devicePixelRatio,
    }),
    keepalive: true,
  }).catch(() => {
    // Analytics must never interfere with navigation or rendering.
  });
}
