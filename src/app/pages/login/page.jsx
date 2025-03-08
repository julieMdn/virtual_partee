"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] pt-28">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-[#002A5C] mb-8 text-center">
            Connexion à votre compte
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#F5E1C0]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-[#002A5C] font-medium mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                  placeholder="Entrez votre email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[#002A5C] font-medium mb-2"
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                  placeholder="Entrez votre mot de passe"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-semibold py-3 px-6 rounded-lg transition-colors ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#3C8D0D] hover:bg-[#327A0B] text-white"
                }`}
              >
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-[#3C8D0D] hover:text-[#327A0B] text-sm"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <div className="mt-6 pt-6 border-t border-[#F5E1C0] text-center">
              <p className="text-[#002A5C]">Pas encore de compte ?</p>
              <Link
                href="/pages/register"
                className="text-[#3C8D0D] hover:text-[#327A0B] font-semibold"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
