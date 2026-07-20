export type TabKey = "graphics" | "marketplace" | "blog";

export type SessionUser = {
  email?: string | null;
};

export type GraphicsRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  image_path: string | null;
  published_at: string;
  details_html: string;
  author_name: string;
  created_at: string;
};

export type MarketplaceRecord = {
  id: string;
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
  highlights: string[] | null;
  screenshots: string[] | null;
  author_name: string;
  created_at: string;
};

export type BlogRecord = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string;
  tags: string[] | null;
  details_html: string;
  content_format: "html" | "md";
  is_draft: boolean;
  author_name: string;
  created_at: string;
};

export type GraphicsForm = {
  id: string | null;
  slug: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  imagePath: string;
  publishedAt: string;
  detailsHtml: string;
  authorName: string;
};

export type MarketplaceForm = {
  id: string | null;
  slug: string;
  name: string;
  description: string;
  price: string;
  category: string;
  coverImageUrl: string;
  publishedAt: string;
  detailsHtml: string;
  version: string;
  license: string;
  technicalName: string;
  website: string;
  compatibility: string;
  warning: string;
  livePreview: string;
  supportUrl: string;
  contactEmail: string;
  link: string;
  downloads: string;
  upgradeUrl: string;
  highlightsText: string;
  screenshotsText: string;
  authorName: string;
};

export type BlogForm = {
  id: string | null;
  slug: string;
  title: string;
  excerpt: string;
  useCoverImage: boolean;
  coverImageUrl: string;
  publishedAt: string;
  tagsText: string;
  detailsHtml: string;
  contentFormat: "html" | "md";
  isDraft: boolean;
  authorName: string;
};
