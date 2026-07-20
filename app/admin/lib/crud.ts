import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseBrowser } from "../../lib/supabase/browser";
import { STORAGE_BUCKET } from "./constants";
import type {
  BlogRecord,
  GraphicsRecord,
  HeroRecord,
  MarketplaceRecord,
  TestimonialRecord,
} from "./types";

/**
 * Append `-N` to `initialSlug` until no row in `table` matches it.
 * Pass `itemId` to exclude the row currently being edited from the conflict check.
 */
export const ensureUniqueSlug = async (
  client: SupabaseClient,
  table: string,
  initialSlug: string,
  itemId?: string,
): Promise<string> => {
  let counter = 1;
  let candidate = initialSlug;
  while (true) {
    let query = client.from(table).select("id").eq("slug", candidate).limit(1);
    if (itemId) {
      query = query.neq("id", itemId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) return candidate;
    counter += 1;
    candidate = `${initialSlug}-${counter}`;
  }
};

export const uploadContentImage = async (file: File, folder: string) => {
  const extension = file.name.split(".").pop() || "png";
  const filePath = `${folder}/${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabaseBrowser.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      contentType: file.type || "image/png",
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { data } = supabaseBrowser.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);
  return { imageUrl: data.publicUrl, imagePath: filePath };
};

export const uploadGraphicsImage = (file: File) =>
  uploadContentImage(file, "graphics");

export const uploadTestimonialPhoto = (file: File) =>
  uploadContentImage(file, "testimonials");

export const uploadHeroImage = (file: File) =>
  uploadContentImage(file, "hero");

export type LoadAllResult = {
  graphics: GraphicsRecord[];
  marketplace: MarketplaceRecord[];
  blog: BlogRecord[];
  testimonials: TestimonialRecord[];
  hero: HeroRecord | null;
  message: string;
};

export const loadAll = async (client: SupabaseClient): Promise<LoadAllResult> => {
  const [
    graphicsResult,
    marketplaceResult,
    blogResult,
    testimonialsResult,
    heroResult,
  ] = await Promise.all([
    client
      .from("graphics_items")
      .select("*")
      .order("published_at", { ascending: false }),
    client
      .from("marketplace_items")
      .select("*")
      .order("published_at", { ascending: false }),
    client
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false }),
    client
      .from("client_testimonials")
      .select("*")
      .order("created_at", { ascending: false }),
    client
      .from("hero_content")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1),
  ]);

  const graphics = (graphicsResult.data as GraphicsRecord[]) ?? [];
  const marketplace = (marketplaceResult.data as MarketplaceRecord[]) ?? [];
  const blog = (blogResult.data as BlogRecord[]) ?? [];
  const testimonials = (testimonialsResult.data as TestimonialRecord[]) ?? [];
  const hero = (heroResult.data?.[0] as HeroRecord | undefined) ?? null;

  const hasError =
    graphicsResult.error ||
    marketplaceResult.error ||
    blogResult.error ||
    testimonialsResult.error ||
    heroResult.error;
  const message = hasError
    ? graphicsResult.error?.message ||
      marketplaceResult.error?.message ||
      blogResult.error?.message ||
      testimonialsResult.error?.message ||
      heroResult.error?.message ||
      "Loaded with some empty sections."
    : "Content loaded successfully.";

  return { graphics, marketplace, blog, testimonials, hero, message };
};