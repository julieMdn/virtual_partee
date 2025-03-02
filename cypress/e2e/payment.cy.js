describe("Processus de paiement", () => {
  beforeEach(() => {
    // Simuler un utilisateur connecté
    cy.setCookie("token", "fake-jwt-token");

    // Intercepter la requête pour obtenir le contenu du panier
    cy.intercept("GET", "/api/cart", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          items: [
            {
              id: "item123",
              offerId: "offer123",
              title: "Expérience VR Immersive",
              price: 29.99,
              image: "/images/vr-experience.jpg",
              timeSlotId: "timeslot1",
              timeSlot: {
                date: "2023-12-15",
                startTime: "14:00",
                endTime: "16:00",
              },
              quantity: 1,
            },
          ],
          total: 29.99,
        },
      },
    }).as("cartRequest");

    // Intercepter la requête de paiement
    cy.intercept("POST", "/api/payment", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          redirectUrl: "/payment/success",
        },
      },
    }).as("paymentRequest");

    // Intercepter la requête pour supprimer un article du panier
    cy.intercept("DELETE", "/api/cart/item/*", {
      statusCode: 200,
      body: {
        success: true,
        message: "Article supprimé du panier",
      },
    }).as("removeItemRequest");
  });

  it("devrait afficher le contenu du panier", () => {
    // Visiter la page du panier
    cy.visit("/cart");

    // Attendre que la requête du panier soit interceptée
    cy.wait("@cartRequest");

    // Vérifier que le contenu du panier est affiché
    cy.contains("Expérience VR Immersive").should("be.visible");
    cy.contains("29.99").should("be.visible");
    cy.contains("15/12/2023").should("be.visible");
    cy.contains("14:00").should("be.visible");
  });

  it("devrait permettre de supprimer un article du panier", () => {
    // Visiter la page du panier
    cy.visit("/cart");

    // Attendre que la requête du panier soit interceptée
    cy.wait("@cartRequest");

    // Cliquer sur le bouton de suppression
    cy.get('[data-testid="remove-item-button"]').click();

    // Attendre que la requête de suppression soit interceptée
    cy.wait("@removeItemRequest");

    // Vérifier que le message de succès est affiché
    cy.contains("Article supprimé du panier").should("be.visible");
  });

  it("devrait rediriger vers la page de paiement", () => {
    // Visiter la page du panier
    cy.visit("/cart");

    // Attendre que la requête du panier soit interceptée
    cy.wait("@cartRequest");

    // Cliquer sur le bouton de paiement
    cy.get('[data-testid="checkout-button"]').click();

    // Attendre que la requête de paiement soit interceptée
    cy.wait("@paymentRequest");

    // Vérifier la redirection vers la page de succès
    cy.url().should("include", "/payment/success");
  });

  it("devrait afficher un message si le panier est vide", () => {
    // Intercepter la requête pour obtenir un panier vide
    cy.intercept("GET", "/api/cart", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          items: [],
          total: 0,
        },
      },
    }).as("emptyCartRequest");

    // Visiter la page du panier
    cy.visit("/cart");

    // Attendre que la requête du panier soit interceptée
    cy.wait("@emptyCartRequest");

    // Vérifier que le message de panier vide est affiché
    cy.contains("Votre panier est vide").should("be.visible");
  });
});
