"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function NavBar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Effet pour marquer le composant comme monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
              className="px-4 py-2 text-white bg-[#3C8D0D] rounded-md hover:bg-[#327A0B] transition-colors"
            >
              Réserver
            </Link>
          </div>

          <div className="flex items-center space-x-6">
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
              {isMounted && cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FF8C42] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
