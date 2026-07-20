"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase/browser";
import {
  HERO_SINGLETON_ID,
  inputClass,
  labelClass,
  sectionClass,
} from "../lib/constants";
import { defaultHeroForm, emptyHeroForm, textValue } from "../lib/forms";
import { uploadHeroImage } from "../lib/crud";
import type { HeroForm, HeroRecord } from "../lib/types";
import ImageUploader from "./ImageUploader";
import HeroSkeletonPreview from "../../components/HeroSkeletonPreview";

export type HeroPanelProps = {
  record: HeroRecord | null;
  reload: () => Promise<void>;
  busy: boolean;
  setBusy: (value: boolean) => void;
  setMessage: (value: string) => void;
};

const layoutOptions: { value: HeroForm["layout"]; label: string }[] = [
  { value: "text-left-image-right", label: "Text left / image right" },
  { value: "image-left-text-right", label: "Image left / text right" },
  { value: "centered", label: "Centered (no image)" },
];

const formFromRecord = (record: HeroRecord | null): HeroForm =>
  record
    ? {
        eyebrow: record.eyebrow,
        headline: record.headline,
        bodyMd: record.body_md,
        cta1Label: textValue(record.cta1_label),
        cta1Href: textValue(record.cta1_href),
        cta2Label: textValue(record.cta2_label),
        cta2Href: textValue(record.cta2_href),
        cta3Label: textValue(record.cta3_label),
        cta3Href: textValue(record.cta3_href),
        imageEnabled: record.image_enabled,
        imageUrl: textValue(record.image_url),
        imagePath: textValue(record.image_path),
        imageAlt: textValue(record.image_alt),
        layout: record.layout,
        availabilityLabel: textValue(record.availability_label),
        availabilityValue: textValue(record.availability_value),
      }
    : emptyHeroForm();

