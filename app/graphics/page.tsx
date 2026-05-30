import type { Metadata } from "next";
import Link from "next/link";
import HandDrawnIcon from "../components/HandDrawnIcon";
import GraphicsGallery from "../components/GraphicsGallery";

const images = [
  { src: "/Images/Graphics/akkamitti_qophoofna_2025.png", alt: "Akkamitti Qophoofna 2025 graphic" },
  { src: "/Images/Graphics/ayyaanaan_qofa.png", alt: "Ayyaanaan Qofa graphic" },
  { src: "/Images/Graphics/biyya_lafaa.png", alt: "Biyya Lafaa graphic" },
  { src: "/Images/Graphics/brethren_banner.png", alt: "Brethren Banner graphic" },
  { src: "/Images/Graphics/duula_kadhannaa_2023.png", alt: "Duula Kadhannaa 2023 graphic" },
  { src: "/Images/Graphics/faith_success_2025.png", alt: "Faith Success 2025 graphic" },
  { src: "/Images/Graphics/fasika_2025.png", alt: "Fasika 2025 graphic" },
  { src: "/Images/Graphics/fasika2_2025.png", alt: "Fasika2 2025 graphic" },
  { src: "/Images/Graphics/freshman_bible_study_2024.png", alt: "Freshman Bible Study 2024 graphic" },
  { src: "/Images/Graphics/gc_night_2025.png", alt: "GC Night 2025 graphic" },
  { src: "/Images/Graphics/gospel_day_2023.png", alt: "Gospel Day 2023 graphic" },
  { src: "/Images/Graphics/guddaa_jaalachuu_2024.png", alt: "Guddaa Jaalachuu 2024 graphic" },
  { src: "/Images/Graphics/kristoosiin_qofa.png", alt: "Kristoosiin Qofa graphic" },
  { src: "/Images/Graphics/lad_night_2023.png", alt: "Lad Night 2023 graphic" },
  { src: "/Images/Graphics/logo_wu.png", alt: "Logo WU graphic" },
  { src: "/Images/Graphics/mini_mission_2023.png", alt: "Mini Mission 2023 graphic" },
  { src: "/Images/Graphics/welcome_2024.png", alt: "Welcome 2024 graphic" },
  { src: "/Images/Graphics/yesusiin_malee_2025.png", alt: "Yesusiin Malee 2025 graphic" },
];

export const metadata: Metadata = {
  title: "Graphics — Lati Tibabu",
  description: "A selection of posters, event banners, and brand visuals by Lati Tibabu.",
};

export default function GraphicsPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-background)]">
      <section className="px-6 pt-24 pb-12">
        <div className="max-w-[1100px] mx-auto space-y-4 text-center">
          <p className="font-label text-[11px] uppercase tracking-[0.24em] text-[var(--color-electric-blue)]">Portfolio · Creative</p>
          <h1 className="font-heading text-[36px] md:text-[52px] text-[var(--color-on-surface)]">Graphics work</h1>
          <p className="text-[16px] text-[var(--color-on-surface-variant)] max-w-[640px] mx-auto">
            A curated gallery of event banners, posters, and brand visuals designed for community initiatives.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--color-electric-blue)]">
            <HandDrawnIcon name="arrow-left" size={16} /> Back to home
          </Link>
        </div>
      </section>
      <GraphicsGallery images={images} />
    </div>
  );
}
