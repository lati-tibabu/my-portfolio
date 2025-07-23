"use client";
import React from "react";
import "./Logo.css";
import { Mulish } from "next/font/google";

const mulish = Mulish({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-mulish",
});

type LogoProps = {
  size?: string;
};

const Logo = ({ size = "medium" }: LogoProps) => {
  return (
    <div>
      <div
        className={`${
          size === "small"
            ? "text-xl"
            : size === "medium"
            ? "text-2xl"
            : size === "large"
            ? "text-4xl"
            : size === "xlarge"
            ? "text-5xl"
            : "text-lg"
        } font-black ${mulish.variable} font-mulish`}
      >
        <span className="text-gray-800">lati</span>
        <span className="text-blue-500">tibabu</span>
      </div>
    </div>
  );
};

export default Logo;
