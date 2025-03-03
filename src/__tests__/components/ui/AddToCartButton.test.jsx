import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useCart } from "@/context/CartContext";
import AddToCartButton from "../../../components/ui/AddToCartButton";
import { toast } from "react-hot-toast";

// Mock des dépendances
jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("react-hot-toast", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("AddToCartButton", () => {
  const mockOffer = {
    id: 1,
    title: "Test Offer",
  };

  const mockAddToCart = jest.fn();

  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
    useCart.mockReturnValue({ addToCart: mockAddToCart });
  });

  it("devrait afficher le bouton avec le bon texte", () => {
    render(<AddToCartButton offer={mockOffer} />);
    expect(screen.getByText("Ajouter au panier")).toBeInTheDocument();
  });

  it("devrait avoir les bonnes classes CSS", () => {
    render(<AddToCartButton offer={mockOffer} />);
    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "bg-[#F5E1C0]",
      "hover:bg-[#F0D4A8]",
      "text-[#002A5C]",
      "font-semibold",
      "py-3",
      "px-6",
      "rounded-lg",
      "transition-colors"
    );
  });

  it("devrait afficher une erreur si date ou créneau non sélectionnés", () => {
    render(<AddToCartButton offer={mockOffer} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(toast.error).toHaveBeenCalledWith(
      "Veuillez sélectionner une date et un créneau horaire"
    );
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it("devrait ajouter au panier si date et créneau sont sélectionnés", () => {
    const selectedDate = "2024-03-02";
    const timeSlot = "14:00";

    render(
      <AddToCartButton
        offer={mockOffer}
        selectedDate={selectedDate}
        timeSlot={timeSlot}
      />
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith({
      ...mockOffer,
      selectedDate,
      timeSlot,
    });
    expect(toast.error).not.toHaveBeenCalled();
  });
});
