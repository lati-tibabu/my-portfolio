import "dotenv/config";

import path from "node:path";
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";
import { blogPosts, graphicsItems, marketplaceItems } from "../app/data/cms";

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

async function main() {
  await ensureBucket();
  await seedGraphics();
  await seedMarketplace();
  await seedBlog();
  console.log("Supabase migration complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
