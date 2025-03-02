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
    // Les logs de debug ont été supprimés
  }, [cart, offerId]);

  const fetchTimeSlots = async () => {
    try {
      if (selectedDate.getDay() === 0) {
        setTimeSlots([]);
        return;
      }

      const response = await fetch(
        `/api/timeslots?date=${selectedDate.toISOString()}&offerId=${offerId}`
      );
      const data = await response.json();

      if (data.success) {
        const now = new Date();
        setTimeSlots(
          data.data
            .filter((slot) => {
              const slotTime = new Date(slot.startTime);
              return slotTime > now;
            })
            .map((slot) => ({
              id: new Date(slot.startTime).toISOString(),
              startTime: new Date(slot.startTime).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              endTime: new Date(slot.endTime).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              fullStartTime: new Date(slot.startTime),
              fullEndTime: new Date(slot.endTime),
            }))
        );
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
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

  // Fonction pour désactiver les dimanches
  const tileDisabled = ({ date }) => {
    return date.getDay() === 0; // 0 = Dimanche
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <style jsx global>{`
          /* Réinitialiser tous les styles de weekend */
          .react-calendar__tile--weekend {
            color: inherit !important;
          }

          /* Appliquer le rouge uniquement aux dimanches */
          .react-calendar__tile--weekend.react-calendar__tile--disabled {
            color: #d10000 !important;
          }

          /* S'assurer que les samedis restent de la couleur normale */
          .react-calendar__tile--weekend:not(.react-calendar__tile--disabled) {
            color: inherit !important;
          }

          /* Style spécifique pour les samedis */
          .react-calendar__month-view__days__day--weekend:not(:nth-child(7n)) {
            color: inherit !important;
          }
        `}</style>
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          minDate={new Date()}
          className="w-full"
          tileDisabled={tileDisabled}
        />
      </div>

      {selectedDate && selectedDate.getDay() !== 0 && (
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
                <div>{slot.startTime}</div>
                <div className="text-sm">à {slot.endTime}</div>
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
