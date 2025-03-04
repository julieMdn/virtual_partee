"use client";

import React from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";

export default function AddToCartButton({ offer, selectedDate, timeSlot }) {
  const { addToCart } = useCart();

  const handleClick = (e) => {
    e.preventDefault();
    if (!selectedDate || !timeSlot) {
      toast.error("Veuillez sélectionner une date et un créneau horaire");
      return;
    }

    addToCart({
      ...offer,
      selectedDate,
      timeSlot,
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
