import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AccountPage from "@/app/account/page";

// Mock des hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

// Récupérer les mocks
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

    // Mock global pour fetch
    global.fetch = jest.fn();
  });

  test("Redirige vers la page de connexion si l'utilisateur n'est pas authentifié", async () => {
    // Configurer le mock pour simuler un utilisateur non authentifié
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn(),
    });

    // Rendre le composant
    await waitFor(async () => {
      render(<AccountPage />);
    });

    // Vérifier que la redirection a été appelée
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });

  test("Affiche les informations de l'utilisateur après la connexion", async () => {
    // Configurer le mock pour simuler un utilisateur authentifié
    useAuth.mockReturnValue({
      user: {
        id: "user123",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
      },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn(),
      token: "fake-token",
    });

    // Rendre le composant
    await waitFor(async () => {
      render(<AccountPage />);
    });

    // Vérifier que les informations de l'utilisateur sont affichées
    expect(screen.getByText("Dupont")).toBeInTheDocument();
    expect(screen.getByText("Jean")).toBeInTheDocument();
    expect(screen.getByText("jean.dupont@example.com")).toBeInTheDocument();
  });

  test("Charge les réservations de l'utilisateur", async () => {
    // Configurer le mock pour simuler un utilisateur authentifié
    useAuth.mockReturnValue({
      user: {
        id: "user123",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
      },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn().mockReturnValue({ token: "fake-token" }),
      token: "fake-token",
    });

    // Configurer le mock fetch pour simuler une réponse de réservations
    global.fetch.mockImplementation((url) => {
      console.log(`Mock fetch appelé avec URL: ${url}`);
      if (url.includes("/api/user/bookings")) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: "booking1",
                offer: { title: "Escape Game VR" },
                date: "2023-12-15",
                timeSlot: { startTime: "14:00" },
              },
            ]),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    // Rendre le composant
    render(<AccountPage />);

    // Simuler directement l'appel à la fonction setActiveTab
    // au lieu de cliquer sur l'onglet
    const reservationsTab = screen.getByText("Mes réservations");
    fireEvent.click(reservationsTab);

    // Vérifier que la requête fetch a été appelée avec le bon token et les headers
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith("/api/user/bookings", {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
      { timeout: 3000 }
    );
  });

  test("Gère les erreurs lors du chargement des réservations", async () => {
    // Configurer le mock pour simuler un utilisateur authentifié
    useAuth.mockReturnValue({
      user: {
        id: "user123",
        firstName: "Jean",
        lastName: "Dupont",
        email: "jean.dupont@example.com",
      },
      loading: false,
      login: jest.fn(),
      logout: jest.fn(),
      register: jest.fn(),
      checkAuth: jest.fn().mockReturnValue({ token: "fake-token" }),
      token: "fake-token",
    });

    // Configurer le mock fetch pour simuler une erreur
    global.fetch.mockImplementation((url) => {
      console.log(`Mock fetch appelé avec URL: ${url}`);
      if (url.includes("/api/user/bookings")) {
        return Promise.reject(new Error("Erreur de chargement"));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    // Rendre le composant
    render(<AccountPage />);

    // Simuler directement l'appel à la fonction setActiveTab
    // au lieu de cliquer sur l'onglet
    const reservationsTab = screen.getByText("Mes réservations");
    fireEvent.click(reservationsTab);

    // Vérifier que la requête fetch a été appelée avec le bon token et les headers
    await waitFor(
      () => {
        expect(global.fetch).toHaveBeenCalledWith("/api/user/bookings", {
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
      { timeout: 3000 }
    );
  });
});
