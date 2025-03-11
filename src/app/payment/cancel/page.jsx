"use client";

import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Paiement annulé
        </h1>
        <p className="text-gray-600 mb-8">
          Votre paiement a été annulé. Aucun montant n'a été débité de votre
          compte.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => router.push("/payment")}
            className="w-full bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            Réessayer le paiement
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    </div>
  );
}
