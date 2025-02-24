"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const BookingForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, addToCart } = useCart();
  const offerId = searchParams.get("offerId");
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [offer, setOffer] = useState(null);

  useEffect(() => {
    // Charger les détails de l'offre
    const fetchOffer = async () => {
      const response = await fetch(`/api/offers/${offerId}`);
      const data = await response.json();
      if (data.success) {
        setOffer(data.data);
      }
    };
    if (offerId) {
      fetchOffer();
    }
  }, [offerId]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  // Debug log au montage du composant
  useEffect(() => {
    console.log("Current cart:", cart);
    console.log("OfferId from URL:", offerId);
  }, [cart, offerId]);

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(
        `/api/timeslots?date=${selectedDate.toISOString()}`
      );
      const data = await response.json();

      if (data.success) {
        // Les créneaux sont maintenant générés à partir des horaires d'ouverture
        setTimeSlots(
          data.data.map((slot) => ({
            id: new Date(slot.startTime).toISOString(), // On utilise l'heure comme ID
            startTime: new Date(slot.startTime).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            endTime: new Date(slot.endTime).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          }))
        );
      } else {
        toast.error(data.error || "Ce jour n'est pas ouvert");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux:", error);
      toast.error("Erreur lors de la récupération des créneaux");
    }
  };

  const handleAddToCart = () => {
    if (!selectedTimeSlot || !offer) {
      toast.error("Veuillez sélectionner un créneau horaire");
      return;
    }

    addToCart({
      ...offer,
      selectedDate,
      timeSlot: selectedTimeSlot,
    });

    router.push("/cart");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="w-full"
        />
      </div>

      {selectedDate && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#002A5C]">
            Créneaux disponibles pour le{" "}
            {selectedDate.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedTimeSlot?.id === slot.id
                    ? "bg-[#3C8D0D] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-[#002A5C]"
                }`}
              >
                {slot.startTime}
              </button>
            ))}
          </div>

          {selectedTimeSlot && (
            <button
              onClick={handleAddToCart}
              className="w-full py-3 rounded-lg text-white font-semibold bg-[#3C8D0D] hover:bg-[#327A0B] transition-colors"
            >
              Ajouter au panier
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingForm;
