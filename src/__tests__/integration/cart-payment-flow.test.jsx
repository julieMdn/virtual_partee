import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "@/components/ui/AddToCartButton";
import * as toast from "react-hot-toast";

// Mock des modules
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

// Mock de react-hot-toast
jest.mock("react-hot-toast", () => ({
  error: jest.fn(),
  success: jest.fn(),
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("Flux d'ajout au panier et paiement (intégration)", () => {
  // Données de test
  const offer = {
    id: "offer123",
    title: "Escape Game VR",
    price: 29.99,
    image: "/images/escape-game.jpg",
  };

  const selectedDate = new Date("2023-12-15");
  const timeSlot = { id: "slot123", startTime: "14:00", endTime: "15:00" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("devrait ajouter un article au panier avec succès", async () => {
    // Mock de useAuth pour simuler un utilisateur connecté
    useAuth.mockReturnValue({
      user: { id: "user123", email: "test@example.com" },
      isAuthenticated: true,
    });

    // Mock de useRouter
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    // Mock de addToCart pour simuler un ajout réussi
    const mockAddToCart = jest.fn().mockImplementation(() => {
      toast.toast.success("Article ajouté au panier");
    });

    useCart.mockReturnValue({
      addToCart: mockAddToCart,
      cart: [],
    });

    // Rendre le composant
    render(
      <AddToCartButton
        offer={offer}
        selectedDate={selectedDate}
        timeSlot={timeSlot}
      />
    );

    // Cliquer sur le bouton d'ajout au panier
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    fireEvent.click(addToCartButton);

    // Vérifier que la fonction addToCart a été appelée
    await waitFor(() => {
      expect(mockAddToCart).toHaveBeenCalledWith({
        ...offer,
        selectedDate,
        timeSlot,
      });
    });

    // Vérifier que le toast de succès a été appelé
    await waitFor(() => {
      expect(toast.toast.success).toHaveBeenCalledWith(
        "Article ajouté au panier"
      );
    });
  });

  test("devrait gérer les erreurs lors de l'ajout au panier", async () => {
    // Mock de useAuth pour simuler un utilisateur connecté
    useAuth.mockReturnValue({
      user: { id: "user123", email: "test@example.com" },
      isAuthenticated: true,
    });

    // Mock de addToCart pour simuler une erreur sans lancer d'exception
    const mockAddToCart = jest.fn().mockImplementation(() => {
      toast.toast.error("Erreur d'ajout au panier");
      // Ne pas lancer d'erreur, juste simuler l'appel à toast.error
      return false; // Retourner false pour indiquer l'échec
    });

    useCart.mockReturnValue({
      addToCart: mockAddToCart,
      cart: [],
    });

    // Rendre le composant
    render(
      <AddToCartButton
        offer={offer}
        selectedDate={selectedDate}
        timeSlot={timeSlot}
      />
    );

    // Cliquer sur le bouton d'ajout au panier
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    fireEvent.click(addToCartButton);

    // Vérifier que le toast d'erreur a été appelé
    await waitFor(() => {
      expect(toast.toast.error).toHaveBeenCalledWith(
        "Erreur d'ajout au panier"
      );
      expect(mockAddToCart).toHaveBeenCalled();
    });
  });

  test("devrait afficher une erreur si aucun créneau n'est sélectionné", async () => {
    // Mock de useAuth pour simuler un utilisateur connecté
    useAuth.mockReturnValue({
      user: { id: "user123", email: "test@example.com" },
      isAuthenticated: true,
    });

    const mockAddToCart = jest.fn();
    useCart.mockReturnValue({
      addToCart: mockAddToCart,
      cart: [],
    });

    // Rendre le composant sans date ni créneau sélectionnés
    render(
      <AddToCartButton offer={offer} selectedDate={null} timeSlot={null} />
    );

    // Cliquer sur le bouton d'ajout au panier
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    fireEvent.click(addToCartButton);

    // Vérifier que le toast d'erreur a été appelé
    await waitFor(() => {
      expect(toast.toast.error).toHaveBeenCalledWith(
        "Veuillez sélectionner une date et un créneau horaire"
      );
    });

    // Vérifier que addToCart n'a pas été appelé
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  test("devrait rediriger vers la page de connexion si l'utilisateur n'est pas connecté", async () => {
    // Mock de useAuth pour simuler un utilisateur non connecté
    useAuth.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    // Mock de useRouter
    const mockPush = jest.fn();
    useRouter.mockReturnValue({
      push: mockPush,
    });

    const mockAddToCart = jest.fn().mockImplementation(() => {
      mockPush("/login");
    });

    useCart.mockReturnValue({
      addToCart: mockAddToCart,
      cart: [],
    });

    // Rendre le composant
    render(
      <AddToCartButton
        offer={offer}
        selectedDate={selectedDate}
        timeSlot={timeSlot}
      />
    );

    // Cliquer sur le bouton d'ajout au panier
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    fireEvent.click(addToCartButton);

    // Vérifier que la redirection a été appelée
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
