"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    birthday: "",
    address: {
      street: "",
      city: "",
      postCode: "",
      country: "",
      phoneNumber: "",
    },
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Normalisation des données
    const normalizedFormData = {
      ...formData,
      email: formData.email.toLowerCase(),
      username: formData.username.toLowerCase(),
      // Optionnel : normalisation du nom et prénom
      firstName:
        formData.firstName.charAt(0).toUpperCase() +
        formData.firstName.slice(1).toLowerCase(),
      lastName:
        formData.lastName.charAt(0).toUpperCase() +
        formData.lastName.slice(1).toLowerCase(),
    };

    if (normalizedFormData.password !== normalizedFormData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...normalizedFormData,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Stockage des informations utilisateur
        localStorage.setItem("user", JSON.stringify(data.data.user));
        // Redirection vers la page du compte
        router.push("/account");
      } else {
        setError(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setError("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] pt-28">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#002A5C] mb-8 text-center">
            Créer un compte
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#F5E1C0]">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations personnelles */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#002A5C]">
                    Informations personnelles
                  </h2>

                  <div>
                    <label
                      htmlFor="username"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Nom d'utilisateur*
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Prénom*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Nom*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="birthday"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      id="birthday"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Adresse et mot de passe */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-[#002A5C]">
                    Adresse
                  </h2>

                  <div>
                    <label
                      htmlFor="street"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Rue
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="postCode"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Code postal
                    </label>
                    <input
                      type="text"
                      id="postCode"
                      name="address.postCode"
                      value={formData.address.postCode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Ville
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Pays
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-[#002A5C] font-medium mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="address.phoneNumber"
                      value={formData.address.phoneNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Mot de passe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-[#002A5C] font-medium mb-2"
                  >
                    Mot de passe*
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[#002A5C] font-medium mb-2"
                  >
                    Confirmer le mot de passe*
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                  />
                </div>
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
                {isLoading ? "Création en cours..." : "Créer mon compte"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#F5E1C0] text-center">
              <p className="text-[#002A5C]">Déjà un compte ?</p>
              <Link
                href="/login"
                className="text-[#3C8D0D] hover:text-[#327A0B] font-semibold"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
