"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function NavBar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fonction pour vérifier si l'écran est en mode mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérifier au chargement
    checkIfMobile();

    // Ajouter un écouteur d'événement pour le redimensionnement
    window.addEventListener("resize", checkIfMobile);

    // Nettoyer l'écouteur d'événement
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Fermer le menu lorsqu'on clique sur un lien
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Ne pas afficher la navbar sur les pages admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold text-[#002A5C]">
              Virtual Partee
            </Link>
            <Link
              href="/offres"
              className="hidden md:block px-4 py-2 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors"
            >
              Réserver
            </Link>
          </div>

          {/* Icônes toujours visibles sur mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <Link
              href="/cart"
              className="relative text-[#002A5C] hover:text-[#FF8C42] transition-colors"
              aria-label="Panier"
            >
              <FaShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF8C42] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors"
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {isMenuOpen ? (
                <HiX className="text-2xl" />
              ) : (
                <HiMenu className="text-2xl" />
              )}
            </button>
          </div>

          {/* Menu pour desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="#"
              className="text-[#002A5C] hover:text-[#FF8C42] transition-colors"
            >
              Le concept
            </Link>

            <Link
              href="/offres"
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
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF8C42] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-2 shadow-inner">
            <div className="flex flex-col space-y-4">
              <Link
                href="#"
                className="text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                Le concept
              </Link>

              <Link
                href="/offres"
                className="text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                Nos offres
              </Link>

              <Link
                href="/contact"
                className="text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                onClick={closeMenu}
              >
                Contactez-nous
              </Link>

              <Link
                href="/offres"
                className="text-white bg-[#3C8D0D] hover:bg-[#327A0B] transition-colors py-2 px-4 rounded-md text-center"
                onClick={closeMenu}
              >
                Réserver
              </Link>

              {user ? (
                <>
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                    onClick={closeMenu}
                  >
                    <FaUserCircle className="text-xl text-[#FF8C42]" />
                    <span>Mon profil</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors py-2 px-4 rounded-md hover:bg-gray-50 w-full text-left"
                  >
                    <span>Se déconnecter</span>
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-[#002A5C] hover:text-[#FF8C42] transition-colors py-2 px-4 rounded-md hover:bg-gray-50"
                  onClick={closeMenu}
                >
                  <FaUserCircle className="text-xl" />
                  <span>Se connecter</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
