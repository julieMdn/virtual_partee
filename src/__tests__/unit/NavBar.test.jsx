import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "@/components/ui/NavBar";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

// Mocks
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

describe("NavBar", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    usePathname.mockReturnValue("/");
    useCart.mockReturnValue({ cart: [] });
    useAuth.mockReturnValue({ user: null, logout: mockLogout });
  });

  it("ne devrait pas s'afficher sur les pages admin", () => {
    usePathname.mockReturnValue("/admin");
    render(<NavBar />);
    expect(screen.queryByText("Virtual Partee")).not.toBeInTheDocument();

    usePathname.mockReturnValue("/pages/admin");
    render(<NavBar />);
    expect(screen.queryByText("Virtual Partee")).not.toBeInTheDocument();
  });

  it("devrait afficher le logo et les liens de navigation", () => {
    render(<NavBar />);

    expect(screen.getByText("Virtual Partee")).toBeInTheDocument();
    expect(screen.getByText("Réserver")).toBeInTheDocument();
    expect(screen.getByText("Le concept")).toBeInTheDocument();
    expect(screen.getByText("Nos offres")).toBeInTheDocument();
    expect(screen.getByText("Contactez-nous")).toBeInTheDocument();
  });

  it("devrait afficher le lien de connexion quand non connecté", () => {
    render(<NavBar />);
    expect(screen.getByText("Se connecter")).toBeInTheDocument();
  });

  it("devrait afficher le menu utilisateur quand connecté", () => {
    useAuth.mockReturnValue({
      user: { firstName: "John" },
      logout: mockLogout,
    });

    render(<NavBar />);

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Mon profil")).toBeInTheDocument();
    expect(screen.getByText("Se déconnecter")).toBeInTheDocument();
  });

  it("devrait appeler logout quand on clique sur Se déconnecter", () => {
    useAuth.mockReturnValue({
      user: { firstName: "John" },
      logout: mockLogout,
    });

    render(<NavBar />);

    fireEvent.click(screen.getByText("Se déconnecter"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("devrait afficher le nombre d'articles dans le panier", () => {
    useCart.mockReturnValue({ cart: [1, 2, 3] }); // 3 articles dans le panier

    render(<NavBar />);

    // Utiliser getAllByText au lieu de getByText car il y a maintenant deux éléments avec "3"
    const cartCountElements = screen.getAllByText("3");
    expect(cartCountElements.length).toBeGreaterThan(0);
  });

  it("ne devrait pas afficher le compteur si le panier est vide", () => {
    useCart.mockReturnValue({ cart: [] });

    render(<NavBar />);

    const cartCount = screen.queryByText("0");
    expect(cartCount).not.toBeInTheDocument();
  });
});
