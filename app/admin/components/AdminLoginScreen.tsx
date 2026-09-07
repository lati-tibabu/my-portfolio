"use client";

import { FiGrid } from "react-icons/fi";

import { inputClass, labelClass } from "../lib/constants";

type AdminLoginScreenProps = {
  authEmail: string;
  authPassword: string;
  authMessage: string;
  busy: boolean;
  setAuthEmail: (value: string) => void;
  setAuthPassword: (value: string) => void;
  signIn: () => Promise<void>;
};

export default function AdminLoginScreen({
  authEmail,
  authPassword,
  authMessage,
  busy,
  setAuthEmail,
  setAuthPassword,
  signIn,
}: AdminLoginScreenProps) {
  return (
    <div className="admin-workspace mx-auto my-12 max-w-[480px] overflow-hidden rounded-2xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)]">
      <div className="border-b border-[var(--color-surface-border)] bg-[var(--studio-accent-soft)] px-8 py-8 text-[var(--studio-accent-text)]">
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-[var(--studio-accent-text)]">
          Content studio
        </p>
        <FiGrid size={28} className="my-5" aria-hidden /><h1 className="mt-2 font-heading text-[32px]">Sign in to continue</h1>
      </div>

      <form
        className="space-y-5 p-8"
        onSubmit={(event) => {
          event.preventDefault();
          void signIn();
        }}
      >
        <p className="text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)]">
          Access your content workspace to manage products, graphics, and blog posts.
        </p>
        <label className={labelClass}>
          Email
          <input
            className={inputClass}
            type="email"
            autoComplete="username"
            required
            value={authEmail}
            onChange={(event) => setAuthEmail(event.target.value)}
          />
        </label>
        <label className={labelClass}>
          Password
          <input
            className={inputClass}
            type="password"
            autoComplete="current-password"
            required
            value={authPassword}
            onChange={(event) => setAuthPassword(event.target.value)}
          />
        </label>
        <button
          type="submit"
          className="studio-primary inline-flex w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        {authMessage && (
          <p role="status" className="text-sm text-[var(--color-on-surface-variant)]">
            {authMessage}
          </p>
        )}
      </form>
    </div>
  );
}
