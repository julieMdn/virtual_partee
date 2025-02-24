"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();

  return (
    <nav className="fixed w-full bg-[#F9F9F9] border-b border-[#F5E1C0] z-50">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between py-4 px-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-[#002A5C] text-xl font-bold mr-10">
            Virtual Partee
          </Link>
          <Link
            href="/offres"
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
          <div className="flex flex-col lg:flex-row items-center">
            <Link
              href="/offres"
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
              href="/offres"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Nos offres
            </Link>
            <Link
              href="/contact"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="text-[#002A5C] py-2 lg:py-0 lg:mx-2 hover:text-[#3C8D0D]"
            >
              Se connecter
            </Link>
            <Link
              href="/cart"
              className="text-[#002A5C] py-2 lg:py-0 lg:ml-2 hover:text-[#3C8D0D] relative"
              aria-label="Panier"
            >
              <FaShoppingCart className="text-xl" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#3C8D0D] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {getCartCount()}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
