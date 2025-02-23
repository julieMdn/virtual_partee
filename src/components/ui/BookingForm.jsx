"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const BookingForm = () => {
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [offer, setOffer] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (offerId) {
      fetchOffer();
    }
  }, [offerId]);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDate]);

  const fetchOffer = async () => {
    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setOffer(data.data);
      } else {
        setError(data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'offre:", error);
      setError("Impossible de charger l'offre");
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const response = await fetch(
        `/api/timeslots?date=${selectedDate.toISOString()}`
      );
      const data = await response.json();
      if (data.success) {
        setTimeSlots(data.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des créneaux:", error);
    }
  };

  const handleReservation = async () => {
    if (!selectedDate || !selectedTimeSlot) return;

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          offerId,
          timeSlotId: selectedTimeSlot,
          date: selectedDate,
        }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = `/confirmation/${data.data.id}`;
      }
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
    }
  };

  // Fonction pour désactiver les dimanches
  const tileDisabled = ({ date }) => {
    return date.getDay() === 0; // 0 représente le dimanche
  };

  // Fonction pour personnaliser l'apparence des jours désactivés
  const tileClassName = ({ date }) => {
    if (date.getDay() === 0) {
      return "text-gray-300 cursor-not-allowed";
    }
  };

  return (
    <>
      {offer && (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-[#002A5C] mb-4">
            {offer.title}
          </h2>
          <p className="text-[#002A5C]/80 mb-4">{offer.description}</p>
          <p className="text-2xl font-bold text-[#3C8D0D]">
            {offer.price.toFixed(2)}€
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-[#002A5C] mb-4">
            Sélectionnez une date
          </h3>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            minDate={new Date()}
            className="w-full"
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-[#002A5C] mb-4">
            Créneaux disponibles
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => setSelectedTimeSlot(slot.id)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  selectedTimeSlot === slot.id
                    ? "bg-[#3C8D0D] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-[#002A5C]"
                }`}
              >
                {slot.startTime} - {slot.endTime}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleReservation}
          disabled={!selectedDate || !selectedTimeSlot}
          className={`px-8 py-4 rounded-lg text-white text-lg font-semibold transition-colors ${
            selectedDate && selectedTimeSlot
              ? "bg-[#3C8D0D] hover:bg-[#327A0B]"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Confirmer la réservation
        </button>
      </div>
    </>
  );
};

export default BookingForm;
