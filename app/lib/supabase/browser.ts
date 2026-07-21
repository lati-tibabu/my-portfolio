import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

const parseCookies = () => {
  if (typeof document === "undefined") return [];
  return document.cookie.split("; ").filter(Boolean).map((cookie) => {
    const [name, ...rest] = cookie.split("=");
    return { name: name ?? "", value: rest.join("=") };
  });
};

const setCookie = (cookie: {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}) => {
  if (typeof document === "undefined") return;
  let cookieString = `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`;
  const options = cookie.options ?? {};
  if (options.path) cookieString += `; path=${String(options.path)}`;
  if (typeof options.maxAge === "number") cookieString += `; max-age=${options.maxAge}`;
  if (options.domain) cookieString += `; domain=${String(options.domain)}`;
  if (options.sameSite) cookieString += `; samesite=${String(options.sameSite)}`;
  if (options.secure) cookieString += `; secure`;
  if (options.expires) cookieString += `; expires=${String(options.expires)}`;
  document.cookie = cookieString;
};

export const supabaseBrowser = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  cookies: {
    getAll() {
      return parseCookies();
    },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(setCookie);
    },
  },
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
  },
});

export function hasSupabaseBrowserConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
