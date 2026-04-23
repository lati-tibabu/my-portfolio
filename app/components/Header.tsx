"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa6";
import { FiFacebook, FiGithub, FiLinkedin, FiMenu, FiX } from "react-icons/fi";
import Logo from "./Logo";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" onClick={() => setMobileOpen(false)}>
          <Logo size="medium" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            About
          </Link>
          <Link href="/projects/graphics" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
            Graphics
          </Link>
        </nav>

        {/* Desktop Social Icons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://facebook.com/lati.tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 text-xl transition"
            aria-label="Facebook"
          >
            <FiFacebook />
          </a>
          <a
            href="https://linkedin.com/in/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 text-xl transition"
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
          <a
            href="https://github.com/lati-tibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 text-xl transition"
            aria-label="GitHub"
          >
            <FiGithub />
          </a>
          <a
            href="https://t.me/latitibabu"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-blue-600 text-xl transition"
            aria-label="Telegram"
          >
            <FaTelegram />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-900 text-2xl transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
          <Link
            href="/"
            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            About
          </Link>
          <Link
            href="/projects/graphics"
            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
            onClick={() => setMobileOpen(false)}
          >
            Graphics
          </Link>
          <div className="flex gap-5 pt-2">
            <a href="https://facebook.com/lati.tibabu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 text-xl transition"><FiFacebook /></a>
            <a href="https://linkedin.com/in/lati-tibabu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 text-xl transition"><FiLinkedin /></a>
            <a href="https://github.com/lati-tibabu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 text-xl transition"><FiGithub /></a>
            <a href="https://t.me/latitibabu" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 text-xl transition"><FaTelegram /></a>
          </div>
        </div>
      )}
    </header>
  );
}
