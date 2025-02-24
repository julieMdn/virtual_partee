"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  if (cart.length === 0) {
    return (
      <div className="pt-40 bg-[#F9F9F9] min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
            Mon Panier
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <p className="text-[#002A5C]/80 mb-6">Votre panier est vide</p>
            <Link
              href="/offres"
              className="inline-block bg-[#3C8D0D] hover:bg-[#327A0B] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Voir nos offres
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 bg-[#F9F9F9] min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-center text-4xl font-bold mb-12 text-[#002A5C]">
          Mon Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div key="cart-items" className="lg:col-span-2">
            {cart.map((item) => (
              <div
                key={item.cartId}
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
                    {new Date(item.selectedDate).toLocaleDateString("fr-FR")} à{" "}
                    {item.timeSlot.startTime}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.cartId)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>

          <div key="cart-summary" className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-[#002A5C] mb-6">
                Récapitulatif
              </h2>
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold">{total.toFixed(2)}€</span>
              </div>
              <Link
                href="/booking"
                className="block w-full bg-[#3C8D0D] hover:bg-[#327A0B] text-white text-center font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Procéder au paiement
              </Link>
              <button
                onClick={clearCart}
                className="block w-full mt-4 text-red-500 hover:text-red-700 text-center"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
