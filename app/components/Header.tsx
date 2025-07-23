"use client";

import React from "react";
import Link from "next/link";
import { FaTelegram } from "react-icons/fa6";
import { FiFacebook, FiGithub, FiLinkedin  } from "react-icons/fi";
import Logo from "./Logo";

export default function Header() {
  return (
    <header className="flex justify-around items-center p-5">
      {/* Logo */}
      <Link href="/">
        <Logo size="large" />
      </Link>
      {/* Navigation */}
      {/* <div>
        <ul className="flex space-x-4 text-gray-800">
          <Link href="/">
            <li className="hover:text-blue-500 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link href="/about">
            <li className="hover:text-blue-500 hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link href="/projects">
            <li className="hover:text-blue-500 hover:underline cursor-pointer">
              Projects
            </li>
          </Link>
          <Link href="/contact">
            <li className="hover:text-blue-500 hover:underline cursor-pointer">
              Contact
            </li>
          </Link>
        </ul>
      </div> */}
      {/* Social Media */}
      <div>
        <ul className="flex space-x-4 text-gray-800">
          {/* Facebook */}
          <li>
            <a
            href="https://facebook.com/lati.tibabu" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 text-2xl transition transform hover:-translate-y-1"
          >
            <FiFacebook />
          </a>
          </li>

          {/* LinkedIn */}
          <li>
            <a
            href="https://linkedin.com/in/lati-tibabu" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 text-2xl transition transform hover:-translate-y-1"
          >
            <FiLinkedin />
          </a>
          </li>

          {/* GitHub */}
          <li>
            <a
            href="https://github.com/lati-tibabu" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 text-2xl transition transform hover:-translate-y-1"
          >
            <FiGithub />
          </a>
          </li>
          
          {/* Telegram */}
          <li>
            <a
            href="https://t.me/latitibabu" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-blue-600 text-2xl transition transform hover:-translate-y-1"
          >
            <FaTelegram />
          </a>
          </li>
        </ul>

      </div>
    </header>
  );
}
