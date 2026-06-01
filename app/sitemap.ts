import type { MetadataRoute } from "next";
import { loadBlogPosts, loadMarketplaceItems } from "./lib/content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://latitibabu.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, marketplaceItems] = await Promise.all([
    loadBlogPosts(),
    loadMarketplaceItems(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/marketplace`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/graphics`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(`${post.publishedAt}T00:00:00`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const marketplaceRoutes: MetadataRoute.Sitemap = marketplaceItems.map((item) => ({
    url: `${siteUrl}/marketplace/${item.slug}`,
    lastModified: new Date(`${item.publishedAt}T00:00:00`),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...blogRoutes, ...marketplaceRoutes];
}
