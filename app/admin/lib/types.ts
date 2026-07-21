export type TabKey =
  | "graphics"
  | "marketplace"
  | "blog"
  | "testimonials"
  | "hero"
  | "dev-journey"
  | "certifications"
  | "stats"
  | "users";

export type SessionUser = {
  id?: string;
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

export type TestimonialRecord = {
  id: string;
  name: string;
  role: string | null;
  photo_url: string | null;
  photo_path: string | null;
  quote_md: string;
  is_published: boolean;
  created_at: string;
};

export type DevJourneyLink = { label?: string; url: string };

export type DevJourneyRecord = {
  id: string;
  title: string;
  description: string;
  links: DevJourneyLink[] | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type CertificationRecord = {
  id: string;
  title: string;
  issuer: string | null;
  url: string | null;
  issued_at: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type StatsRecord = {
  id: string;
  label: string;
  value: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type HeroRecord = {
  id: string;
  eyebrow: string;
  headline: string;
  body_md: string;
  cta1_label: string | null;
  cta1_href: string | null;
  cta2_label: string | null;
  cta2_href: string | null;
  cta3_label: string | null;
  cta3_href: string | null;
  image_enabled: boolean;
  image_url: string | null;
  image_path: string | null;
  image_alt: string | null;
  layout: "text-left-image-right" | "image-left-text-right" | "centered";
  availability_label: string | null;
  availability_value: string | null;
  updated_at: string;
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
};

export type TestimonialForm = {
  id: string | null;
  name: string;
  role: string;
  photoUrl: string;
  photoPath: string;
  quoteMd: string;
  isPublished: boolean;
};

export type HeroForm = {
  eyebrow: string;
  headline: string;
  bodyMd: string;
  cta1Label: string;
  cta1Href: string;
  cta2Label: string;
  cta2Href: string;
  cta3Label: string;
  cta3Href: string;
  imageEnabled: boolean;
  imageUrl: string;
  imagePath: string;
  imageAlt: string;
  layout: "text-left-image-right" | "image-left-text-right" | "centered";
  availabilityLabel: string;
  availabilityValue: string;
};

export type DevJourneyForm = {
  id: string | null;
  title: string;
  description: string;
  linksText: string;
  sortOrder: string;
};

export type CertificationForm = {
  id: string | null;
  title: string;
  issuer: string;
  url: string;
  issuedAt: string;
  sortOrder: string;
};

export type StatsForm = {
  id: string | null;
  label: string;
  value: string;
  sortOrder: string;
};
