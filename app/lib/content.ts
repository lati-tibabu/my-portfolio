import { createClient } from "@supabase/supabase-js";
import {
  type BlogPost,
  type GraphicItem,
  type MarketplaceItem,
} from "../data/cms";

type GraphicsRow = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  published_at: string;
  details_html: string;
};

type MarketplaceRow = {
  slug: string;
  name: string;
  description: string;
  price: string;
  category: string;
  cover_image_url: string;
  published_at: string;
  details_html: string;
  version: string;
  license: string;
  technical_name: string;
  website: string;
  compatibility: string | null;
  warning: string | null;
  live_preview: string | null;
  support_url: string | null;
  contact_email: string | null;
  link: string;
  downloads: string | null;
  upgrade_url: string | null;
  highlights: string[] | string | null;
  screenshots: string[] | string | null;
};

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string;
  tags: string[] | string | null;
  details_html: string;
  content_format: "html" | "md";
  is_draft: boolean;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const DEFAULT_COVER_IMAGE = "https://placehold.co/600x400@2x.png";

const createReadClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
};

const normalizeArray = (value: string[] | string | null | undefined) => {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const normalizeImageUrl = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : DEFAULT_COVER_IMAGE;
};

export async function loadGraphicsItems(): Promise<GraphicItem[]> {
  const client = createReadClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("graphics_items")
    .select(
      "slug,title,description,category,image_url,published_at,details_html",
    )
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as GraphicsRow[]).map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    image: normalizeImageUrl(row.image_url),
    publishedAt: row.published_at,
    detailsHtml: row.details_html,
  }));
}

export async function loadMarketplaceItems(): Promise<MarketplaceItem[]> {
  const client = createReadClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("marketplace_items")
    .select("*")
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as MarketplaceRow[]).map((row) => ({
    slug: row.slug,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    coverImage: normalizeImageUrl(row.cover_image_url),
    publishedAt: row.published_at,
    detailsHtml: row.details_html,
    version: row.version,
    license: row.license,
    technicalName: row.technical_name,
    website: row.website,
    compatibility: row.compatibility ?? undefined,
    warning: row.warning ?? undefined,
    livePreview: row.live_preview ?? undefined,
    supportUrl: row.support_url ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    link: row.link,
    downloads: row.downloads ?? undefined,
    upgradeUrl: row.upgrade_url ?? undefined,
    highlights: normalizeArray(row.highlights),
    screenshots: normalizeArray(row.screenshots),
  }));
}

export async function loadBlogPosts(): Promise<BlogPost[]> {
  const client = createReadClient();
  if (!client) {
    return [];
  }

  const { data, error } = await client
    .from("blog_posts")
    .select(
      "id,slug,title,excerpt,cover_image_url,published_at,tags,details_html,content_format,is_draft",
    )
    .eq("is_draft", false)
    .order("published_at", { ascending: false });

  if (error || !data?.length) {
    return [];
  }

  return (data as BlogRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: normalizeImageUrl(row.cover_image_url),
    publishedAt: row.published_at,
    tags: normalizeArray(row.tags) ?? [],
    detailsHtml: row.details_html,
    contentFormat: row.content_format,
    isDraft: row.is_draft,
  }));
}
