"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BlogContent from "../components/BlogContent";
import { supabaseBrowser } from "../lib/supabase/browser";

const STORAGE_BUCKET = "portfolio-media";

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
  coverImageUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  tagsText: "",
  detailsHtml: "",
  contentFormat: "html",
  isDraft: true,
});

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
  const [marketplaceForm, setMarketplaceForm] =
    useState<MarketplaceForm>(emptyMarketplaceForm);
  const [blogForm, setBlogForm] = useState<BlogForm>(emptyBlogForm);
  const [showBlogPreview, setShowBlogPreview] = useState(false);

  const signedIn = useMemo(() => Boolean(sessionUser), [sessionUser]);

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

  const signOut = async () => {
    setBusy(true);
    await supabaseBrowser.auth.signOut();
    setSessionUser(null);
    setBusy(false);
    setMessage("Signed out.");
  };

  const saveGraphics = async () => {
    if (!graphicsForm.slug || !graphicsForm.title) {
      setMessage("Graphics items need a slug and title.");
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

      const payload = {
        slug: graphicsForm.slug,
        title: graphicsForm.title,
        description: graphicsForm.description,
        category: graphicsForm.category,
        image_url: imageUrl,
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
        graphicsForm.id ? "Graphics item updated." : "Graphics item created.",
      );
      setGraphicsForm(emptyGraphicsForm());
      setGraphicsFile(null);
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
    if (!marketplaceForm.slug || !marketplaceForm.name) {
      setMessage("Marketplace items need a slug and name.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        slug: marketplaceForm.slug,
        name: marketplaceForm.name,
        description: marketplaceForm.description,
        price: marketplaceForm.price,
        category: marketplaceForm.category,
        cover_image_url: marketplaceForm.coverImageUrl,
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
          ? "Marketplace item updated."
          : "Marketplace item created.",
      );
      setMarketplaceForm(emptyMarketplaceForm());
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
    if (!blogForm.slug || !blogForm.title) {
      setMessage("Blog posts need a slug and title.");
      return;
    }

    setBusy(true);
    try {
      const payload = {
        slug: blogForm.slug,
        title: blogForm.title,
        excerpt: blogForm.excerpt,
        cover_image_url: blogForm.coverImageUrl,
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
          ? "Blog draft saved."
          : blogForm.id
            ? "Blog post updated and published."
            : "Blog post published.",
      );
      setBlogForm(emptyBlogForm());
      setShowBlogPreview(false);
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
    <div className="space-y-8 px-6 py-10">
      <div className={sectionClass}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
              Admin Dashboard
            </p>
            <h1 className="mt-2 font-heading text-[32px] text-[var(--color-on-surface)]">
              Content manager
            </h1>
            <p className="mt-2 text-[15px] text-[var(--color-on-surface-variant)]">
              Signed in as {sessionUser?.email ?? "Supabase user"}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]"
              onClick={loadAll}
              disabled={busy}
            >
              Refresh
            </button>
            <button
              type="button"
              className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]"
              onClick={signOut}
              disabled={busy}
            >
              Sign out
            </button>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--color-on-surface-variant)]">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {(["graphics", "marketplace", "blog"] as TabKey[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] ${
              activeTab === tab
                ? "bg-[var(--color-electric-blue)] text-white"
                : "border border-[var(--color-surface-border)] text-[var(--color-on-surface-variant)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "graphics" && (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              Graphics items
            </h2>
            <div className="mt-5 space-y-4">
              {graphics.map((item) => (
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
          </div>

          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              {graphicsForm.id
                ? "Update graphics item"
                : "Create graphics item"}
            </h2>
            <div className="mt-5 grid gap-4">
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  value={graphicsForm.slug}
                  onChange={(event) =>
                    setGraphicsForm({
                      ...graphicsForm,
                      slug: event.target.value,
                    })
                  }
                />
              </label>
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
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-electric-blue)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                  onClick={saveGraphics}
                  disabled={busy}
                >
                  {graphicsForm.id ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em]"
                  onClick={() => {
                    setGraphicsForm(emptyGraphicsForm());
                    setGraphicsFile(null);
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "marketplace" && (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              Marketplace items
            </h2>
            <div className="mt-5 space-y-4">
              {marketplace.map((item) => (
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
          </div>

          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              {marketplaceForm.id
                ? "Update marketplace item"
                : "Create marketplace item"}
            </h2>
            <div className="mt-5 grid gap-4">
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  value={marketplaceForm.slug}
                  onChange={(event) =>
                    setMarketplaceForm({
                      ...marketplaceForm,
                      slug: event.target.value,
                    })
                  }
                />
              </label>
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
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-lg bg-[var(--color-electric-blue)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white"
                  onClick={saveMarketplace}
                  disabled={busy}
                >
                  {marketplaceForm.id ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em]"
                  onClick={() => setMarketplaceForm(emptyMarketplaceForm())}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "blog" && (
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              Blog posts
            </h2>
            <div className="mt-5 space-y-4">
              {blog.map((item) => (
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
                            coverImageUrl: textValue(item.cover_image_url),
                            publishedAt: item.published_at,
                            tagsText: joinList(item.tags),
                            detailsHtml: item.details_html,
                            contentFormat: item.content_format ?? "html",
                            isDraft: item.is_draft ?? false,
                          });
                          setShowBlogPreview(false);
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
          </div>

          <div className={sectionClass}>
            <h2 className="font-heading text-[24px] text-[var(--color-on-surface)]">
              {blogForm.id ? "Update blog post" : "Create blog post"}
            </h2>
            <div className="mt-5 grid gap-4">
              <label className={labelClass}>
                Slug
                <input
                  className={inputClass}
                  value={blogForm.slug}
                  onChange={(event) =>
                    setBlogForm({ ...blogForm, slug: event.target.value })
                  }
                />
              </label>
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
                  {showBlogPreview ? "Hide preview" : "Preview"}
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[var(--color-surface-border)] px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em]"
                  onClick={() => {
                    setBlogForm(emptyBlogForm());
                    setShowBlogPreview(false);
                  }}
                >
                  Clear
                </button>
              </div>
              {showBlogPreview && (
                <article className="mt-3 rounded-xl border border-[var(--color-surface-border)] bg-[var(--color-background)] p-5">
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