export default function HeroPanel({
  record,
  reload,
  busy,
  setBusy,
  setMessage,
}: HeroPanelProps) {
  const [form, setForm] = useState<HeroForm>(emptyHeroForm);
  const [file, setFile] = useState<File | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setForm(formFromRecord(record));
    setFile(null);
    setDirty(false);
  }, [record]);

  const update = (patch: Partial<HeroForm>) => {
    setForm((current) => ({ ...current, ...patch }));
    setDirty(true);
  };

  const resetToStaticDefault = () => {
    setForm(defaultHeroForm());
    setFile(null);
    setDirty(true);
  };

  const save = async () => {
    if (!form.headline.trim()) {
      setMessage("Hero needs a headline.");
      return;
    }
    setBusy(true);
    try {
      let imageUrl = form.imageUrl;
      let imagePath = form.imagePath;

      if (file) {
        const uploaded = await uploadHeroImage(file);
        imageUrl = uploaded.imageUrl;
        imagePath = uploaded.imagePath;
      }

      const payload = {
        id: HERO_SINGLETON_ID,
        eyebrow: form.eyebrow.trim(),
        headline: form.headline.trim(),
        body_md: form.bodyMd,
        cta1_label: form.cta1Label.trim() || null,
        cta1_href: form.cta1Href.trim() || null,
        cta2_label: form.cta2Label.trim() || null,
        cta2_href: form.cta2Href.trim() || null,
        cta3_label: form.cta3Label.trim() || null,
        cta3_href: form.cta3Href.trim() || null,
        image_enabled: form.imageEnabled,
        image_url: imageUrl.trim() || null,
        image_path: imagePath || null,
        image_alt: form.imageAlt.trim() || null,
        layout: form.layout,
        availability_label: form.availabilityLabel.trim() || null,
        availability_value: form.availabilityValue.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabaseBrowser
        .from("hero_content")
        .upsert(payload, { onConflict: "id" });

      if (error) {
        throw error;
      }

      setMessage("Hero content saved.");
      setFile(null);
      setDirty(false);
      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save hero content.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-[28px] text-[var(--color-on-surface)]">
          Hero
        </h2>
        <span className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-on-surface-variant)]">
          Home page header
        </span>
      </div>

      <div className={sectionClass}>
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            <label className={labelClass}>
              Eyebrow
              <input
                className={inputClass}
                value={form.eyebrow}
                onChange={(e) => update({ eyebrow: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Headline
              <input
                className={inputClass}
                value={form.headline}
                onChange={(e) => update({ headline: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Body (Markdown)
              <textarea
                className={inputClass}
                rows={5}
                value={form.bodyMd}
                onChange={(e) => update({ bodyMd: e.target.value })}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Primary CTA label
                <input
                  className={inputClass}
                  value={form.cta1Label}
                  placeholder="Get in touch"
                  onChange={(e) => update({ cta1Label: e.target.value })}
                />
              </label>
              <label className={labelClass}>
                Primary CTA link
                <input
                  className={inputClass}
                  value={form.cta1Href}
                  placeholder="/#contact"
                  onChange={(e) => update({ cta1Href: e.target.value })}
                />
              </label>
              <label className={labelClass}>
                Secondary CTA label
                <input
                  className={inputClass}
                  value={form.cta2Label}
                  placeholder="Download CV"
                  onChange={(e) => update({ cta2Label: e.target.value })}
                />
              </label>
              <label className={labelClass}>
                Secondary CTA link
                <input
                  className={inputClass}
                  value={form.cta2Href}
                  placeholder="/LatiTibabu_CV.pdf"
                  onChange={(e) => update({ cta2Href: e.target.value })}
                />
              </label>
              <label className={labelClass}>
                Tertiary CTA label
                <input
                  className={inputClass}
                  value={form.cta3Label}
                  placeholder="Hire me on Upwork"
                  onChange={(e) => update({ cta3Label: e.target.value })}
                />
              </label>
              <label className={labelClass}>
                Tertiary CTA link
                <input
                  className={inputClass}
                  value={form.cta3Href}
                  placeholder="https://upwork.com/..."
                  onChange={(e) => update({ cta3Href: e.target.value })}
                />
              </label>
            </div>

            <label className={labelClass}>
              Layout
              <select
                className={inputClass}
                value={form.layout}
                onChange={(e) =>
                  update({
                    layout: e.target.value as HeroForm["layout"],
                  })
                }
              >
                {layoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 text-sm font-medium text-[var(--color-on-surface)]">
              <input
                type="checkbox"
                checked={form.imageEnabled}
                disabled={form.layout === "centered"}
                onChange={(e) => update({ imageEnabled: e.target.checked })}
              />
              Show portrait image
              {form.layout === "centered" ? (
                <span className="text-xs text-[var(--color-on-surface-variant)]">
                  (disabled in centered layout)
                </span>
              ) : null}
            </label>

            <ImageUploader
              file={file}
              onFileChange={setFile}
              imageUrl={form.imageUrl}
              onImageUrlChange={(value) => update({ imageUrl: value })}
              title={form.headline}
              description={form.imageAlt}
            />

            <label className={labelClass}>
              Image alt text
              <input
                className={inputClass}
                value={form.imageAlt}
                placeholder="Lati Tibabu portrait"
                onChange={(e) => update({ imageAlt: e.target.value })}
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Availability label
                <input
                  className={inputClass}
                  value={form.availabilityLabel}
                  placeholder="Availability"
                  onChange={(e) =>
                    update({ availabilityLabel: e.target.value })
                  }
                />
              </label>
              <label className={labelClass}>
                Availability value
                <input
                  className={inputClass}
                  value={form.availabilityValue}
                  placeholder="Open for freelance work"
                  onChange={(e) =>
                    update({ availabilityValue: e.target.value })
                  }
                />
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-lg border-2 border-[var(--color-on-surface)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-container)] active:translate-y-0 disabled:opacity-60"
                onClick={resetToStaticDefault}
                disabled={busy}
              >
                Reset to static default
              </button>
              <button
                type="button"
                className="rounded-lg bg-[var(--color-electric-blue)] px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-all duration-200 hover:bg-[var(--color-electric-blue)]/90 focus:outline-none focus:ring-2 focus:ring-[var(--color-electric-blue)]/20 focus:ring-offset-2 disabled:opacity-60"
                onClick={save}
                disabled={busy}
              >
                Save hero
              </button>
              {dirty ? (
                <span className="self-center text-xs text-[var(--color-on-surface-variant)]">
                  Unsaved changes
                </span>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-on-surface-variant)]">
              Layout preview
            </p>
            <HeroSkeletonPreview
              layout={form.layout}
              imageEnabled={form.imageEnabled}
            />
            <p className="text-xs text-[var(--color-on-surface-variant)]">
              Skeleton wireframe of the chosen layout. Save to publish to the
              home page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
