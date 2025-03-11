"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 1000 }), // Montant en euros
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la session:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">
          Paiement sécurisé
        </h1>
        <div className="space-y-4">
          <p className="text-gray-600 text-center">Montant à payer : 10,00 €</p>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Redirection..." : "Procéder au paiement"}
          </button>
        </div>
      </div>
    </div>
  );
}
