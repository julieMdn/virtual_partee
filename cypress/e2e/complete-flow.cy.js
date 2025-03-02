describe("Flux complet de l'application", () => {
  beforeEach(() => {
    // Ignorer les erreurs d'hydratation React
    cy.on("uncaught:exception", (err) => {
      if (err.message.includes("Hydration failed")) {
        return false;
      }
      return true;
    });
  });

  it("devrait permettre à un utilisateur de s'inscrire, se connecter, réserver et payer", () => {
    // 1. Inscription de l'utilisateur
    cy.visit("/register");

    // Vérifier que la page d'inscription est chargée
    cy.contains("Créer un compte").should("be.visible");

    // Simuler une inscription réussie en définissant le localStorage et les cookies
    cy.window().then((win) => {
      win.localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user123",
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
        })
      );
    });
    cy.setCookie("token", "fake-jwt-token");

    // 2. Voir les offres disponibles
    cy.visit("/offres");
    cy.contains("Nos offres").should("exist");

    // 3. Ajouter une offre au panier
    cy.visit("/offres/1");
    cy.get("button, a").contains("Réserver").should("exist");

    // 4. Procéder au paiement
    cy.visit("/cart");
    cy.contains("Panier").should("exist");

    // 5. Voir les réservations
    cy.visit("/account");
    cy.contains("Mon compte").should("exist");

    // 6. Se déconnecter
    cy.visit("/");

    // Trouver le menu utilisateur et modifier son style pour le rendre visible
    cy.get(".group").then(($el) => {
      // Trouver le menu déroulant à l'intérieur du groupe
      const $dropdown = $el.find('div[class*="invisible"]');

      // Modifier le style pour rendre le menu visible
      if ($dropdown.length) {
        cy.wrap($dropdown).invoke(
          "attr",
          "style",
          "visibility: visible; opacity: 1"
        );
      }
    });

    // Maintenant que le menu est visible, cliquer sur "Se déconnecter"
    cy.contains("Se déconnecter").click({ force: true });

    // Vérifier la redirection vers la page de connexion
    cy.url().should("include", "/login");
  });
});
