"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mulish } from "next/font/google";
import DialogModal from "@/app/components/DialogModal";
import HandDrawnIcon from "@/app/components/HandDrawnIcon";

const mulish = Mulish({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-mulish",
});

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

export default function GraphicsPage() {
  const [selectedImage, setSelectedImage] = useState<null | { src: string; alt: string }>(null);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">

      {/* ─── Page Header ──────────────────────────────────────── */}
      <div className="bg-gray-50 border-b border-gray-200 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold text-[#8b5e3c] tracking-widest uppercase mb-3">
            Portfolio · Creative
          </p>
          <h1
            className={`${mulish.variable} font-mulish text-5xl md:text-6xl font-black text-gray-900 mb-4`}
          >
            My <span className="text-[#8b5e3c]">Graphics</span> Works
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            A collection of graphic design projects — event banners, posters, and brand visuals.
          </p>
        </div>
      </div>

      {/* ─── Back link ────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 pt-6">
        <button
          onClick={() => window.history.back()}
          className="hand-drawn-border inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <HandDrawnIcon name="arrow-left" size={18} /> Back
        </button>
      </div>

      {/* ─── Gallery Grid ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="columns-2 sm:columns-3 md:columns-4 gap-3">
          {images.map((img) => (
            <div
              key={img.src}
              className="mb-3 overflow-hidden rounded-lg cursor-pointer group relative"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={400}
                height={400}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* ─── Modal ────────────────────────────────────────────── */}
      <DialogModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <Image
            className="max-w-full max-h-[70vh] mx-auto rounded-lg"
            src={selectedImage.src}
            alt={selectedImage.alt}
            width={800}
            height={800}
            style={{ objectFit: "contain" }}
          />
        )}
      </DialogModal>
    </div>
  );
}
