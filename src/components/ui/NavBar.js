"use client";

import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-slate-50 border-b border-zinc-300">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between py-4 px-2">
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-zinc-900 text-xl font-bold mr-10">
            Virtual Partee
          </Link>
          <Link
            href="#"
            className="hidden lg:inline-block px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            Réserver
          </Link>
        </div>

        {/* Bouton hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 p-1 hover:bg-gray-100 rounded-md transition-colors duration-200"
          aria-label="Menu"
        >
          <span className="w-6 h-0.5 bg-zinc-900 rounded-full transition-all duration-200"></span>
          <span className="w-6 h-0.5 bg-zinc-900 rounded-full transition-all duration-200"></span>
          <span className="w-6 h-0.5 bg-zinc-900 rounded-full transition-all duration-200"></span>
        </button>

        {/* Navigation links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full lg:flex lg:w-auto lg:items-center`}
        >
          <div className="flex flex-col lg:flex-row">
            <Link
              href="#"
              className="inline-block px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 lg:hidden"
            >
              Réserver
            </Link>
            <Link href="#" className="text-zinc-900 py-2 lg:py-0 lg:mx-2">
              Le concept
            </Link>
            <Link href="#" className="text-zinc-900 py-2 lg:py-0 lg:mx-2">
              Nos offres
            </Link>
            <Link href="#" className="text-zinc-900 py-2 lg:py-0 lg:mx-2">
              Contact
            </Link>
            <Link href="#" className="text-zinc-900 py-2 lg:py-0 lg:mx-2">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
