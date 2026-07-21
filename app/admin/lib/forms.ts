import type {
  BlogForm,
  CertificationForm,
  DevJourneyForm,
  DevJourneyLink,
  GraphicsForm,
  HeroForm,
  MarketplaceForm,
  StatsForm,
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

// Build a slug for a duplicated item. The final uniqueness check against the
// DB still happens via ensureUniqueSlug at save time.
export const duplicateSlug = (base: string) => {
  const clean = slugify(base);
  if (!clean) return "copy";
  return clean.endsWith("-copy") ? `${clean}-2` : `${clean}-copy`;
};

export const joinList = (items: string[] | null | undefined) => (items ?? []).join(", ");

export const textValue = (value: string | null | undefined) => value ?? "";

export const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

// Dev journey links are edited as one `Label | URL` entry per line. The label
// is optional; a bare URL is allowed. Returns structured {label,url} objects.
export const parseLinksText = (value: string): DevJourneyLink[] =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.indexOf("|");
      if (separator === -1) {
        return { url: line.trim() };
      }
      const label = line.slice(0, separator).trim();
      const url = line.slice(separator + 1).trim();
      return label ? { label, url } : { url };
    })
    .filter((link) => link.url);

export const linksToText = (links: DevJourneyLink[] | null | undefined) =>
  (links ?? [])
    .map((link) => (link.label ? `${link.label} | ${link.url}` : link.url))
    .join("\n");

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

export const emptyDevJourneyForm = (): DevJourneyForm => ({
  id: null,
  title: "",
  description: "",
  linksText: "",
  sortOrder: "1",
});

export const emptyCertificationForm = (): CertificationForm => ({
  id: null,
  title: "",
  issuer: "",
  url: "",
  issuedAt: "",
  sortOrder: "1",
});

export const emptyStatsForm = (): StatsForm => ({
  id: null,
  label: "",
  value: "",
  sortOrder: "1",
});
