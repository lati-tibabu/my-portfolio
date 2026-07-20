"use client";

import { inputClass, labelClass } from "../lib/constants";

type AdminLoginScreenProps = {
  authEmail: string;
  authPassword: string;
  authMessage: string;
  busy: boolean;
  setAuthEmail: (value: string) => void;
  setAuthPassword: (value: string) => void;
  signIn: () => void;
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
    <div className="mx-auto max-w-[560px] rounded-3xl border border-[var(--color-surface-border)] bg-[var(--color-surface-container-lowest)] p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05)]">
      <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">
        Admin Login
      </p>
      <h1 className="mt-3 font-heading text-[32px] text-[var(--color-on-surface)]">
        Sign in to manage content
      </h1>
      <p className="mt-2 text-[15px] leading-[1.7] text-[var(--color-on-surface-variant)]">
        Use a Supabase Auth user account to open the dashboard, then create,
        edit, or delete products, graphics, and blog posts.
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
          className="inline-flex items-center w-justify-center rounded-lg bg-[var(--color-electric-blue)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white disabled:opacity-60 hover:bg-[var(--color-electric-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 transition-all duration-200"
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