import crypto from "node:crypto";
import { UAParser } from "ua-parser-js";
import { createClient } from "@supabase/supabase-js";

const optionalText = (value: unknown, max = 500) =>
  typeof value === "string" ? value.slice(0, max) || null : null;
const optionalGeoText = (value: string | null, max = 500) => {
  if (!value) return null;
  try {
    return decodeURIComponent(value.replace(/\+/g, " ")).slice(0, max) || null;
  } catch {
    return value.slice(0, max) || null;
  }
};
const optionalUuid = (value: unknown) =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
    ? value
    : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const page = optionalText(body.page, 500);
    if (!page || !page.startsWith("/")) {
      return Response.json({ success: false }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const ua = new UAParser(userAgent).getResult();
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const ip = forwardedFor.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    const { error } = await supabase.from("visitor_events").insert({
      visitor_id: optionalUuid(body.visitorId),
      session_id: optionalUuid(body.sessionId),
      ip_hash: ip ? crypto.createHash("sha256").update(ip).digest("hex") : null,
      country: optionalGeoText(request.headers.get("x-vercel-ip-country"), 100),
      region: optionalGeoText(request.headers.get("x-vercel-ip-country-region"), 100),
      city: optionalGeoText(request.headers.get("x-vercel-ip-city"), 150),
      browser: optionalText(ua.browser.name, 80),
      browser_version: optionalText(ua.browser.version, 40),
      engine: optionalText(ua.engine.name, 80),
      engine_version: optionalText(ua.engine.version, 40),
      os: optionalText(ua.os.name, 80),
      os_version: optionalText(ua.os.version, 40),
      device: optionalText(ua.device.type, 40) || "desktop",
      vendor: optionalText(ua.device.vendor, 80),
      model: optionalText(ua.device.model, 80),
      cpu: optionalText(ua.cpu.architecture, 40),
      language: optionalText(body.language, 40),
      timezone: optionalText(body.timezone, 100),
      color_scheme: optionalText(body.colorScheme, 20),
      screen_width: Number.isFinite(body.screenWidth) ? body.screenWidth : null,
      screen_height: Number.isFinite(body.screenHeight) ? body.screenHeight : null,
      pixel_ratio: Number.isFinite(body.pixelRatio) ? body.pixelRatio : null,
      page,
      query: optionalText(body.query, 1000),
      referrer: optionalText(request.headers.get("referer"), 1000),
      host: optionalText(request.headers.get("host"), 255),
      protocol: optionalText(request.headers.get("x-forwarded-proto"), 20),
      user_agent: optionalText(userAgent, 1000),
    });

    if (error) throw error;
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 500 });
  }
}
