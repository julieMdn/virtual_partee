describe("Processus de paiement", () => {
  // Désactiver la détection des exceptions non gérées pour éviter les erreurs d'hydratation React
  Cypress.on("uncaught:exception", (err, runnable) => {
    // Retourner false empêche Cypress de faire échouer le test
    return false;
  });

  beforeEach(() => {
    // Simuler un utilisateur connecté
    cy.setCookie("token", "fake-jwt-token");

    // Nettoyer le localStorage avant chaque test
    cy.clearLocalStorage();
  });

  it("devrait afficher le contenu du panier", () => {
    // Visiter d'abord la page du panier
    cy.visit("/pages/cart");

    // Attendre que la page soit chargée
    cy.contains("Votre panier est vide").should("be.visible");

    // Puis ajouter un article au panier via localStorage
    cy.window().then((win) => {
      const cartItem = {
        id: 1,
        cartId: "1-123456789",
        title: "Expérience VR Immersive",
        price: 29.99,
        picture: "/images/vr-experience.jpg",
        selectedDate: "2023-12-15T00:00:00.000Z",
        timeSlot: {
          id: "timeslot1",
          startTime: "14:00",
          endTime: "16:00",
        },
        quantity: 1,
      };
      win.localStorage.setItem("cart", JSON.stringify([cartItem]));

      // Recharger la page pour voir le panier avec l'article
      cy.reload();
    });

    // Vérifier que le contenu du panier est affiché
    cy.contains("Expérience VR Immersive").should("be.visible");
    cy.contains("29.99").should("be.visible");
    cy.contains("15/12/2023").should("be.visible");
    cy.contains("14:00").should("be.visible");
  });

  it("devrait permettre de supprimer un article du panier", () => {
    // Visiter d'abord la page du panier
    cy.visit("/pages/cart");

    // Attendre que la page soit chargée
    cy.contains("Votre panier est vide").should("be.visible");

    // Puis ajouter un article au panier via localStorage
    cy.window().then((win) => {
      const cartItem = {
        id: 1,
        cartId: "1-123456789",
        title: "Expérience VR Immersive",
        price: 29.99,
        picture: "/images/vr-experience.jpg",
        selectedDate: "2023-12-15T00:00:00.000Z",
        timeSlot: {
          id: "timeslot1",
          startTime: "14:00",
          endTime: "16:00",
        },
        quantity: 1,
      };
      win.localStorage.setItem("cart", JSON.stringify([cartItem]));

      // Recharger la page pour voir le panier avec l'article
      cy.reload();
    });

    // Vérifier que l'article est présent
    cy.contains("Expérience VR Immersive").should("be.visible");

    // Cliquer sur le bouton de suppression
    cy.contains("Supprimer").click();

    // Vérifier que le message de succès est affiché (via toast)
    cy.contains("Réservation retirée du panier").should("be.visible");

    // Vérifier que le panier est maintenant vide
    cy.contains("Votre panier est vide").should("be.visible");
  });

  it("devrait rediriger vers la page de paiement", () => {
    // Intercepter la requête de paiement
    cy.intercept("POST", "/api/payment", {
      statusCode: 200,
      body: {
        success: true,
        url: "/payment/success",
      },
    }).as("paymentRequest");

    // Visiter d'abord la page du panier
    cy.visit("/pages/cart");

    // Attendre que la page soit chargée
    cy.contains("Votre panier est vide").should("be.visible");

    // Puis ajouter un article au panier via localStorage
    cy.window().then((win) => {
      const cartItem = {
        id: 1,
        cartId: "1-123456789",
        title: "Expérience VR Immersive",
        price: 29.99,
        picture: "/images/vr-experience.jpg",
        selectedDate: "2023-12-15T00:00:00.000Z",
        timeSlot: {
          id: "timeslot1",
          startTime: "14:00",
          endTime: "16:00",
        },
        quantity: 1,
      };
      win.localStorage.setItem("cart", JSON.stringify([cartItem]));

      // Recharger la page pour voir le panier avec l'article
      cy.reload();
    });

    // Vérifier que l'article est présent
    cy.contains("Expérience VR Immersive").should("be.visible");

    // Cliquer sur le bouton de paiement
    cy.contains("Procéder au paiement").click();

    // Attendre que la requête de paiement soit interceptée
    cy.wait("@paymentRequest");

    // Vérifier que le localStorage a été vidé (panier vidé)
    cy.window().then((win) => {
      const cart = JSON.parse(win.localStorage.getItem("cart") || "[]");
      expect(cart.length).to.equal(0);
    });
  });

  it("devrait afficher un message si le panier est vide", () => {
    // S'assurer que le panier est vide
    cy.clearLocalStorage("cart");

    // Visiter la page du panier
    cy.visit("/pages/cart");

    // Vérifier que le message de panier vide est affiché
    cy.contains("Votre panier est vide").should("be.visible");

    // Vérifier que le bouton pour voir les offres est présent
    cy.contains("Voir nos offres").should("be.visible");
  });
});
