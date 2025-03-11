"use client";

import NavBar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientLayout({ children }) {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <NavBar />
          <main className="grow">{children}</main>
          <Footer />
        </CartProvider>
      </AuthProvider>
    </>
  );
}
