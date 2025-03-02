import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AccountPage from "@/app/account/page";

// Récupérer les mocks
jest.mock("next/navigation");
jest.mock("@/context/AuthContext");
jest.mock("react-hot-toast");

describe("Flux d'authentification (intégration)", () => {
  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Mock par défaut pour useRouter
    useRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
    });
  });

  test("devrait rediriger vers la page de connexion si l'utilisateur n'est pas connecté", async () => {
    // Configurer le mock pour useAuth (utilisateur non connecté)
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      logout: jest.fn(),
      checkAuth: jest.fn().mockResolvedValue(false),
    });

    // Rendre le composant
    render(<AccountPage />);

    // Vérifier que la redirection a été appelée
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });

  test("devrait afficher les informations de l'utilisateur après connexion", async () => {
    // Configurer le mock pour useAuth (utilisateur connecté)
    useAuth.mockReturnValue({
      user: {
        id: "user123",
        email: "test@example.com",
        firstName: "Jean",
        lastName: "Dupont",
      },
      loading: false,
      logout: jest.fn(),
      checkAuth: jest.fn().mockResolvedValue(true),
    });

    // Configurer le mock pour fetch (pas de réservations)
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    // Rendre le composant
    render(<AccountPage />);

    // Vérifier que les informations de l'utilisateur sont affichées
    await waitFor(() => {
      expect(screen.getByText(/Jean Dupont/i)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
    });
  });

  test("devrait charger les réservations de l'utilisateur", async () => {
    // Configurer le mock pour useAuth (utilisateur connecté)
    useAuth.mockReturnValue({
      user: { id: "user123", email: "test@example.com" },
      loading: false,
      logout: jest.fn(),
      checkAuth: jest.fn().mockResolvedValue(true),
    });

    // Configurer le mock pour fetch (avec des réservations)
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "booking1",
            offer: { title: "Escape Game VR" },
            timeSlot: {
              date: "2023-12-15",
              startTime: "2023-12-15T14:00:00.000Z",
              endTime: "2023-12-15T15:00:00.000Z",
            },
            status: "confirmed",
          },
        ]),
    });

    // Rendre le composant
    render(<AccountPage />);

    // Vérifier que les réservations sont affichées
    await waitFor(() => {
      expect(screen.getByText(/Escape Game VR/i)).toBeInTheDocument();
      expect(screen.getByText(/15\/12\/2023/i)).toBeInTheDocument();
      expect(screen.getByText(/14:00/i)).toBeInTheDocument();
    });
  });

  test("devrait gérer les erreurs lors du chargement des réservations", async () => {
    // Configurer le mock pour useAuth (utilisateur connecté)
    useAuth.mockReturnValue({
      user: { id: "user123", email: "test@example.com" },
      loading: false,
      logout: jest.fn(),
      checkAuth: jest.fn().mockResolvedValue(true),
    });

    // Configurer le mock pour fetch (avec une erreur)
    global.fetch.mockRejectedValueOnce(new Error("Erreur de chargement"));

    // Rendre le composant
    render(<AccountPage />);

    // Vérifier que le message d'erreur est affiché
    await waitFor(() => {
      expect(
        screen.getByText(/Erreur lors du chargement de vos réservations/i)
      ).toBeInTheDocument();
    });
  });
});
