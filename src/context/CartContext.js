"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

// Récupérer le panier du localStorage
const getInitialCart = () => {
  if (typeof window !== "undefined") {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(getInitialCart);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (offer) => {
    // Au lieu de vérifier juste l'ID, on vérifie aussi le créneau horaire
    const existingItem = cart.find(
      (item) =>
        item.id === offer.id &&
        item.timeSlot?.id === offer.timeSlot?.id &&
        item.selectedDate?.toISOString() === offer.selectedDate?.toISOString()
    );

    if (existingItem) {
      toast.error("Cette réservation est déjà dans votre panier");
      return;
    }

    const newItem = {
      ...offer,
      id: Number(offer.id),
      cartId: `${offer.id}-${Date.now()}`, // Identifiant unique pour chaque item du panier
      quantity: 1,
      selectedDate: offer.selectedDate,
      timeSlot: offer.timeSlot,
    };

    setCart((prevCart) => [...prevCart, newItem]);
    toast.success("Réservation ajoutée au panier");
  };

  const removeFromCart = (cartId) => {
    // Utiliser cartId au lieu de offerId
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
    toast.success("Réservation retirée du panier");
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Panier vidé");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.length;
  };

  // Nouvelle fonction pour créer une réservation
  const createBooking = async (offerId, date, timeSlotId) => {
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId,
          date,
          timeSlotId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      // Retirer l'offre du panier après une réservation réussie
      removeFromCart(offerId);
      return data;
    } catch (error) {
      toast.error(error.message || "Erreur lors de la réservation");
      throw error;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        createBooking,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error(
      "useCart doit être utilisé à l'intérieur d'un CartProvider"
    );
  }
  return context;
}
