"use client";

import React, { useState } from "react";
import { Mulish } from "next/font/google";
import DialogModal from "@/app/components/DialogModal";


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
    <div className="min-h-screen p-5 ">
      <h1
        className={`${mulish.variable} font-mulish text-7xl text-center font-black mb-10`}
      >
        My <span className="text-blue-500">Graphics</span> Works
      </h1>

      {/* back to home page */}
      <button className="text-blue-500 hover:underline" onClick={() => window.history.back()}>
        Back to Home
      </button>
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-2xl">
          Here you can find my graphics design projects.
        </p>
        <div className="columns-2 sm:columns-3 md:columns-4 gap-4 p-4">
          {images.map((img) => (
            <img
              key={img.src}
              className="mb-4 w-full rounded-lg cursor-pointer"
              src={img.src}
              alt={img.alt}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>
      <DialogModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <img
            className="max-w-full max-h-[70vh] mx-auto"
            src={selectedImage.src}
            alt={selectedImage.alt}
          />
        )}
      </DialogModal>
    </div>
  );
}