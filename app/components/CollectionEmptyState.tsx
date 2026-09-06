import Link from "next/link";

type Props = { title: string; description: string };

export default function CollectionEmptyState({ title, description }: Props) {
  return (
    <div className="mx-auto max-w-[1100px] rounded-2xl border border-dashed border-[var(--color-surface-border)] bg-[var(--color-surface-container-low)] px-6 py-16 text-center">
      <p className="font-label text-[11px] uppercase tracking-[0.2em] text-[var(--color-on-surface-variant)]">More to come</p>
      <h2 className="mt-3 font-heading text-2xl tracking-tight">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[var(--color-on-surface-variant)]">{description}</p>
      <Link href="/#contact" className="mt-6 inline-flex min-h-11 items-center rounded-md bg-[var(--color-on-surface)] px-5 py-3 text-sm font-medium text-white">Get in touch <span className="ml-3" aria-hidden="true">↗</span></Link>
    </div>
  );
}
