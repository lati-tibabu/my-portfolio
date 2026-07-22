"use client";

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
    <div className="mx-auto max-w-[560px] overflow-hidden rounded-xl border-2 border-[var(--color-on-surface)] bg-[var(--color-surface-container-lowest)] shadow-[7px_7px_0_var(--color-on-surface)]">
      <div className="bg-[var(--color-on-surface)] px-6 py-5 text-white">
        <p className="font-label text-[10px] uppercase tracking-[0.24em] text-white/60">
          Private workspace / 01
        </p>
        <h1 className="mt-2 font-heading text-[32px]">Sign in to continue</h1>
      </div>

      <form
        className="space-y-5 p-6"
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
          className="inline-flex m-top-to-bottom-3 w-full items-center justify-center rounded-lg border-2 border-[var(--color-on-surface)] bg-[var(--color-on-surface)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[4px_4px_0_var(--color-surface-border)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--color-surface-border)] active:translate-y-0 active:shadow-none focus:outline-none focus:ring-2 focus:ring-[var(--color-on-surface)]/30 disabled:opacity-60"
          disabled={busy}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        {authMessage && (
          <p className="text-sm text-[var(--color-on-surface-variant)]">
            {authMessage}
          </p>
        )}
      </form>
    </div>
  );
}
