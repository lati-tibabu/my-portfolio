import { marketplaceItems as legacyMarketplaceItems } from "./odooMarketplace";

export type GraphicItem = {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  publishedAt: string;
  detailsHtml: string;
  authorName?: string;
  createdAt?: string;
};

export type MarketplaceItem = {
  slug: string;
  name: string;
  description: string;
  price: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  detailsHtml: string;
  version: string;
  license: string;
  technicalName: string;
  website: string;
  compatibility?: string;
  warning?: string;
  livePreview?: string;
  supportUrl?: string;
  contactEmail?: string;
  link: string;
  downloads?: string;
  upgradeUrl?: string;
  highlights?: string[];
  screenshots?: string[];
  authorName?: string;
  createdAt?: string;
};

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  detailsHtml: string;
  contentFormat?: "html" | "md";
  isDraft?: boolean;
  authorName?: string;
  createdAt?: string;
};

export type Testimonial = {
  id?: string;
  name: string;
  role?: string;
  photo?: string;
  quoteMd: string;
  isPublished?: boolean;
  createdAt?: string;
};

export type HeroLayout = "text-left-image-right" | "image-left-text-right" | "centered";

export type HeroContent = {
  eyebrow: string;
  headline: string;
  bodyMd: string;
  cta1Label?: string;
  cta1Href?: string;
  cta2Label?: string;
  cta2Href?: string;
  cta3Label?: string;
  cta3Href?: string;
  imageEnabled: boolean;
  imageUrl?: string;
  imageAlt?: string;
  layout: HeroLayout;
  availabilityLabel?: string;
  availabilityValue?: string;
};

const toListItems = (items: string[]) =>
  items.map((item) => `<li>${item}</li>`).join("");

