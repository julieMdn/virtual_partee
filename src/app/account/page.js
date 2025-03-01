"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Account() {
  const { user, loading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      if (activeTab === "reservations") {
        setLoadingBookings(true);
        try {
          const response = await fetch("/api/user/bookings");
          if (response.ok) {
            const data = await response.json();
            setBookings(data);
          } else {
            console.error("Erreur lors de la récupération des réservations");
          }
        } catch (error) {
          console.error("Erreur:", error);
        }
        setLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [activeTab]);

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
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
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
                  <h3 className="text-lg font-semibold text-[#002A5C] mb-4">
                    Historique des réservations
                  </h3>
                  {loadingBookings ? (
                    <div className="text-center py-4">
                      <div className="text-[#002A5C]">
                        Chargement des réservations...
                      </div>
                    </div>
                  ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="border border-[#F5E1C0] rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-[#002A5C]">
                                {booking.offer.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Date :{" "}
                                {new Date(booking.eventDate).toLocaleDateString(
                                  "fr-FR"
                                )}{" "}
                                à{" "}
                                {new Date(booking.eventDate).toLocaleTimeString(
                                  "fr-FR",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                              {booking.payment && (
                                <p className="text-sm text-gray-600">
                                  Montant : {booking.payment.amount.toFixed(2)}€
                                  HT (TVA :{" "}
                                  {booking.payment.tvaAmount.toFixed(2)}€)
                                </p>
                              )}
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {getStatusText(booking.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[#002A5C]/80">
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
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[#002A5C] font-medium mb-2">
                        Changer le mot de passe
                      </label>
                      <input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        className="w-full px-4 py-2 border border-[#F5E1C0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C8D0D] focus:border-transparent"
                      />
                    </div>
                    <button className="px-4 py-2 bg-[#3C8D0D] text-white rounded-lg hover:bg-[#327A0B] transition-colors">
                      Mettre à jour
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
