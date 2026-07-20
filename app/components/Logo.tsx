"use client";
import React from "react";
import "./Logo.css";

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
        } font-logo font-semibold tracking-tight`}
      >
        <span className="text-[var(--color-on-surface)]">lati</span>
        <span className="text-[var(--color-electric-blue)]">tibabu</span>
      </div>
    </div>
  );
};

export default Logo;
