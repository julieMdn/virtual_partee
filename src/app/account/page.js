"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function Account() {
  const { user, loading, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      if (activeTab === "reservations") {
        setLoadingBookings(true);
        try {
          console.log(
            "Récupération des réservations avec token:",
            token ? "Présent" : "Absent"
          );

          // Vérifier si le token est disponible
          if (!token) {
            console.log("Aucun token disponible pour la requête");
            toast.error("Vous devez être connecté pour voir vos réservations");
            setLoadingBookings(false);
            return;
          }

          const response = await fetch("/api/user/bookings", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Statut de la réponse:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Réservations récupérées:", data.length);
            setBookings(data);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Erreur API:", response.status, errorData);
            toast.error(
              `Erreur: ${
                errorData.error || "Problème de récupération des réservations"
              }`
            );

            // Si non autorisé, essayer de rafraîchir l'authentification
            if (response.status === 401) {
              console.log(
                "Tentative de rafraîchissement de l'authentification"
              );
              checkAuth();
            }
          }
        } catch (error) {
          console.error(
            "Erreur lors de la récupération des réservations:",
            error
          );
          toast.error(`Erreur: ${error.message || "Problème de connexion"}`);
        }
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [activeTab, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] pt-28 flex items-center justify-center">
        <div className="text-[#002A5C]">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmée";
      case "pending":
        return "En attente";
      case "cancelled":
        return "Annulée";
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      toast.error(
        "Le nouveau mot de passe doit contenir au moins 8 caractères"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Mot de passe mis à jour avec succès");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Erreur lors du changement de mot de passe");
      }
    } catch (error) {
      toast.error("Erreur lors du changement de mot de passe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F9F9F9] pt-28">
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-[#002A5C]">Mon compte</h1>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Se déconnecter
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-[#F5E1C0] overflow-hidden">
            <div className="flex border-b border-[#F5E1C0]">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-[#3C8D0D] text-white"
                    : "text-[#002A5C] hover:bg-[#F5E1C0]/20"
                }`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveTab("reservations")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "reservations"
                    ? "bg-[#3C8D0D] text-white"
                    : "text-[#002A5C] hover:bg-[#F5E1C0]/20"
                }`}
              >
                Mes réservations
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                  activeTab === "settings"
                    ? "bg-[#3C8D0D] text-white"
                    : "text-[#002A5C] hover:bg-[#F5E1C0]/20"
                }`}
              >
                Paramètres
              </button>
            </div>

            <div className="p-8">
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#002A5C] mb-2">
                        Informations personnelles
                      </h3>
                      <div className="space-y-4">
                        <p>
                          <span className="font-medium">Nom :</span>{" "}
                          {user.lastName}
                        </p>
                        <p>
                          <span className="font-medium">Prénom :</span>{" "}
                          {user.firstName}
                        </p>
                        <p>
                          <span className="font-medium">Email :</span>{" "}
                          {user.email}
                        </p>
                        <p>
                          <span className="font-medium">
                            Date de naissance :
                          </span>{" "}
                          {user.birthday
                            ? new Date(user.birthday).toLocaleDateString(
                                "fr-FR"
                              )
                            : "Non renseignée"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#002A5C] mb-2">
                        Adresse
                      </h3>
                      {user.addresses && user.addresses.length > 0 ? (
                        <div className="space-y-4">
                          <p>
                            <span className="font-medium">Rue :</span>{" "}
                            {user.addresses[0].street}
                          </p>
                          <p>
                            <span className="font-medium">Code postal :</span>{" "}
                            {user.addresses[0].postCode}
                          </p>
                          <p>
                            <span className="font-medium">Ville :</span>{" "}
                            {user.addresses[0].city}
                          </p>
                          <p>
                            <span className="font-medium">Pays :</span>{" "}
                            {user.addresses[0].country}
                          </p>
                          <p>
                            <span className="font-medium">Téléphone :</span>{" "}
                            {user.addresses[0].phoneNumber}
                          </p>
                        </div>
                      ) : (
                        <p className="text-[#002A5C]/80">
                          Aucune adresse renseignée
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reservations" && (
                <div>
                  <h3 className="text-lg font-semibold text-[#002A5C] mb-6">
                    Historique des réservations
                  </h3>
                  {loadingBookings ? (
                    <div className="text-center py-4">
                      <div className="text-[#002A5C]">
                        Chargement des réservations...
                      </div>
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-6">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-white border border-[#F5E1C0] rounded-lg p-6 hover:shadow-lg transition-shadow"
                        >
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div className="flex-grow space-y-3">
                              <div className="flex items-start justify-between">
                                <h4 className="text-xl font-semibold text-[#002A5C]">
                                  {booking.offer.title}
                                </h4>
                                <span
                                  className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    booking.status
                                  )}`}
                                >
                                  {getStatusText(booking.status)}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Date :</span>{" "}
                                    {booking.timeSlot
                                      ? new Date(
                                          booking.timeSlot.date
                                        ).toLocaleDateString("fr-FR")
                                      : "Non disponible"}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    <span className="font-medium">Heure :</span>{" "}
                                    {booking.timeSlot
                                      ? new Date(
                                          booking.timeSlot.startTime
                                        ).toLocaleTimeString("fr-FR", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : "Non disponible"}
                                  </p>
                                </div>

                                {booking.payment && (
                                  <div className="space-y-1">
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">
                                        Montant HT :
                                      </span>{" "}
                                      {formatPrice(booking.payment.amount)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      <span className="font-medium">TVA :</span>{" "}
                                      {formatPrice(booking.payment.tvaAmount)}
                                    </p>
                                    <p className="text-sm font-medium text-[#002A5C]">
                                      Total TTC :{" "}
                                      {formatPrice(
                                        booking.payment.amount +
                                          booking.payment.tvaAmount
                                      )}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#002A5C]/80 text-center py-8">
                      Vous n'avez pas encore de réservation.
                    </p>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#002A5C] mb-4">
                    Paramètres du compte
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[#002A5C] font-medium mb-2">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Votre mot de passe actuel"
                          className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#002A5C] font-medium mb-2">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Votre nouveau mot de passe"
                          className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[#002A5C] font-medium mb-2">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirmez votre nouveau mot de passe"
                          className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full px-4 py-2 bg-[#3C8D0D] text-white rounded-lg transition-colors ${
                        isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#327A0B]"
                      }`}
                    >
                      {isSubmitting
                        ? "Mise à jour..."
                        : "Mettre à jour le mot de passe"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
