"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";
import { gsap } from "gsap";

export default function NavBar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Effet pour marquer le composant comme monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effet pour gérer l'animation du menu mobile
  useEffect(() => {
    if (isMounted) {
      if (isMenuOpen) {
        // Animer l'ouverture du menu
        gsap.to(".mobile-menu", {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        // Désactiver le défilement du body
        document.body.style.overflow = "hidden";
      } else {
        // Animer la fermeture du menu
        gsap.to(".mobile-menu", {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            // Réactiver le défilement du body
            document.body.style.overflow = "auto";
          },
        });
      }
    }
  }, [isMenuOpen, isMounted]);

  // Ne pas afficher la navbar sur les pages admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#002A5C]">
              Virtual Partee
            </Link>
            <Link
              href="/offers"
              className="hidden sm:block px-4 py-2 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors ml-2 md:ml-4"
            >
              Réserver
            </Link>
          </div>

          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/concept"
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors"
            >
              Le concept
            </Link>

            <Link
              href="/offers"
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors"
            >
              Nos offres
            </Link>

            <Link
              href="/contact"
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors"
            >
              Contactez-nous
            </Link>

            {user ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer">
                  <FaUserCircle className="text-2xl text-[#FF8C42]" />
                  <span className="text-[#002A5C] group-hover:text-[#FF8C42] transition-colors">
                    {user.firstName || "Mon compte"}
                  </span>
                </div>
                <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <Link
                    href="/account"
                    className="block px-4 py-2 text-[#002A5C] hover:text-[#FF8C42] hover:bg-gray-50"
                  >
                    Mon profil
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-gray-50"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-2 text-[#002A5C] hover:text-[#FF8C42] transition-colors"
              >
                <FaUserCircle className="text-2xl" />
                <span>Se connecter</span>
              </Link>
            )}

            <Link
              href="/cart"
              className="relative text-[#002A5C] hover:text-[#FF8C42] transition-colors"
              aria-label="Panier"
            >
              <FaShoppingCart className="text-xl" />
              {isMounted && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF8C42] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>

          {/* Icônes pour mobile */}
          <div className="flex md:hidden items-center space-x-4">
            <Link
              href="/cart"
              className="relative text-[#002A5C] hover:text-[#FF8C42] transition-colors"
              aria-label="Panier"
            >
              <FaShoppingCart className="text-xl" />
              {isMounted && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF8C42] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors focus:outline-none"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <FaTimes className="text-2xl" />
              ) : (
                <FaBars className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`mobile-menu fixed inset-0 bg-white z-40 pt-24 px-6 ${
          isMenuOpen ? "block" : "hidden"
        } opacity-0 transform -translate-y-5`}
        style={{ top: "80px", height: "calc(100vh - 80px)" }}
      >
        <div className="flex flex-col space-y-6">
          <Link
            href="/concept"
            className="text-xl text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 border-b border-gray-100"
            onClick={toggleMenu}
          >
            Le concept
          </Link>

          <Link
            href="/offers"
            className="text-xl text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 border-b border-gray-100"
            onClick={toggleMenu}
          >
            Nos offres
          </Link>

          <Link
            href="/contact"
            className="text-xl text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 border-b border-gray-100"
            onClick={toggleMenu}
          >
            Contactez-nous
          </Link>

          {user ? (
            <>
              <Link
                href="/account"
                className="text-xl text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 border-b border-gray-100"
                onClick={toggleMenu}
              >
                Mon profil
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="text-xl text-left text-red-600 hover:text-red-700 transition-colors py-2 border-b border-gray-100"
              >
                Se déconnecter
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="text-xl text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 border-b border-gray-100"
              onClick={toggleMenu}
            >
              Se connecter
            </Link>
          )}

          <Link
            href="/offers"
            className="mt-4 w-full px-4 py-3 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors text-center"
            onClick={toggleMenu}
          >
            Réserver maintenant
          </Link>
        </div>
      </div>
    </nav>
  );
}
