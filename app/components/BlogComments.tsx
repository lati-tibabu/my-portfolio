"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabaseBrowser } from "../lib/supabase/browser";

type BlogComment = {
  id: string;
  name: string;
  body: string;
  created_at: string;
};

type BlogCommentsProps = {
  postId?: string;
};

const formatCommentDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(new Date(value));

export default function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [website, setWebsite] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!postId || !supabaseBrowser) {
      setLoading(false);
      return;
    }

    let active = true;
    const loadComments = async () => {
      const { data } = await supabaseBrowser
        .from("blog_comments")
        .select("id,name,body,created_at")
        .eq("blog_post_id", postId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (active) {
        setComments((data as BlogComment[]) ?? []);
        setLoading(false);
      }
    };

    loadComments();
    return () => {
      active = false;
    };
  }, [postId]);

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    // Quiet honeypot for basic bot protection.
    if (website.trim()) {
      setMessage("Thanks for stopping by.");
      return;
    }

    const trimmedBody = body.trim();
    const trimmedName = name.trim() || "Anonymous";
    if (!postId || !trimmedBody) {
      setMessage("Please write a comment first.");
      return;
    }
    if (trimmedName.length > 80 || trimmedBody.length > 2000) {
      setMessage("Please keep your name under 80 characters and comment under 2,000.");
      return;
    }

    setSubmitting(true);
    const { error } = await supabaseBrowser.from("blog_comments").insert({
      blog_post_id: postId,
      name: trimmedName,
      body: trimmedBody,
      is_approved: true,
    });

    if (error) {
      setMessage(error.message || "Could not post your comment.");
    } else {
      setBody("");
      setMessage("Comment posted. Thanks for joining the conversation.");
      const { data } = await supabaseBrowser
        .from("blog_comments")
        .select("id,name,body,created_at")
        .eq("blog_post_id", postId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      setComments((data as BlogComment[]) ?? []);
    }
    setSubmitting(false);
  };

  return (
    <section className="mt-14 border-t-2 border-[var(--color-on-surface)] pt-8" aria-labelledby="comments-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">
            Join the conversation
          </p>
          <h2 id="comments-title" className="mt-2 font-heading text-[28px] text-[var(--color-on-surface)]">
            Comments <span className="text-[16px] text-[var(--color-on-surface-variant)]">({comments.length})</span>
          </h2>
        </div>
        <span className="tag-chip">Anonymous welcome</span>
      </div>

      <form onSubmit={submitComment} className="mt-6 grid gap-3 rounded-lg border-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-low)] p-4 shadow-[4px_4px_0_var(--color-on-surface)]">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
            Name <span className="font-normal normal-case tracking-normal">(optional)</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={80}
              placeholder="Anonymous"
              className="rounded-md border border-[var(--color-surface-border)] bg-[var(--color-background)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-[var(--color-on-surface)] outline-none focus:border-[var(--color-on-surface)]"
            />
          </label>
          <label className="hidden" aria-hidden="true">
            Website
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </label>
        </div>
        <label className="grid gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
          Your comment
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={2000}
            rows={4}
            required
            placeholder="Share a thought..."
            className="rounded-md border border-[var(--color-surface-border)] bg-[var(--color-background)] px-3 py-2 text-sm font-normal normal-case tracking-normal text-[var(--color-on-surface)] outline-none focus:border-[var(--color-on-surface)]"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[var(--color-on-surface-variant)]" aria-live="polite">{message}</p>
          <button type="submit" disabled={submitting} className="rounded-md bg-[var(--color-on-surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60">
            {submitting ? "Posting..." : "Post comment"}
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-[var(--color-on-surface-variant)]">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-[var(--color-on-surface-variant)]">No comments yet. Start the conversation.</p>
        ) : (
          comments.map((comment) => (
            <article key={comment.id} className="border-l-2 border-[var(--color-on-surface)] pl-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="font-semibold text-[var(--color-on-surface)]">{comment.name}</h3>
                <time className="text-xs text-[var(--color-on-surface-variant)]" dateTime={comment.created_at}>
                  {formatCommentDate(comment.created_at)}
                </time>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-[1.7] text-[var(--color-on-surface-variant)]">{comment.body}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
