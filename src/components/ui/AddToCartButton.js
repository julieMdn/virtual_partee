"use client";

import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ offer, timeSlot }) {
  const { addToCart } = useCart();

  const handleClick = (e) => {
    e.preventDefault();
    addToCart({
      ...offer,
      timeSlot: timeSlot,
    });
  };

  return (
    <button
      onClick={handleClick}
      className="bg-[#F5E1C0] hover:bg-[#F0D4A8] text-[#002A5C] font-semibold py-3 px-6 rounded-lg transition-colors"
    >
      Ajouter au panier
    </button>
  );
}
