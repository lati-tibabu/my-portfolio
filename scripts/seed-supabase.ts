import "dotenv/config";

import path from "node:path";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import {
  blogPosts,
  certifications,
  devJourneyItems,
  graphicsItems,
  heroContent,
  marketplaceItems,
  testimonials,
} from "../app/data/cms";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env",
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

const bucketName = "portfolio-media";

const contentTypeByExtension: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

const getContentType = (filePath: string) => {
  const extension = path.extname(filePath).slice(1).toLowerCase();
  return contentTypeByExtension[extension] ?? "application/octet-stream";
};

const ensureBucket = async () => {
  const { data } = await supabase.storage.listBuckets();
  const existingBucket = data?.find((bucket) => bucket.name === bucketName);

  if (!existingBucket) {
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true,
    });

    if (error) {
      throw new Error(`Failed to create storage bucket: ${error.message}`);
    }
  }
};

const uploadLocalImage = async (
  sourcePath: string,
  destinationPath: string,
) => {
  const absolutePath = path.resolve(
    process.cwd(),
    "public",
    sourcePath.slice(1),
  );
  const fileBuffer = await readFile(absolutePath);

  const { error } = await supabase.storage
    .from(bucketName)
    .upload(destinationPath, fileBuffer, {
      contentType: getContentType(sourcePath),
      upsert: true,
    });

  if (error) {
    throw new Error(`Failed to upload ${sourcePath}: ${error.message}`);
  }

  return supabase.storage.from(bucketName).getPublicUrl(destinationPath).data
    .publicUrl;
};

async function seedGraphics() {
  console.log(`Seeding ${graphicsItems.length} graphics items...`);

  const rows = [] as Array<Record<string, unknown>>;

  for (const item of graphicsItems) {
    const sourcePath = item.image;
    const extension = path.extname(sourcePath) || ".png";
    const storagePath = `graphics/${item.slug}${extension}`;
    const publicUrl = await uploadLocalImage(sourcePath, storagePath);

    rows.push({
      slug: item.slug,
      title: item.title,
      description: item.description,
      category: item.category,
      image_url: publicUrl,
      image_path: storagePath,
      published_at: item.publishedAt,
      details_html: item.detailsHtml,
    });
  }

  const { error } = await supabase
    .from("graphics_items")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Failed to seed graphics: ${error.message}`);
  }
}

async function seedMarketplace() {
  console.log(`Seeding ${marketplaceItems.length} marketplace items...`);

  const rows = marketplaceItems.map((item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    cover_image_url: item.coverImage,
    published_at: item.publishedAt,
    details_html: item.detailsHtml,
    version: item.version,
    license: item.license,
    technical_name: item.technicalName,
    website: item.website,
    compatibility: item.compatibility ?? null,
    warning: item.warning ?? null,
    live_preview: item.livePreview ?? null,
    support_url: item.supportUrl ?? null,
    contact_email: item.contactEmail ?? null,
    link: item.link,
    downloads: item.downloads ?? null,
    upgrade_url: item.upgradeUrl ?? null,
    highlights: item.highlights ?? [],
    screenshots: item.screenshots ?? [],
  }));

  const { error } = await supabase
    .from("marketplace_items")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Failed to seed marketplace: ${error.message}`);
  }
}

async function seedBlog() {
  console.log(`Seeding ${blogPosts.length} blog posts...`);

  const rows = [] as Array<Record<string, unknown>>;

  for (const post of blogPosts) {
    const sourcePath = post.coverImage;
    const extension = path.extname(sourcePath) || ".png";
    const storagePath = `blog/${post.slug}${extension}`;
    const publicUrl = await uploadLocalImage(sourcePath, storagePath);

    rows.push({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      cover_image_url: publicUrl,
      published_at: post.publishedAt,
      tags: post.tags,
      details_html: post.detailsHtml,
      content_format: post.contentFormat ?? "html",
      is_draft: post.isDraft ?? false,
    });
  }

  const { error } = await supabase
    .from("blog_posts")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    throw new Error(`Failed to seed blog: ${error.message}`);
  }
}

async function seedTestimonials() {
  console.log(`Seeding ${testimonials.length} testimonials...`);

  const rows = testimonials.map((item) => ({
    name: item.name,
    role: item.role ?? null,
    photo_url: item.photo ?? null,
    quote_md: item.quoteMd,
    is_published: item.isPublished ?? true,
  }));

  const { error } = await supabase
    .from("client_testimonials")
    .upsert(rows, { onConflict: "name" });

  if (error) {
    throw new Error(`Failed to seed testimonials: ${error.message}`);
  }
}

async function seedHero() {
  console.log("Seeding hero content...");

  let publicUrl = heroContent.imageUrl ?? null;
  let storagePath: string | null = null;

  if (publicUrl?.startsWith("/")) {
    const extension = path.extname(publicUrl) || ".png";
    storagePath = `hero/portrait${extension}`;
    publicUrl = await uploadLocalImage(publicUrl, storagePath);
  }

  const row = {
    id: "00000000-0000-0000-0000-000000000001",
    eyebrow: heroContent.eyebrow,
    headline: heroContent.headline,
    body_md: heroContent.bodyMd,
    cta1_label: heroContent.cta1Label ?? null,
    cta1_href: heroContent.cta1Href ?? null,
    cta2_label: heroContent.cta2Label ?? null,
    cta2_href: heroContent.cta2Href ?? null,
    cta3_label: heroContent.cta3Label ?? null,
    cta3_href: heroContent.cta3Href ?? null,
    image_enabled: heroContent.imageEnabled,
    image_url: publicUrl,
    image_path: storagePath,
    image_alt: heroContent.imageAlt ?? null,
    layout: heroContent.layout,
    availability_label: heroContent.availabilityLabel ?? null,
    availability_value: heroContent.availabilityValue ?? null,
  };

  // Singleton: keep only one row. Upsert by fixed id.
  const { error: insertError } = await supabase
    .from("hero_content")
    .upsert(row, { onConflict: "id" });

  if (insertError) {
    throw new Error(`Failed to seed hero content: ${insertError.message}`);
  }
}

async function seedDevJourney() {
  console.log(`Seeding ${devJourneyItems.length} dev journey items...`);

  const rows = devJourneyItems.map((item) => ({
    title: item.title,
    description: item.description,
    links: item.links ?? [],
    sort_order: item.sortOrder ?? 0,
  }));

  // No unique natural key on this table, so re-seeding by upsert is not safe.
  // Replace the seeded set (by title) and leave any admin-added rows intact.
  const seededTitles = rows.map((row) => row.title);
  await supabase.from("dev_journey_items").delete().in("title", seededTitles);

  const { error } = await supabase.from("dev_journey_items").insert(rows);

  if (error) {
    throw new Error(`Failed to seed dev journey: ${error.message}`);
  }
}

async function seedCertifications() {
  console.log(`Seeding ${certifications.length} certifications...`);

  const rows = certifications.map((item) => ({
    title: item.title,
    issuer: item.issuer ?? null,
    url: item.url ?? null,
    issued_at: item.issuedAt ?? null,
    sort_order: item.sortOrder ?? 0,
  }));

  const seededTitles = rows.map((row) => row.title);
  await supabase.from("certifications").delete().in("title", seededTitles);

  const { error } = await supabase.from("certifications").insert(rows);

  if (error) {
    throw new Error(`Failed to seed certifications: ${error.message}`);
  }
}

async function main() {
  await ensureBucket();
  await seedGraphics();
  await seedMarketplace();
  await seedBlog();
  await seedTestimonials();
  await seedHero();
  await seedDevJourney();
  await seedCertifications();
  console.log("Supabase migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
