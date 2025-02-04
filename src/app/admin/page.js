"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md">
        <h1 className="text-center text-2xl text-gray-800 mb-6">
          Administration
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-4 p-2 bg-red-50 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-gray-600">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="p-3 border border-gray-200 rounded text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`mt-2 bg-blue-600 text-white py-3 px-4 rounded text-base transition-colors duration-200 
              ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
