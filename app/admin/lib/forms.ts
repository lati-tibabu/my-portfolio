import type {
  BlogForm,
  GraphicsForm,
  HeroForm,
  MarketplaceForm,
  TestimonialForm,
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

export const emptyTestimonialForm = (): TestimonialForm => ({
  id: null,
  name: "",
  role: "",
  photoUrl: "",
  photoPath: "",
  quoteMd: "",
  isPublished: true,
});

export const defaultHeroForm = (): HeroForm => ({
  eyebrow: "Full Stack & Odoo ERP Developer",
  headline: "Building products people rely on.",
  bodyMd:
    "Available for freelance engagements worldwide. I specialize in Odoo customization, theme development, and full-stack application delivery backed by secure IAM integrations.\n\nI develop web applications, enterprise platforms, and Odoo solutions that prioritize performance, usability, and long-term maintainability.",
  cta1Label: "Get in touch",
  cta1Href: "/#contact",
  cta2Label: "Download CV",
  cta2Href: "/LatiTibabu_CV.pdf",
  cta3Label: "Hire me on Upwork",
  cta3Href: "https://www.upwork.com/freelancers/~0162435256404567a3?mp_source=share",
  imageEnabled: true,
  imageUrl: "/me4.png",
  imagePath: "",
  imageAlt: "Lati Tibabu portrait",
  layout: "text-left-image-right",
  availabilityLabel: "Availability",
  availabilityValue: "Open for freelance work",
});

export const emptyHeroForm = (): HeroForm => defaultHeroForm();
