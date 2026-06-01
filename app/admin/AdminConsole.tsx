"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import BlogContent from "../components/BlogContent";
import { supabaseBrowser } from "../lib/supabase/browser";

const STORAGE_BUCKET = "portfolio-media";
const DEFAULT_PLACEHOLDER_IMAGE = "https://placehold.co/600x400@2x.png";

type TabKey = "graphics" | "marketplace" | "blog";

type SessionUser = {
  email?: string | null;
};

type GraphicsRecord = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  image_path: string | null;
  published_at: string;
  details_html: string;
};

type MarketplaceRecord = {
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
};

type BlogRecord = {
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
};

type GraphicsForm = {
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

type MarketplaceForm = {
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

type BlogForm = {
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

const emptyGraphicsForm = (): GraphicsForm => ({
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

const emptyMarketplaceForm = (): MarketplaceForm => ({
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

const emptyBlogForm = (): BlogForm => ({
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

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const joinList = (items: string[] | null | undefined) => (items ?? []).join(", ");

const textValue = (value: string | null | undefined) => value ?? "";

const splitList = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const inputClass =
  "w-full rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] px-3 py-2 text-sm text-[var(--color-on-surface)] outline-none focus:border-[var(--color-electric-blue)]";

const labelClass = "space-y-2 text-sm text-[var(--color-on-surface-variant)]";

const sectionClass =
  "rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-5 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]";

export default function AdminConsole() {
  const router = useRouter();
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [activeTab, setActiveTab] = useState<TabKey>("graphics");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(
    "Sign in with Supabase to manage content.",
  );
  const [graphics, setGraphics] = useState<GraphicsRecord[]>([]);
  const [marketplace, setMarketplace] = useState<MarketplaceRecord[]>([]);
  const [blog, setBlog] = useState<BlogRecord[]>([]);
  const [graphicsForm, setGraphicsForm] =
    useState<GraphicsForm>(emptyGraphicsForm);
  const [graphicsFile, setGraphicsFile] = useState<File | null>(null);
  const [graphicsSlugManuallyEdited, setGraphicsSlugManuallyEdited] =
    useState(false);
  const [graphicsMetaExpanded, setGraphicsMetaExpanded] = useState(false);
  const [marketplaceForm, setMarketplaceForm] =
    useState<MarketplaceForm>(emptyMarketplaceForm);
  const [marketplaceSlugManuallyEdited, setMarketplaceSlugManuallyEdited] =
    useState(false);
  const [marketplaceMetaExpanded, setMarketplaceMetaExpanded] = useState(false);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlogForm);
  const [showBlogPreview, setShowBlogPreview] = useState(false);
  const [graphicsView, setGraphicsView] = useState<"list" | "new">("list");
  const [marketplaceView, setMarketplaceView] = useState<"list" | "new">("list");
  const [blogView, setBlogView] = useState<"list" | "new">("list");
  const [graphicsPage, setGraphicsPage] = useState(1);
  const [marketplacePage, setMarketplacePage] = useState(1);
  const [blogPage, setBlogPage] = useState(1);
  const [blogSlugManuallyEdited, setBlogSlugManuallyEdited] = useState(false);
  const [blogMetaExpanded, setBlogMetaExpanded] = useState(false);
  const [graphicsPreviewObjectUrl, setGraphicsPreviewObjectUrl] = useState("");

  const signedIn = useMemo(() => Boolean(sessionUser), [sessionUser]);
  const pageSize = 8;
  const pagedGraphics = useMemo(
    () => graphics.slice((graphicsPage - 1) * pageSize, graphicsPage * pageSize),
    [graphics, graphicsPage],
  );
  const pagedMarketplace = useMemo(
    () =>
      marketplace.slice(
        (marketplacePage - 1) * pageSize,
        marketplacePage * pageSize,
      ),
    [marketplace, marketplacePage],
  );
  const pagedBlog = useMemo(
    () => blog.slice((blogPage - 1) * pageSize, blogPage * pageSize),
    [blog, blogPage],
  );

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { data } = await supabaseBrowser.auth.getSession();
      if (!mounted) {
        return;
      }

      setSessionUser(
        data.session?.user ? { email: data.session.user.email } : null,
      );
      setLoadingSession(false);
    };

    initialize();

    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user ? { email: session.user.email } : null);
      setLoadingSession(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (signedIn) {
      void loadAll();
    }
  }, [signedIn]);

  useEffect(() => {
    if (blogSlugManuallyEdited) {
      return;
    }
    setBlogForm((current) => ({
      ...current,
      slug: slugify(current.title),
    }));
  }, [blogForm.title, blogSlugManuallyEdited]);

  useEffect(() => {
    if (graphicsSlugManuallyEdited) {
      return;
    }
    setGraphicsForm((current) => ({ ...current, slug: slugify(current.title) }));
  }, [graphicsForm.title, graphicsSlugManuallyEdited]);

  useEffect(() => {
    if (marketplaceSlugManuallyEdited) {
      return;
    }
    setMarketplaceForm((current) => ({ ...current, slug: slugify(current.name) }));
  }, [marketplaceForm.name, marketplaceSlugManuallyEdited]);

  useEffect(() => {
    if (!graphicsFile) {
      setGraphicsPreviewObjectUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(graphicsFile);
    setGraphicsPreviewObjectUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [graphicsFile]);

  const loadAll = async () => {
    setBusy(true);
    setMessage("Loading content from Supabase...");

    const [graphicsResult, marketplaceResult, blogResult] = await Promise.all([
      supabaseBrowser
        .from("graphics_items")
        .select("*")
        .order("published_at", { ascending: false }),
      supabaseBrowser
        .from("marketplace_items")
        .select("*")
        .order("published_at", { ascending: false }),
      supabaseBrowser
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false }),
    ]);

    setGraphics((graphicsResult.data as GraphicsRecord[]) ?? []);
    setMarketplace((marketplaceResult.data as MarketplaceRecord[]) ?? []);
    setBlog((blogResult.data as BlogRecord[]) ?? []);

    if (graphicsResult.error || marketplaceResult.error || blogResult.error) {
      setMessage(
        graphicsResult.error?.message ||
          marketplaceResult.error?.message ||
          blogResult.error?.message ||
          "Loaded with some empty sections.",
      );
    } else {
      setMessage("Content loaded successfully.");
    }

    setBusy(false);
  };

  const uploadGraphicsImage = async (file: File) => {
    const extension = file.name.split(".").pop() || "png";
    const filePath = `graphics/${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabaseBrowser.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType: file.type || "image/png",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabaseBrowser.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);
    return { imageUrl: data.publicUrl, imagePath: filePath };
  };

  const signIn = async () => {
    setAuthMessage("");
    setBusy(true);

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });

    if (error) {
      setAuthMessage(error.message);
      setBusy(false);
      return;
    }

    setAuthMessage("Signed in successfully.");
    setBusy(false);
    router.refresh();
  };

  const saveGraphics = async () => {
    const ensureUniqueGraphicsSlug = async (initialSlug: string, itemId?: string) => {
      let counter = 1;
      let candidate = initialSlug;
      while (true) {
        let query = supabaseBrowser
          .from("graphics_items")
          .select("id")
          .eq("slug", candidate)
          .limit(1);
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

    const baseSlug = slugify(graphicsForm.slug || graphicsForm.title);
    if (!baseSlug || !graphicsForm.title) {
      setMessage("Graphics items need a title.");
      return;
    }
    setBusy(true);
    try {
      let imageUrl = graphicsForm.imageUrl;
      let imagePath = graphicsForm.imagePath;

      if (graphicsFile) {
        const uploaded = await uploadGraphicsImage(graphicsFile);
        imageUrl = uploaded.imageUrl;
        imagePath = uploaded.imagePath;
      }
      const uniqueSlug = await ensureUniqueGraphicsSlug(
        baseSlug,
        graphicsForm.id ?? undefined,
      );

      const payload = {
        slug: uniqueSlug,
        title: graphicsForm.title,
        description: graphicsForm.description,
        category: graphicsForm.category,
        image_url: imageUrl.trim() || DEFAULT_PLACEHOLDER_IMAGE,
        image_path: imagePath,
        published_at: graphicsForm.publishedAt,
        details_html: graphicsForm.detailsHtml,
      };

      const query = graphicsForm.id
        ? supabaseBrowser
            .from("graphics_items")
            .update(payload)
            .eq("id", graphicsForm.id)
        : supabaseBrowser.from("graphics_items").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(
        graphicsForm.id
          ? `Graphics item updated (${uniqueSlug}).`
          : `Graphics item created (${uniqueSlug}).`,
      );
      setGraphicsForm(emptyGraphicsForm());
      setGraphicsFile(null);
      setGraphicsSlugManuallyEdited(false);
      setGraphicsMetaExpanded(false);
      setGraphicsView("list");
      await loadAll();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save graphics item.",
      );
    } finally {
      setBusy(false);
    }
  };

  const deleteGraphics = async (id: string) => {
    if (!confirm("Delete this graphics item?")) {
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser
      .from("graphics_items")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Graphics item deleted.");
    await loadAll();
  };

  const saveMarketplace = async () => {
    const ensureUniqueMarketplaceSlug = async (
      initialSlug: string,
      itemId?: string,
    ) => {
      let counter = 1;
      let candidate = initialSlug;
      while (true) {
        let query = supabaseBrowser
          .from("marketplace_items")
          .select("id")
          .eq("slug", candidate)
          .limit(1);
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

    const baseSlug = slugify(marketplaceForm.slug || marketplaceForm.name);
    if (!baseSlug || !marketplaceForm.name) {
      setMessage("Marketplace items need a name.");
      return;
    }
    setBusy(true);
    try {
      const uniqueSlug = await ensureUniqueMarketplaceSlug(
        baseSlug,
        marketplaceForm.id ?? undefined,
      );
      const payload = {
        slug: uniqueSlug,
        name: marketplaceForm.name,
        description: marketplaceForm.description,
        price: marketplaceForm.price,
        category: marketplaceForm.category,
        cover_image_url:
          marketplaceForm.coverImageUrl.trim() || DEFAULT_PLACEHOLDER_IMAGE,
        published_at: marketplaceForm.publishedAt,
        details_html: marketplaceForm.detailsHtml,
        version: marketplaceForm.version,
        license: marketplaceForm.license,
        technical_name: marketplaceForm.technicalName,
        website: marketplaceForm.website,
        compatibility: marketplaceForm.compatibility,
        warning: marketplaceForm.warning,
        live_preview: marketplaceForm.livePreview,
        support_url: marketplaceForm.supportUrl,
        contact_email: marketplaceForm.contactEmail,
        link: marketplaceForm.link,
        downloads: marketplaceForm.downloads,
        upgrade_url: marketplaceForm.upgradeUrl,
        highlights: splitList(marketplaceForm.highlightsText),
        screenshots: splitList(marketplaceForm.screenshotsText),
      };

      const query = marketplaceForm.id
        ? supabaseBrowser
            .from("marketplace_items")
            .update(payload)
            .eq("id", marketplaceForm.id)
        : supabaseBrowser.from("marketplace_items").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(
        marketplaceForm.id
          ? `Marketplace item updated (${uniqueSlug}).`
          : `Marketplace item created (${uniqueSlug}).`,
      );
      setMarketplaceForm(emptyMarketplaceForm());
      setMarketplaceSlugManuallyEdited(false);
      setMarketplaceMetaExpanded(false);
      setMarketplaceView("list");
      await loadAll();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save marketplace item.",
      );
    } finally {
      setBusy(false);
    }
  };

  const deleteMarketplace = async (id: string) => {
    if (!confirm("Delete this marketplace item?")) {
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser
      .from("marketplace_items")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Marketplace item deleted.");
    await loadAll();
  };

  const saveBlog = async () => {
    const ensureUniqueBlogSlug = async (initialSlug: string, postId?: string) => {
      let counter = 1;
      let candidate = initialSlug;

      while (true) {
        let query = supabaseBrowser
          .from("blog_posts")
          .select("id")
          .eq("slug", candidate)
          .limit(1);

        if (postId) {
          query = query.neq("id", postId);
        }

        const { data, error } = await query;
        if (error) {
          throw error;
        }

        if (!data || data.length === 0) {
          return candidate;
        }

        counter += 1;
        candidate = `${initialSlug}-${counter}`;
      }
    };

    const baseSlug = slugify(blogForm.slug || blogForm.title);
    if (!baseSlug || !blogForm.title) {
      setMessage("Blog posts need a title.");
      return;
    }
    setBusy(true);
    try {
      const uniqueSlug = await ensureUniqueBlogSlug(baseSlug, blogForm.id ?? undefined);
      const payload = {
        slug: uniqueSlug,
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        cover_image_url: blogForm.useCoverImage
          ? blogForm.coverImageUrl.trim() || DEFAULT_PLACEHOLDER_IMAGE
          : DEFAULT_PLACEHOLDER_IMAGE,
        published_at: blogForm.publishedAt,
        tags: splitList(blogForm.tagsText),
        details_html: blogForm.detailsHtml,
        content_format: blogForm.contentFormat,
        is_draft: blogForm.isDraft,
      };

      const query = blogForm.id
        ? supabaseBrowser
            .from("blog_posts")
            .update(payload)
            .eq("id", blogForm.id)
        : supabaseBrowser.from("blog_posts").insert(payload);

      const { error } = await query;
      if (error) {
        throw error;
      }

      setMessage(
        blogForm.isDraft
          ? `Blog draft saved (${uniqueSlug}).`
          : blogForm.id
            ? `Blog post updated and published (${uniqueSlug}).`
            : `Blog post published (${uniqueSlug}).`,
      );
      setBlogForm(emptyBlogForm());
      setShowBlogPreview(false);
      setBlogSlugManuallyEdited(false);
      setBlogView("list");
      await loadAll();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save blog post.",
      );
    } finally {
      setBusy(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Delete this blog post?")) {
      return;
    }

    setBusy(true);
    const { error } = await supabaseBrowser
      .from("blog_posts")
      .delete()
      .eq("id", id);
    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Blog post deleted.");
    await loadAll();
  };

  if (loadingSession) {
    return (
      <div className={sectionClass}>
        <p className="text-sm text-[var(--color-on-surface-variant)]">
          Loading admin session...
        </p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-[560px] rounded-3xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_20px_25px_-5px_rgba(15,23,42,0.05)]">
        <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
          Admin Login
        </p>
        <h1 className="mt-3 font-heading text-[32px] text-[var(--color-on-surface)]">
          Sign in to manage content
        </h1>
        <p className="mt-2 text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)]">
          Use a Supabase Auth user account to open the dashboard, then create,
          edit, or delete marketplace items, graphics, and blog posts.
        </p>

        <div className="mt-6 space-y-4">
          <label className={labelClass}>
            Email
            <input
              className={inputClass}
              type="email"
              value={authEmail}
              onChange={(event) => setAuthEmail(event.target.value)}
            />
          </label>
          <label className={labelClass}>
            Password
            <input
              className={inputClass}
              type="password"
              value={authPassword}
              onChange={(event) => setAuthPassword(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="inline-flex items-center rounded-lg bg-[var(--color-electric-blue)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60"
            onClick={signIn}
            disabled={busy}
          >
            Sign in
          </button>
          {authMessage && (
            <p className="text-sm text-[var(--color-on-surface-variant)]">
              {authMessage}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 px-6 py-8 lg:grid-cols-[220px_1fr]">
      <aside className={`${sectionClass} h-fit`}>
        <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
          CMS
        </p>
        <nav className="mt-4 space-y-2">
          {(["graphics", "marketplace", "blog"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm font-semibold uppercase tracking-[0.12em] ${
                activeTab === tab
                  ? "bg-[var(--color-electric-blue)] text-white"
                  : "text-[var(--color-on-surface-variant)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>

      <div className="space-y-4">
        <p className="text-sm text-[var(--color-on-surface-variant)]">{message}</p>

      {activeTab === "graphics" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
              Graphics
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setGraphicsView("list")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  graphicsView === "list"
                    ? "bg-[var(--color-electric-blue)] text-white"
                    : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => {
                  setGraphicsForm(emptyGraphicsForm());
                  setGraphicsFile(null);
                  setGraphicsSlugManuallyEdited(false);
                  setGraphicsMetaExpanded(false);
                  setGraphicsView("new");
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  graphicsView === "new"
                    ? "bg-[var(--color-electric-blue)] text-white"
                    : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                New
              </button>
            </div>
          </div>
          {graphicsView === "list" ? (
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              Graphics items
            </h2>
            <div className="mt-5 space-y-4">
              {pagedGraphics.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-[var(--color-surface-border)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {item.image_url?.trim() ? (
                        <Image
                          src={item.image_url.trim()}
                          alt={item.title}
                          width={56}
                          height={56}
                          className="h-14 w-14 rounded-md border border-[var(--color-surface-border)] object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-md border border-[var(--color-surface-border)] text-[10px] uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                          No image
                        </div>
                      )}
                      <div>
                      <h3 className="font-semibold text-[var(--color-on-surface)]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">
                        {item.slug}
                      </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                        onClick={() => {
                          setGraphicsForm({
                            id: item.id,
                            slug: item.slug,
                            title: item.title,
                            description: item.description,
                            category: item.category,
                            imageUrl: textValue(item.image_url),
                            imagePath: textValue(item.image_path),
                            publishedAt: item.published_at,
                            detailsHtml: item.details_html,
                          });
                          setGraphicsFile(null);
                          setGraphicsSlugManuallyEdited(true);
                          setGraphicsView("new");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-error)]"
                        onClick={() => deleteGraphics(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
              <span>
                Page {graphicsPage} of {Math.max(1, Math.ceil(graphics.length / pageSize))}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={graphicsPage <= 1}
                  onClick={() => setGraphicsPage((current) => Math.max(1, current - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={graphicsPage >= Math.max(1, Math.ceil(graphics.length / pageSize))}
                  onClick={() =>
                    setGraphicsPage((current) =>
                      Math.min(Math.max(1, Math.ceil(graphics.length / pageSize)), current + 1),
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          ) : (
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              {graphicsForm.id
                ? "Update graphics item"
                : "Create graphics item"}
            </h2>
            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <label className={labelClass}>
                    Image file for Supabase Storage
                    <input
                      className={inputClass}
                      type="file"
                      accept="image/*"
                      onChange={(event) =>
                        setGraphicsFile(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Image URL fallback
                    <input
                      className={inputClass}
                      value={graphicsForm.imageUrl}
                      onChange={(event) =>
                        setGraphicsForm({
                          ...graphicsForm,
                          imageUrl: event.target.value,
                        })
                      }
                    />
                  </label>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    Upload is used first. URL fallback is used when no file is selected.
                  </p>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
                    Preview
                  </p>
                  <div className="overflow-hidden rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)]">
                    <div className="relative aspect-[16/10] bg-[var(--color-surface-container)]">
                      <Image
                        src={
                          graphicsPreviewObjectUrl ||
                          graphicsForm.imageUrl.trim() ||
                          DEFAULT_PLACEHOLDER_IMAGE
                        }
                        alt={graphicsForm.title || "Graphics preview image"}
                        fill
                        sizes="(min-width: 1024px) 360px, 100vw"
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-2 p-3">
                      <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                        {graphicsForm.title || "Untitled graphic"}
                      </p>
                      <p className="line-clamp-3 text-xs text-[var(--color-on-surface-variant)]">
                        {graphicsForm.description || "Add a short description for better gallery context."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <label className={labelClass}>
                Title
                <input
                  className={inputClass}
                  value={graphicsForm.title}
                  onChange={(event) =>
                    setGraphicsForm({
                      ...graphicsForm,
                      title: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Description
                <textarea
                  className={inputClass}
                  rows={3}
                  value={graphicsForm.description}
                  onChange={(event) =>
                    setGraphicsForm({
                      ...graphicsForm,
                      description: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  value={graphicsForm.slug}
                  onChange={(event) => {
                    setGraphicsSlugManuallyEdited(true);
                    setGraphicsForm({
                      ...graphicsForm,
                      slug: slugify(event.target.value),
                    });
                  }}
                />
              </label>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Slug is auto-generated from title. On conflict, a suffix is added when saving.
              </p>
              <label className={labelClass}>
                HTML details
                <textarea
                  className={inputClass}
                  rows={8}
                  value={graphicsForm.detailsHtml}
                  onChange={(event) =>
                    setGraphicsForm({
                      ...graphicsForm,
                      detailsHtml: event.target.value,
                    })
                  }
                />
              </label>
              <details
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4"
                open={graphicsMetaExpanded}
                onToggle={(event) =>
                  setGraphicsMetaExpanded((event.target as HTMLDetailsElement).open)
                }
              >
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-on-surface)]">
                  Other fields
                </summary>
                <div className="mt-4 grid gap-4">
                  <label className={labelClass}>
                    Category
                    <input
                      className={inputClass}
                      value={graphicsForm.category}
                      onChange={(event) =>
                        setGraphicsForm({
                          ...graphicsForm,
                          category: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Published date
                    <input
                      className={inputClass}
                      type="date"
                      value={graphicsForm.publishedAt}
                      onChange={(event) =>
                        setGraphicsForm({
                          ...graphicsForm,
                          publishedAt: event.target.value,
                        })
                      }
                    />
                  </label>
                </div>
              </details>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-electric-blue)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                  onClick={saveGraphics}
                  disabled={busy}
                >
                  {graphicsForm.id ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
              Marketplace
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMarketplaceView("list")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  marketplaceView === "list"
                    ? "bg-[var(--color-electric-blue)] text-white"
                    : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => {
                  setMarketplaceForm(emptyMarketplaceForm());
                  setMarketplaceSlugManuallyEdited(false);
                  setMarketplaceMetaExpanded(false);
                  setMarketplaceView("new");
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  marketplaceView === "new"
                    ? "bg-[var(--color-electric-blue)] text-white"
                    : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                New
              </button>
            </div>
          </div>
          {marketplaceView === "list" ? (
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              Marketplace items
            </h2>
            <div className="mt-5 space-y-4">
              {pagedMarketplace.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-[var(--color-surface-border)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[var(--color-on-surface)]">
                        {item.name}
                      </h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">
                        {item.slug}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                        onClick={() => {
                          setMarketplaceForm({
                            id: item.id,
                            slug: item.slug,
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            category: item.category,
                            coverImageUrl: textValue(item.cover_image_url),
                            publishedAt: item.published_at,
                            detailsHtml: item.details_html,
                            version: item.version,
                            license: item.license,
                            technicalName: item.technical_name,
                            website: textValue(item.website),
                            compatibility: textValue(item.compatibility),
                            warning: textValue(item.warning),
                            livePreview: textValue(item.live_preview),
                            supportUrl: textValue(item.support_url),
                            contactEmail: textValue(item.contact_email),
                            link: item.link,
                            downloads: textValue(item.downloads),
                            upgradeUrl: textValue(item.upgrade_url),
                            highlightsText: joinList(item.highlights),
                            screenshotsText: joinList(item.screenshots),
                          });
                          setMarketplaceSlugManuallyEdited(true);
                          setMarketplaceView("new");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-error)]"
                        onClick={() => deleteMarketplace(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
              <span>
                Page {marketplacePage} of {Math.max(1, Math.ceil(marketplace.length / pageSize))}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={marketplacePage <= 1}
                  onClick={() =>
                    setMarketplacePage((current) => Math.max(1, current - 1))
                  }
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={marketplacePage >= Math.max(1, Math.ceil(marketplace.length / pageSize))}
                  onClick={() =>
                    setMarketplacePage((current) =>
                      Math.min(Math.max(1, Math.ceil(marketplace.length / pageSize)), current + 1),
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          ) : (
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              {marketplaceForm.id
                ? "Update marketplace item"
                : "Create marketplace item"}
            </h2>
            <div className="mt-5 grid gap-4">
              <label className={labelClass}>
                Name
                <input
                  className={inputClass}
                  value={marketplaceForm.name}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      name: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  value={marketplaceForm.slug}
                  onChange={(event) => {
                    setMarketplaceSlugManuallyEdited(true);
                    setMarketplaceForm({
                      ...marketplaceForm,
                      slug: slugify(event.target.value),
                    });
                  }}
                />
              </label>
              <p className="text-xs text-[var(--color-on-surface-variant)]">
                Slug is auto-generated from name. On conflict, a suffix is added when saving.
              </p>
              <label className={labelClass}>
                Description
                <textarea
                  className={inputClass}
                  rows={3}
                  value={marketplaceForm.description}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      description: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                HTML details
                <textarea
                  className={inputClass}
                  rows={8}
                  value={marketplaceForm.detailsHtml}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      detailsHtml: event.target.value,
                    })
                  }
                />
              </label>
              <details
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4"
                open={marketplaceMetaExpanded}
                onToggle={(event) =>
                  setMarketplaceMetaExpanded((event.target as HTMLDetailsElement).open)
                }
              >
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-on-surface)]">
                  Other fields
                </summary>
                <div className="mt-4 grid gap-4">
              <label className={labelClass}>
                Price
                <input
                  className={inputClass}
                  value={marketplaceForm.price}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      price: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Category
                <input
                  className={inputClass}
                  value={marketplaceForm.category}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      category: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Cover image URL
                <input
                  className={inputClass}
                  value={marketplaceForm.coverImageUrl}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      coverImageUrl: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Published date
                <input
                  className={inputClass}
                  type="date"
                  value={marketplaceForm.publishedAt}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      publishedAt: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Version
                <input
                  className={inputClass}
                  value={marketplaceForm.version}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      version: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                License
                <input
                  className={inputClass}
                  value={marketplaceForm.license}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      license: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Technical name
                <input
                  className={inputClass}
                  value={marketplaceForm.technicalName}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      technicalName: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Website
                <input
                  className={inputClass}
                  value={marketplaceForm.website}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      website: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Compatibility
                <input
                  className={inputClass}
                  value={marketplaceForm.compatibility}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      compatibility: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Warning
                <input
                  className={inputClass}
                  value={marketplaceForm.warning}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      warning: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Live preview URL
                <input
                  className={inputClass}
                  value={marketplaceForm.livePreview}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      livePreview: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Support URL
                <input
                  className={inputClass}
                  value={marketplaceForm.supportUrl}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      supportUrl: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Contact email
                <input
                  className={inputClass}
                  value={marketplaceForm.contactEmail}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      contactEmail: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Listing URL
                <input
                  className={inputClass}
                  value={marketplaceForm.link}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      link: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Downloads
                <input
                  className={inputClass}
                  value={marketplaceForm.downloads}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      downloads: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Upgrade URL
                <input
                  className={inputClass}
                  value={marketplaceForm.upgradeUrl}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      upgradeUrl: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Highlights, comma separated
                <textarea
                  className={inputClass}
                  rows={3}
                  value={marketplaceForm.highlightsText}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      highlightsText: event.target.value,
                    })
                  }
                />
              </label>
              <label className={labelClass}>
                Screenshots, comma separated
                <textarea
                  className={inputClass}
                  rows={3}
                  value={marketplaceForm.screenshotsText}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      screenshotsText: event.target.value,
                    })
                  }
                />
              </label>
                </div>
              </details>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-electric-blue)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                  onClick={saveMarketplace}
                  disabled={busy}
                >
                  {marketplaceForm.id ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {activeTab === "blog" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
              Blog
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBlogView("list")}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  blogView === "list"
                    ? "bg-[var(--color-electric-blue)] text-white"
                    : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => {
                  setBlogForm(emptyBlogForm());
                  setShowBlogPreview(false);
                  setBlogSlugManuallyEdited(false);
                  setBlogMetaExpanded(false);
                  setBlogView("new");
                }}
                className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                  blogView === "new"
                    ? "bg-[var(--color-electric-blue)] text-white"
                    : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                }`}
              >
                New
              </button>
            </div>
          </div>
          {blogView === "list" ? (
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              Blog posts
            </h2>
            <div className="mt-5 space-y-4">
              {pagedBlog.map((item) => (
                <article
                  key={item.id}
                  className="rounded-xl border border-[var(--color-surface-border)] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[var(--color-on-surface)]">
                        {item.title}
                      </h3>
                      <p className="text-sm text-[var(--color-on-surface-variant)]">
                        {item.slug}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="tag-chip">
                          {item.content_format === "md" ? "Markdown" : "HTML"}
                        </span>
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            item.is_draft
                              ? "bg-[var(--color-surface-container)] text-[var(--color-on-surface-variant)]"
                              : "bg-[var(--color-success-teal)] text-white"
                          }`}
                        >
                          {item.is_draft ? "Draft" : "Published"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]"
                        onClick={() => {
                          setBlogForm({
                            id: item.id,
                            slug: item.slug,
                            title: item.title,
                            excerpt: item.excerpt,
                            useCoverImage:
                              textValue(item.cover_image_url).trim() !==
                              DEFAULT_PLACEHOLDER_IMAGE,
                            coverImageUrl: textValue(item.cover_image_url),
                            publishedAt: item.published_at,
                            tagsText: joinList(item.tags),
                            detailsHtml: item.details_html,
                            contentFormat: item.content_format ?? "html",
                            isDraft: item.is_draft ?? false,
                          });
                          setBlogSlugManuallyEdited(true);
                          setShowBlogPreview(false);
                          setBlogMetaExpanded(false);
                          setBlogView("new");
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-[var(--color-surface-border)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-error)]"
                        onClick={() => deleteBlog(item.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-sm text-[var(--color-on-surface-variant)]">
              <span>Page {blogPage} of {Math.max(1, Math.ceil(blog.length / pageSize))}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={blogPage <= 1}
                  onClick={() => setBlogPage((current) => Math.max(1, current - 1))}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="rounded border border-[var(--color-surface-border)] px-3 py-1 disabled:opacity-50"
                  disabled={blogPage >= Math.max(1, Math.ceil(blog.length / pageSize))}
                  onClick={() =>
                    setBlogPage((current) =>
                      Math.min(Math.max(1, Math.ceil(blog.length / pageSize)), current + 1),
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>
          ) : (
          <div
            className={`grid gap-4 ${showBlogPreview ? "xl:grid-cols-[minmax(0,1fr)_520px]" : ""}`}
          >
            <div className={sectionClass}>
              <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
                {blogForm.id ? "Update blog post" : "Create blog post"}
              </h2>
              <div className="mt-5 grid gap-4">
                <label className={labelClass}>
                  Title
                  <input
                    className={inputClass}
                    value={blogForm.title}
                    onChange={(event) =>
                      setBlogForm({ ...blogForm, title: event.target.value })
                    }
                  />
                </label>
                <label className={labelClass}>
                  Slug
                  <input
                    className={inputClass}
                    value={blogForm.slug}
                    onChange={(event) => {
                      setBlogSlugManuallyEdited(true);
                      setBlogForm({ ...blogForm, slug: slugify(event.target.value) });
                    }}
                  />
                </label>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  Slug is auto-generated from title. If the slug already exists, a numeric suffix is added when saving.
                </p>
                <div className={labelClass}>
                  <p>Content format</p>
                  <div className="flex gap-2">
                    {(["html", "md"] as const).map((format) => (
                      <button
                        key={format}
                        type="button"
                        className={`rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
                          blogForm.contentFormat === format
                            ? "bg-[var(--color-electric-blue)] text-white"
                            : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
                        }`}
                        onClick={() =>
                          setBlogForm({
                            ...blogForm,
                            contentFormat: format,
                          })
                        }
                      >
                        {format === "md" ? "Markdown" : "HTML"}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm text-[var(--color-on-surface-variant)]">
                  <input
                    type="checkbox"
                    checked={blogForm.useCoverImage}
                    onChange={(event) =>
                      setBlogForm({
                        ...blogForm,
                        useCoverImage: event.target.checked,
                      })
                    }
                  />
                  Include cover image
                </label>
                <label className={labelClass}>
                  {blogForm.contentFormat === "md"
                    ? "Markdown content"
                    : "HTML content"}
                  <textarea
                    className={inputClass}
                    rows={14}
                    value={blogForm.detailsHtml}
                    onChange={(event) =>
                      setBlogForm({
                        ...blogForm,
                        detailsHtml: event.target.value,
                      })
                    }
                  />
                </label>
              <details
                className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-4"
                open={blogMetaExpanded}
                onToggle={(event) =>
                  setBlogMetaExpanded((event.target as HTMLDetailsElement).open)
                }
              >
                <summary className="cursor-pointer text-sm font-semibold text-[var(--color-on-surface)]">
                  Other fields
                </summary>
                <div className="mt-4 grid gap-4">
                  <label className={labelClass}>
                    Excerpt
                    <textarea
                      className={inputClass}
                      rows={3}
                      value={blogForm.excerpt}
                      onChange={(event) =>
                        setBlogForm({ ...blogForm, excerpt: event.target.value })
                      }
                    />
                  </label>
                  {blogForm.useCoverImage && (
                    <label className={labelClass}>
                      Cover image URL
                      <input
                        className={inputClass}
                        value={blogForm.coverImageUrl}
                        onChange={(event) =>
                          setBlogForm({
                            ...blogForm,
                            coverImageUrl: event.target.value,
                          })
                        }
                      />
                    </label>
                  )}
                  <label className={labelClass}>
                    Published date
                    <input
                      className={inputClass}
                      type="date"
                      value={blogForm.publishedAt}
                      onChange={(event) =>
                        setBlogForm({
                          ...blogForm,
                          publishedAt: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label className={labelClass}>
                    Tags, comma separated
                    <input
                      className={inputClass}
                      value={blogForm.tagsText}
                      onChange={(event) =>
                        setBlogForm({ ...blogForm, tagsText: event.target.value })
                      }
                    />
                  </label>
                  <label className="flex items-center gap-3 rounded-lg border border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] p-3 text-sm text-[var(--color-on-surface-variant)]">
                    <input
                      type="checkbox"
                      checked={blogForm.isDraft}
                      onChange={(event) =>
                        setBlogForm({
                          ...blogForm,
                          isDraft: event.target.checked,
                        })
                      }
                    />
                    Save as draft and keep this post off the public blog
                  </label>
                </div>
              </details>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-electric-blue)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                  onClick={saveBlog}
                  disabled={busy}
                >
                  {blogForm.isDraft
                    ? "Save draft"
                    : blogForm.id
                      ? "Update & publish"
                      : "Publish"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--color-electric-blue)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]"
                  onClick={() => setShowBlogPreview((current) => !current)}
                >
                  {showBlogPreview ? "Close right preview" : "Open right preview"}
                </button>
              </div>
              </div>
            </div>
            {showBlogPreview && (
              <aside className={`${sectionClass} h-fit xl:sticky xl:top-24`}>
                <article className="rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-background)] p-5">
                  <div className="flex flex-wrap gap-2">
                    <span className="tag-chip">
                      {blogForm.contentFormat === "md" ? "Markdown" : "HTML"}
                    </span>
                    <span className="tag-chip">
                      {blogForm.isDraft ? "Draft preview" : "Publish preview"}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-[30px] leading-[1.15] tracking-[-0.03em] text-[var(--color-on-surface)]">
                    {blogForm.title || "Untitled blog post"}
                  </h3>
                  {blogForm.excerpt && (
                    <p className="mt-3 text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)]">
                      {blogForm.excerpt}
                    </p>
                  )}
                  <div className="mt-6 border-t border-[var(--color-surface-border)] pt-6">
                    {blogForm.detailsHtml ? (
                      <BlogContent
                        content={blogForm.detailsHtml}
                        format={blogForm.contentFormat}
                      />
                    ) : (
                      <p className="text-sm text-[var(--color-on-surface-variant)]">
                        Start writing to preview the post content.
                      </p>
                    )}
                  </div>
                </article>
              </aside>
            )}
          </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
