"use client";

import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (offer) => {
    const existingItem = cart.find((item) => item.id === offer.id);

    if (existingItem) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === offer.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
      toast.success("Quantité mise à jour dans le panier");
    } else {
      setCart((prevCart) => [...prevCart, { ...offer, quantity: 1 }]);
      toast.success("Produit ajouté au panier");
    }
  };

  const removeFromCart = (offerId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== offerId));
  };

  const updateQuantity = (offerId, quantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === offerId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity }}
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
