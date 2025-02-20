"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ offer }) {
  const { addToCart } = useCart();

  return (
    <button
      onClick={(e) => {
        e.preventDefault(); // Pour éviter la navigation sur les cartes cliquables
        addToCart(offer);
      }}
      className="bg-[#F5E1C0] hover:bg-[#F0D4A8] text-[#002A5C] font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      Sélectionner
    </button>
  );
}
