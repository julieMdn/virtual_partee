import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import toast from "react-hot-toast";

// Récupérer les mocks
jest.mock("next/navigation");
jest.mock("@/context/AuthContext");
jest.mock("@/context/CartContext");
jest.mock("react-hot-toast");

describe("Flux d'ajout au panier et paiement (intégration)", () => {
  // Données de test
  const offer = {
    id: "offer123",
    title: "Escape Game VR",
    price: 100,
  };

  const timeSlot = {
    id: "slot1",
    date: "2023-12-15",
    startTime: "2023-12-15T14:00:00.000Z",
    endTime: "2023-12-15T15:00:00.000Z",
  };

  beforeEach(() => {
    // Réinitialiser les mocks
    jest.clearAllMocks();

    // Mock par défaut pour useRouter
    useRouter.mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
    });

    // Mock par défaut pour useAuth
    useAuth.mockReturnValue({
      user: { id: "user123", email: "test@example.com" },
      loading: false,
      checkAuth: jest.fn().mockResolvedValue(true),
    });

    // Mock par défaut pour useCart
    useCart.mockReturnValue({
      cart: { items: [], total: 0 },
      loading: false,
      addToCart: jest.fn().mockResolvedValue({ success: true }),
      error: null,
    });

    // Mock par défaut pour fetch
    global.fetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    );
  });

  test("devrait ajouter un article au panier", async () => {
    // Rendre le composant
    render(
      <AuthProvider>
        <CartProvider>
          <AddToCartButton
            offer={offer}
            selectedTimeSlot={timeSlot}
            isDisabled={false}
          />
        </CartProvider>
      </AuthProvider>
    );

    // Vérifier que le bouton est présent
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    expect(addToCartButton).toBeInTheDocument();

    // Cliquer sur le bouton d'ajout au panier
    fireEvent.click(addToCartButton);

    // Vérifier que la fonction addToCart a été appelée
    await waitFor(() => {
      expect(useCart().addToCart).toHaveBeenCalledWith(
        expect.objectContaining({
          offerId: "offer123",
          timeSlotId: "slot1",
        })
      );
    });

    // Vérifier que le toast de succès a été appelé
    expect(toast.success).toHaveBeenCalled();
  });

  test("devrait gérer les erreurs lors de l'ajout au panier", async () => {
    // Modifier le mock pour simuler une erreur
    useCart.mockReturnValue({
      cart: { items: [], total: 0 },
      loading: false,
      addToCart: jest
        .fn()
        .mockRejectedValue(new Error("Erreur d'ajout au panier")),
      error: "Erreur d'ajout au panier",
    });

    // Rendre le composant
    render(
      <AuthProvider>
        <CartProvider>
          <AddToCartButton
            offer={offer}
            selectedTimeSlot={timeSlot}
            isDisabled={false}
          />
        </CartProvider>
      </AuthProvider>
    );

    // Cliquer sur le bouton d'ajout au panier
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    fireEvent.click(addToCartButton);

    // Vérifier que la fonction addToCart a été appelée
    await waitFor(() => {
      expect(useCart().addToCart).toHaveBeenCalled();
    });

    // Vérifier que le toast d'erreur a été appelé
    expect(toast.error).toHaveBeenCalled();
  });

  test("devrait désactiver le bouton si aucun créneau n'est sélectionné", async () => {
    // Rendre le composant avec timeSlot à null
    render(
      <AuthProvider>
        <CartProvider>
          <AddToCartButton
            offer={offer}
            selectedTimeSlot={null}
            isDisabled={true}
          />
        </CartProvider>
      </AuthProvider>
    );

    // Vérifier que le bouton est désactivé
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    expect(addToCartButton).toBeDisabled();
  });

  test("devrait rediriger vers la page de connexion si l'utilisateur n'est pas connecté", async () => {
    // Modifier le mock pour simuler un utilisateur non connecté
    useAuth.mockReturnValue({
      user: null,
      loading: false,
      checkAuth: jest.fn().mockResolvedValue(false),
    });

    // Rendre le composant
    render(
      <AuthProvider>
        <CartProvider>
          <AddToCartButton
            offer={offer}
            selectedTimeSlot={timeSlot}
            isDisabled={false}
          />
        </CartProvider>
      </AuthProvider>
    );

    // Cliquer sur le bouton d'ajout au panier
    const addToCartButton = screen.getByText(/Ajouter au panier/i);
    fireEvent.click(addToCartButton);

    // Vérifier que la redirection a été appelée
    await waitFor(() => {
      expect(useRouter().push).toHaveBeenCalledWith("/login");
    });
  });
});
