import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// Mocks
jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("AddToCartButton", () => {
  const mockAddToCart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCart.mockReturnValue({ addToCart: mockAddToCart });
    useAuth.mockReturnValue({ user: { id: "user123" } });
  });

  it("devrait afficher le bouton d'ajout au panier", () => {
    render(<AddToCartButton offer={{ id: "offer123", price: 100 }} />);

    expect(screen.getByText("Ajouter au panier")).toBeInTheDocument();
  });

  it("devrait afficher une erreur si la date ou le créneau n'est pas sélectionné", () => {
    render(<AddToCartButton offer={{ id: "offer123", price: 100 }} />);

    fireEvent.click(screen.getByText("Ajouter au panier"));

    expect(toast.error).toHaveBeenCalledWith(
      "Veuillez sélectionner une date et un créneau horaire"
    );
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it("devrait appeler addToCart quand on clique sur le bouton avec tous les paramètres", () => {
    const offer = { id: "offer123", price: 100 };
    const selectedDate = "2023-12-15";
    const timeSlot = { id: "slot123", startTime: "14:00" };

    render(
      <AddToCartButton
        offer={offer}
        selectedDate={selectedDate}
        timeSlot={timeSlot}
      />
    );

    fireEvent.click(screen.getByText("Ajouter au panier"));

    expect(mockAddToCart).toHaveBeenCalledWith({
      ...offer,
      selectedDate,
      timeSlot,
    });
  });
});
