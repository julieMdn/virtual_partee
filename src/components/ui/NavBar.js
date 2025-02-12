"use client";

import Link from "next/link";
import { useState } from "react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-[#F9F9F9] border-b border-[#F5E1C0]">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between py-4 px-2">
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-[#002A5C] text-xl font-bold mr-10">
            Virtual Partee
          </Link>
          <Link
            href="#"
            className="hidden lg:inline-block px-4 py-2 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors duration-200"
          >
            Réserver
          </Link>
        </div>

        {/* Bouton hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col justify-center items-center w-8 h-8 space-y-1.5 p-1 hover:bg-[#F5E1C0] rounded-md transition-colors duration-200"
          aria-label="Menu"
        >
          <span className="w-6 h-0.5 bg-[#002A5C] rounded-full transition-all duration-200"></span>
          <span className="w-6 h-0.5 bg-[#002A5C] rounded-full transition-all duration-200"></span>
          <span className="w-6 h-0.5 bg-[#002A5C] rounded-full transition-all duration-200"></span>
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
              className="inline-block px-4 py-2 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors duration-200 lg:hidden"
            >
              Réserver
            </Link>
            <Link
              href="#"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Le concept
            </Link>
            <Link
              href="#"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Nos offres
            </Link>
            <Link
              href="#"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Contact
            </Link>
            <Link
              href="#"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