const buildMarketplaceDetailsHtml = (
  item: (typeof legacyMarketplaceItems)[number],
) => {
  const sections: string[] = [
    `<section><h2>Overview</h2><p>${item.description}</p></section>`,
  ];

  if (item.keyFeatures?.length) {
    sections.push(
      `<section><h2>Key features</h2><ul>${toListItems(item.keyFeatures)}</ul></section>`,
    );
  }

  if (item.widgetCoverage?.length) {
    sections.push(
      `<section><h2>Widget coverage</h2><ul>${toListItems(item.widgetCoverage)}</ul></section>`,
    );
  }

  if (item.coverage?.length) {
    sections.push(
      `<section><h2>Core coverage</h2><ul>${toListItems(item.coverage)}</ul></section>`,
    );
  }

  if (item.comparison?.length) {
    sections.push(
      `<section><h2>Edition comparison</h2><ul>${toListItems(item.comparison)}</ul></section>`,
    );
  }

  if (item.dependencies?.length) {
    sections.push(
      `<section><h2>Dependencies</h2><p>${item.dependencies.join(", ")}</p></section>`,
    );
  }

  if (item.highlights?.length) {
    sections.push(
      `<section><h2>Highlights</h2><ul>${toListItems(item.highlights)}</ul></section>`,
    );
  }

  if (item.warning) {
    sections.push(`<section><h2>Note</h2><p>${item.warning}</p></section>`);
  }

  const supportLinks = [
    `<li><a href="${item.link}" target="_blank" rel="noopener noreferrer">Product listing</a></li>`,
    item.supportUrl
      ? `<li><a href="${item.supportUrl}" target="_blank" rel="noopener noreferrer">Support</a></li>`
      : "",
    item.livePreview
      ? `<li><a href="${item.livePreview}" target="_blank" rel="noopener noreferrer">Live preview</a></li>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  sections.push(
    `<section><h2>Support and links</h2><ul>${supportLinks}</ul></section>`,
  );

  return sections.join("");
};

export const graphicsItems: GraphicItem[] = [
  {
    slug: "akkamitti-qophoofna-2025",
    title: "Akkamitti Qophoofna 2025",
    description:
      "A conference-style campaign graphic with a layered typographic hierarchy.",
    category: "Event Poster",
    image: "/Images/Graphics/akkamitti_qophoofna_2025.png",
    publishedAt: "2025-02-14",
    detailsHtml:
      "<p>Built as a high-contrast event poster with a strong focal title, supporting date details, and a bold composition that stays readable on social previews.</p><ul><li>Theme-led visual hierarchy</li><li>Social-ready aspect balance</li><li>Designed for print and digital distribution</li></ul>",
  },
  {
    slug: "ayyaanaan-qofa",
    title: "Ayyaanaan Qofa",
    description:
      "A visually calm campaign visual with a centered message block.",
    category: "Campaign Art",
    image: "/Images/Graphics/ayyaanaan_qofa.png",
    publishedAt: "2025-01-10",
    detailsHtml:
      "<p>This piece focuses on spacing, contrast, and message clarity. The composition keeps attention on the headline while the background texture carries the brand mood.</p>",
  },
  {
    slug: "biyya-lafaa",
    title: "Biyya Lafaa",
    description:
      "Earth-toned artwork that uses color blocks to shape the message.",
    category: "Campaign Art",
    image: "/Images/Graphics/biyya_lafaa.png",
    publishedAt: "2024-12-08",
    detailsHtml:
      "<p>Layered geometry, soft gradients, and a grounded palette create a clear frame for the central concept while keeping the image expressive.</p>",
  },
  {
    slug: "brethren-banner",
    title: "Brethren Banner",
    description: "A banner-style composition made for wide-format display.",
    category: "Banner",
    image: "/Images/Graphics/brethren_banner.png",
    publishedAt: "2024-11-03",
    detailsHtml:
      "<p>Designed to work across large banners and social crops, this graphic keeps the key information in the safe zone while letting the imagery breathe.</p>",
  },
  {
    slug: "duula-kadhannaa-2023",
    title: "Duula Kadhannaa 2023",
    description: "A campaign graphic with strong hierarchy and event focus.",
    category: "Event Poster",
    image: "/Images/Graphics/duula_kadhannaa_2023.png",
    publishedAt: "2023-09-28",
    detailsHtml:
      "<p>The layout combines motion, emphasis, and a clear event title so the artwork can function in announcements, status updates, and printed material.</p>",
  },
  {
    slug: "faith-success-2025",
    title: "Faith Success 2025",
    description: "Bright, energetic artwork tailored to a celebration theme.",
    category: "Celebration Poster",
    image: "/Images/Graphics/faith_success_2025.png",
    publishedAt: "2025-03-17",
    detailsHtml:
      "<p>Created with a vibrant palette and layered typography to communicate positivity, motion, and a polished visual identity.</p>",
  },
  {
    slug: "fasika-2025",
    title: "Fasika 2025",
    description:
      "Holiday artwork with a festive palette and center-stage typography.",
    category: "Holiday Poster",
    image: "/Images/Graphics/fasika_2025.png",
    publishedAt: "2025-04-11",
    detailsHtml:
      "<p>The composition balances decorative detail with a simple focal message so it works well as a seasonal promo and a timeline cover.</p>",
  },
  {
    slug: "fasika-2-2025",
    title: "Fasika 2 2025",
    description: "A second holiday variation with alternate visual pacing.",
    category: "Holiday Poster",
    image: "/Images/Graphics/fasika2_2025.png",
    publishedAt: "2025-04-12",
    detailsHtml:
      "<p>This version explores a different balance of illustration and typography while keeping the same event language and recognizable theme.</p>",
  },
  {
    slug: "freshman-bible-study-2024",
    title: "Freshman Bible Study 2024",
    description:
      "A student-focused invite graphic for recurring study sessions.",
    category: "Community Poster",
    image: "/Images/Graphics/freshman_bible_study_2024.png",
    publishedAt: "2024-09-02",
    detailsHtml:
      "<p>The poster prioritizes immediate readability and event utility, making it easy to reuse across announcements and reminders.</p>",
  },
  {
    slug: "gc-night-2025",
    title: "GC Night 2025",
    description: "A moody event graphic with a polished night-event aesthetic.",
    category: "Event Poster",
    image: "/Images/Graphics/gc_night_2025.png",
    publishedAt: "2025-05-01",
    detailsHtml:
      "<p>Dark framing, bright accents, and a compact information stack create a premium feel suitable for digital promotion.</p>",
  },
  {
    slug: "gospel-day-2023",
    title: "Gospel Day 2023",
    description: "A clean announcement visual for a themed day program.",
    category: "Event Poster",
    image: "/Images/Graphics/gospel_day_2023.png",
    publishedAt: "2023-08-19",
    detailsHtml:
      "<p>This layout emphasizes clarity first, with enough atmospheric detail to keep the banner lively without sacrificing readability.</p>",
  },
  {
    slug: "guddaa-jaalachuu-2024",
    title: "Guddaa Jaalachuu 2024",
    description: "A textured visual with a warm, expressive message tone.",
    category: "Campaign Art",
    image: "/Images/Graphics/guddaa_jaalachuu_2024.png",
    publishedAt: "2024-07-26",
    detailsHtml:
      "<p>Designed around layered depth and a prominent headline so the concept remains strong on both large screens and small thumbnails.</p>",
  },
  {
    slug: "kristoosiin-qofa",
    title: "Kristoosiin Qofa",
    description:
      "An eye-catching message graphic with a clear spiritual theme.",
    category: "Campaign Art",
    image: "/Images/Graphics/kristoosiin_qofa.png",
    publishedAt: "2025-01-21",
    detailsHtml:
      "<p>Built around contrast and centered composition to keep the message strong even when used in cropped layouts.</p>",
  },
  {
    slug: "lad-night-2023",
    title: "Lad Night 2023",
    description: "A lively night-event poster with a compact title stack.",
    category: "Event Poster",
    image: "/Images/Graphics/lad_night_2023.png",
    publishedAt: "2023-10-15",
    detailsHtml:
      "<p>Motion, glow, and balanced whitespace make this piece work across online event promotion and printed handouts.</p>",
  },
  {
    slug: "logo-wu",
    title: "Logo WU",
    description: "A logo exploration with simplified mark geometry.",
    category: "Brand Identity",
    image: "/Images/Graphics/logo_wu.png",
    publishedAt: "2024-03-03",
    detailsHtml:
      "<p>Minimal forms and a strong silhouette keep the logo flexible for avatars, headers, and small application spaces.</p>",
  },
  {
    slug: "mini-mission-2023",
    title: "Mini Mission 2023",
    description:
      "A compact mission-themed poster with an active layout rhythm.",
    category: "Event Poster",
    image: "/Images/Graphics/mini_mission_2023.png",
    publishedAt: "2023-06-02",
    detailsHtml:
      "<p>Created to be practical in quick-share environments, this graphic keeps the key details compact and immediately legible.</p>",
  },
  {
    slug: "welcome-2024",
    title: "Welcome 2024",
    description:
      "A welcoming graphic intended for recurring community openings.",
    category: "Seasonal Graphic",
    image: "/Images/Graphics/welcome_2024.png",
    publishedAt: "2024-01-01",
    detailsHtml:
      "<p>The design uses warm color transitions and a clear focal point to make the greeting feel inviting and visually calm.</p>",
  },
  {
    slug: "yesusiin-malee-2025",
    title: "Yesusiin Malee 2025",
    description: "A portrait-driven visual with a bold commemorative feel.",
    category: "Campaign Art",
    image: "/Images/Graphics/yesusiin_malee_2025.png",
    publishedAt: "2025-02-28",
    detailsHtml:
      "<p>This artwork leans on portrait framing, clear spacing, and a strong title treatment so it can function as a feature graphic or announcement cover.</p>",
  },
];

export const marketplaceItems: MarketplaceItem[] = legacyMarketplaceItems.map(
  (item) => ({
    slug: item.slug,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.type,
    coverImage: item.image,
    publishedAt: item.screenshots?.[0] ? "2025-01-01" : "2024-01-01",
    detailsHtml: buildMarketplaceDetailsHtml(item),
    version: item.version,
    license: item.license,
    technicalName: item.technicalName,
    website: item.website,
    compatibility: item.compatibility,
    warning: item.warning,
    livePreview: item.livePreview,
    supportUrl: item.supportUrl,
    contactEmail: item.contactEmail,
    link: item.link,
    downloads: item.downloads,
    upgradeUrl: item.upgradeUrl,
    highlights: item.highlights,
    screenshots: item.screenshots,
  }),
);

export const blogPosts: BlogPost[] = [
  {
    slug: "building-a-portfolio-cms",
    title: "Building a portfolio CMS that stays readable",
    excerpt:
      "How I structure content so design pages can scale without losing clarity.",
    coverImage: "/me4.png",
    publishedAt: "2026-03-14",
    tags: ["CMS", "Next.js", "Portfolio"],
    detailsHtml:
      "<p>The CMS approach here is intentionally simple: collection-based content, slugged detail pages, and rich HTML blocks for sections that need visual structure.</p><p>That keeps the portfolio flexible enough to add new work quickly while still letting the public-facing pages stay fast and predictable.</p><ul><li>Structured collections for graphics, marketplace, and blog content</li><li>Detail pages that render HTML content directly</li><li>Pagination for gallery-heavy sections</li></ul>",
  },
  {
    slug: "why-i-use-html-for-product-details",
    title: "Why product details are written in HTML here",
    excerpt:
      "Markdown is convenient, but some showcase pages need finer control over layout and emphasis.",
    coverImage: "/me4.png",
    publishedAt: "2026-02-20",
    tags: ["HTML", "Products", "Content Design"],
    detailsHtml:
      "<p>For portfolio products, the detail page is part marketing page and part documentation page. HTML gives me the control to group features, call out notes, and compose the section exactly the way the product needs it.</p><p>That makes the output more expressive than a plain paragraph and more reliable than a markdown renderer when I want a specific layout.</p>",
  },
  {
    slug: "keeping-graphics-pages-light",
    title: "Keeping graphics pages light while the catalog grows",
    excerpt:
      "Pagination keeps the gallery fast and easy to scan even when the collection gets larger.",
    coverImage: "/me4.png",
    publishedAt: "2026-01-09",
    tags: ["Performance", "Gallery", "UX"],
    detailsHtml:
      "<p>Large image collections can turn into a wall of thumbnails quickly. Pagination gives the user a sense of progress, keeps the page lighter, and makes future filtering easier to add later.</p>",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Sara Bekele",
    role: "Operations Lead, Aurora Distributors",
    quoteMd:
      "Lati rebuilt our Odoo sales workflow end to end. **Order processing time dropped by half** and the team actually enjoys using the system now. Reliable, fast, and genuinely collaborative.",
  },
  {
    name: "Daniel M.",
    role: "Founder, TechHabesha",
    quoteMd:
      "We hired Lati to customize our Odoo theme and the result looked *better than the demos we were comparing against*. Clean code, on time, and easy to hand off to our in-house team.",
  },
  {
    name: "Hanna Girma",
    role: "Product Manager",
    quoteMd:
      "Sharp eye for both UX and performance. Lati flagged issues we hadn't even noticed and shipped fixes the same week. Will absolutely work with again.",
  },
];

export const heroContent: HeroContent = {
  eyebrow: "Full Stack & Odoo ERP Developer",
  headline: "Building products people rely on.",
  bodyMd:
    "Available for freelance engagements worldwide. I specialize in Odoo customization, theme development, and full-stack application delivery backed by secure IAM integrations.\n\nI develop web applications, enterprise platforms, and Odoo solutions that prioritize performance, usability, and long-term maintainability.",
  cta1Label: "Get in touch",
  cta1Href: "/#contact",
  cta2Label: "Download CV",
  cta2Href: "/LatiTibabu_CV.pdf",
  cta3Label: "Hire me on Upwork",
  cta3Href:
    "https://www.upwork.com/freelancers/~0162435256404567a3?mp_source=share",
  imageEnabled: true,
  imageUrl: "/me4.png",
  imageAlt: "Lati Tibabu portrait",
  layout: "text-left-image-right",
  availabilityLabel: "Availability",
  availabilityValue: "Open for freelance work",
};
