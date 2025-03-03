import React from "react";
import { render, screen } from "@testing-library/react";
import Footer from "../../../src/components/ui/Footer";

// Mock du composant Link de Next.js
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

describe("Footer", () => {
  it("devrait rendre le footer avec le texte correct", () => {
    render(<Footer />);

    // Vérifie que le texte est présent
    expect(
      screen.getByText("2025 Virtual Partee - Tous droits réservés.")
    ).toBeInTheDocument();
  });

  it("devrait avoir un lien vers la page d'accueil", () => {
    render(<Footer />);

    // Vérifie que le lien est présent et pointe vers la bonne URL
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/");
  });

  it("devrait avoir les bonnes classes CSS", () => {
    const { container } = render(<Footer />);

    // Vérifie que le footer a les bonnes classes
    const footer = container.querySelector("footer");
    expect(footer).toHaveClass(
      "text-center",
      "bg-[#002A5C]",
      "p-4",
      "text-[#F9F9F9]",
      "font-bold"
    );
  });
});
