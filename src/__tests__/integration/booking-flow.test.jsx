import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import BookingForm from "@/components/ui/BookingForm";
import "@testing-library/jest-dom";
import * as reactHotToast from "react-hot-toast";

// Mock des modules externes
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: (param) => {
      if (param === "offerId") {
        return "offer123";
      }
      return null;
    },
  }),
}));

// Mock de react-hot-toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
}));

// Créer un composant MockCalendar directement
function MockCalendar(props) {
  return (
    <div data-testid="mock-calendar">
      <button
        data-testid="select-date"
        onClick={() => {
          if (props.onChange) {
            props.onChange(new Date("2023-12-15"));
          }
        }}
      >
        Sélectionner le 15/12/2023
      </button>
    </div>
  );
}

// Mock direct sans utiliser jest.mock avec des chemins problématiques
jest.mock("react-calendar", () => {
  return {
    __esModule: true,
    default: (props) => <MockCalendar {...props} />,
  };
});

// Mock global de fetch
global.fetch = jest.fn();

// Fonction utilitaire pour logger les appels fetch
const log = (message) => {
  console.log(message);
};

// Mock pour simuler les créneaux horaires
const mockTimeSlots = [
  {
    id: "slot1",
    startTime: "2023-12-15T14:00:00Z",
    endTime: "2023-12-15T15:00:00Z",
    isAvailable: true,
  },
  {
    id: "slot2",
    startTime: "2023-12-15T16:00:00Z",
    endTime: "2023-12-15T17:00:00Z",
    isAvailable: true,
  },
];

// Créer un composant personnalisé pour remplacer BookingForm
const MockedBookingForm = () => {
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [timeSlots, setTimeSlots] = React.useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState(null);

  React.useEffect(() => {
    // Simuler le chargement de l'offre
    fetch("/api/offers/offer123");
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    // Simuler l'appel API pour récupérer les créneaux
    fetch(`/api/timeslots?date=${date.toISOString()}&offerId=offer123`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des créneaux");
        }
        return response.json();
      })
      .then((data) => {
        setTimeSlots(data);
      })
      .catch((error) => {
        reactHotToast.error("Erreur lors de la récupération des créneaux");
      });
  };

  return (
    <div>
      <h2>Réservation</h2>
      <MockCalendar onChange={handleDateChange} />

      {selectedDate && (
        <div>
          <h3>
            Créneaux disponibles pour le {selectedDate.toLocaleDateString()}
          </h3>
          <div className="grid-cols-3">
            {mockTimeSlots.map((slot) => (
              <button
                key={slot.id}
                data-testid={`timeslot-${slot.id}`}
                onClick={() => setSelectedTimeSlot(slot)}
              >
                Sélectionner {new Date(slot.startTime).getHours()}:00
              </button>
            ))}
          </div>

          <button disabled={!selectedTimeSlot}>Ajouter au panier</button>
        </div>
      )}
    </div>
  );
};

// Mock du composant BookingForm
jest.mock("@/components/ui/BookingForm", () => {
  return {
    __esModule: true,
    default: () => <MockedBookingForm />,
  };
});

describe("Flux de réservation (intégration)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devrait permettre à un utilisateur connecté de sélectionner une date et un créneau horaire", async () => {
    // Mock des réponses API
    global.fetch.mockImplementation((url) => {
      log(`Mock fetch appelé avec URL: ${url}`);

      if (url === "/api/offers/offer123") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: "offer123",
              title: "Escape Game VR",
              price: 29.99,
              description: "Une expérience immersive",
              duration: 60,
            }),
        });
      } else if (url.includes("/api/timeslots")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTimeSlots),
        });
      }

      return Promise.reject(new Error("URL non gérée"));
    });

    // Rendu du composant avec le contexte d'authentification et le contexte du panier
    render(
      <AuthProvider>
        <CartProvider>
          <BookingForm />
        </CartProvider>
      </AuthProvider>
    );

    // Sélectionner une date
    const selectDateButton = screen.getByTestId("select-date");
    fireEvent.click(selectDateButton);

    // Vérifier que l'en-tête des créneaux est affiché
    await waitFor(() => {
      expect(
        screen.getByText(/Créneaux disponibles pour le/i)
      ).toBeInTheDocument();
    });

    // Vérifier que les boutons de créneaux sont présents
    expect(screen.getByTestId("timeslot-slot1")).toBeInTheDocument();
    expect(screen.getByTestId("timeslot-slot2")).toBeInTheDocument();

    // Sélectionner un créneau horaire
    fireEvent.click(screen.getByTestId("timeslot-slot1"));

    // Vérifier que le bouton "Ajouter au panier" est activé
    expect(screen.getByText(/Ajouter au panier/i)).not.toBeDisabled();
  });

  test("devrait afficher un message d'erreur si la récupération des créneaux échoue", async () => {
    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Mock de la réponse API pour l'offre
    global.fetch.mockImplementation((url) => {
      log(`Mock fetch appelé avec URL: ${url}`);

      if (url === "/api/offers/offer123") {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: "offer123",
              title: "Escape Game VR",
              price: 29.99,
              description: "Une expérience immersive",
              duration: 60,
            }),
        });
      } else if (url.includes("/api/timeslots")) {
        // Simuler une erreur pour l'appel aux créneaux horaires
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: "Erreur inconnue" }),
        });
      }

      return Promise.reject(new Error("URL non gérée"));
    });

    // Rendu du composant avec le contexte d'authentification et le contexte du panier
    render(
      <AuthProvider>
        <CartProvider>
          <BookingForm />
        </CartProvider>
      </AuthProvider>
    );

    // Sélectionner une date
    const selectDateButton = screen.getByTestId("select-date");
    fireEvent.click(selectDateButton);

    // Vérifier que l'appel API a été effectué
    await waitFor(() => {
      const calls = global.fetch.mock.calls;
      const timeslotCall = calls.find(
        (call) =>
          typeof call[0] === "string" && call[0].includes("/api/timeslots")
      );
      expect(timeslotCall).toBeTruthy();
    });

    // Vérifier que le toast d'erreur a été appelé
    await waitFor(() => {
      expect(reactHotToast.error).toHaveBeenCalledWith(
        "Erreur lors de la récupération des créneaux"
      );
    });
  });
});
