import type {
  BlogForm,
  GraphicsForm,
  MarketplaceForm,
} from "./types";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const joinList = (items: string[] | null | undefined) => (items ?? []).join(", ");

export const textValue = (value: string | null | undefined) => value ?? "";

export const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const emptyGraphicsForm = (): GraphicsForm => ({
  id: null,
  slug: "",
  title: "",
  description: "",
  category: "",
  imageUrl: "",
  imagePath: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  detailsHtml: "",
  authorName: "",
});

export const emptyMarketplaceForm = (): MarketplaceForm => ({
  id: null,
  slug: "",
  name: "",
  description: "",
  price: "",
  category: "",
  coverImageUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  detailsHtml: "",
  version: "",
  license: "",
  technicalName: "",
  website: "",
  compatibility: "",
  warning: "",
  livePreview: "",
  supportUrl: "",
  contactEmail: "",
  link: "",
  downloads: "",
  upgradeUrl: "",
  highlightsText: "",
  screenshotsText: "",
  authorName: "",
});

export const emptyBlogForm = (): BlogForm => ({
  id: null,
  slug: "",
  title: "",
  excerpt: "",
  useCoverImage: false,
  coverImageUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  tagsText: "",
  detailsHtml: "",
  contentFormat: "html",
  isDraft: true,
  authorName: "",
});
