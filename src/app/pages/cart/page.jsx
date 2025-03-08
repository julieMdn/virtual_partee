"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Effet pour marquer le composant comme monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayment = async () => {
    if (!user) {
      router.push("/pages/login");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      // Récupérer le token soit des cookies soit du localStorage
      const token = Cookies.get("token") || localStorage.getItem("token");

      if (!token) {
        toast.error("Vous devez vous connecter pour valider votre panier", {
          duration: 4000,
          action: {
            label: "Se connecter",
            onClick: () => router.push("/login"),
          },
        });
        setIsProcessing(false);
        return;
      }

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cart,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        toast.error("Vous devez vous connecter pour valider votre panier", {
          duration: 4000,
          action: {
            label: "Se connecter",
            onClick: () => router.push("/login"),
          },
        });
        setIsProcessing(false);
        return;
      }

      if (!response.ok) {
        if (data && data.error) {
          throw new Error(data.error);
        } else {
          throw new Error("Une erreur est survenue");
        }
      }

      if (data.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("URL de paiement manquante");
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation du paiement:", error);
      console.error("Message d'erreur:", error.message);

      // Vérifier si l'erreur est liée à l'authentification
      if (
        error.message &&
        (error.message.includes("Vous devez vous connecter") ||
          error.message.includes("Authentification requise") ||
          error.message.includes("token") ||
          error.message.includes("connecté") ||
          error.message.includes("jwt") ||
          error.message.includes("auth"))
      ) {
        toast.error("Vous devez vous connecter pour valider votre panier", {
          duration: 4000,
          action: {
            label: "Se connecter",
            onClick: () => router.push("/login"),
          },
        });
      } else {
        toast.error(
          "Une erreur est survenue lors de la préparation du paiement"
        );
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      router.push("/pages/login");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // ... existing code ...

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: cart }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setError(
            "Une erreur est survenue lors de la redirection vers la page de paiement."
          );
          setIsLoading(false);
        }
      } else {
        setError(
          data.error ||
            "Une erreur est survenue lors de la création du paiement."
        );
        setIsLoading(false);
      }
    } catch (error) {
      setError(
        "Une erreur est survenue lors de la communication avec le serveur."
      );
      setIsLoading(false);
    }
  };

  // Rendu de base commun pour tous les états
  return (
    <div className="pt-40 bg-[#F9F9F9] min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
          Mon Panier
        </h1>

        {/* Rendu conditionnel après hydratation */}
        {isMounted && cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-[#002A5C]/80 mb-6">Votre panier est vide</p>
            <Link
              href="/pages/offers"
              className="inline-block bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Voir nos offres
            </Link>
          </div>
        ) : isMounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item, index) => (
                <div
                  key={`cart-item-${index}`}
                  className="bg-white rounded-xl shadow-lg p-6 mb-4 flex items-center"
                >
                  <div className="relative h-24 w-24 flex-shrink-0">
                    <Image
                      src={item.picture}
                      alt={item.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="ml-6 flex-grow">
                    <h3 className="text-xl font-semibold text-[#002A5C]">
                      {item.title}
                    </h3>
                    <p className="text-[#3C8D0D] font-bold">
                      {item.price.toFixed(2)}€
                    </p>
                    <p className="text-gray-600">
                      {new Date(item.selectedDate).toLocaleDateString("fr-FR")}{" "}
                      à {item.timeSlot.startTime}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-500 hover:text-red-700 ml-4"
                    disabled={isProcessing}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-[#002A5C] mb-6">
                  Récapitulatif
                </h2>
                <div className="flex justify-between mb-4">
                  <span>Total</span>
                  <span className="font-bold">{total.toFixed(2)}€</span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="block w-full bg-[#3C8D0D] hover:bg-[#327A0B] text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isProcessing
                    ? "Traitement en cours..."
                    : "Procéder au paiement"}
                </button>
                <button
                  onClick={clearCart}
                  disabled={isProcessing}
                  className="block w-full mt-4 text-red-500 hover:text-red-700 text-center disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Vider le panier
                </button>
              </div>
            </div>
          </div>
        ) : (
          // État de chargement avant hydratation
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-[#002A5C]/80 mb-6">Chargement...</p>
          </div>
        )}
      </div>
    </div>
  );
}
