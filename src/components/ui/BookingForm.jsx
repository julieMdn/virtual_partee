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
  const { cart, createBooking } = useCart();
  const offerId = searchParams.get("offerId");
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

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

  const handleReservation = async () => {
    try {
      if (!selectedDate || !selectedTimeSlot) {
        toast.error("Veuillez sélectionner une date et un créneau horaire");
        return;
      }

      await createBooking(
        parseInt(offerId),
        selectedDate.toISOString(),
        selectedTimeSlot.id // On envoie l'heure comme ID
      );

      toast.success("Réservation confirmée !");
      router.push("/cart");
    } catch (error) {
      console.error("Erreur de réservation:", error);
      toast.error(error.message || "Erreur lors de la réservation");
    }
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

          <button
            onClick={handleReservation}
            disabled={!selectedTimeSlot}
            className={`w-full py-3 rounded-lg text-white font-semibold transition-colors ${
              selectedTimeSlot
                ? "bg-[#3C8D0D] hover:bg-[#327A0B]"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirmer la réservation
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
