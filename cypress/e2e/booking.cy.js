describe("Processus de réservation", () => {
  beforeEach(() => {
    // Simuler un utilisateur connecté
    cy.setCookie("token", "fake-jwt-token");

    // Intercepter la requête pour obtenir les détails de l'offre
    cy.intercept("GET", "/api/offers/offer123", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          id: "offer123",
          title: "Expérience VR Immersive",
          description: "Une expérience de réalité virtuelle incroyable",
          price: 29.99,
          duration: 120,
          image: "/images/vr-experience.jpg",
        },
      },
    }).as("offerRequest");
  });

  it("devrait afficher les détails d'une offre", () => {
    // Visiter la page de l'offre
    cy.visit("/offres/offer123");

    // Attendre que la requête d'offre soit interceptée
    cy.wait("@offerRequest");

    // Vérifier que les détails de l'offre sont affichés
    cy.contains("Expérience VR Immersive").should("be.visible");
    cy.contains("Une expérience de réalité virtuelle incroyable").should(
      "be.visible"
    );
    cy.contains("29.99").should("be.visible");
    cy.contains("120 minutes").should("be.visible");
  });

  it("devrait permettre de sélectionner une date et un créneau horaire", () => {
    // Intercepter la requête pour obtenir les créneaux horaires
    cy.intercept("GET", "/api/timeslots*", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: "timeslot1",
            date: "2023-12-15",
            startTime: "14:00",
            endTime: "16:00",
            capacity: 10,
            availableSpots: 5,
          },
        ],
      },
    }).as("timeslotsRequest");

    // Visiter la page de l'offre
    cy.visit("/offres/offer123");

    // Attendre que la requête d'offre soit interceptée
    cy.wait("@offerRequest");

    // Sélectionner une date
    cy.get('[data-testid="date-picker"]').click();
    cy.contains("15").click();

    // Attendre que la requête de créneaux horaires soit interceptée
    cy.wait("@timeslotsRequest");

    // Sélectionner un créneau horaire
    cy.contains("14:00 - 16:00").click();

    // Vérifier que le créneau horaire est sélectionné
    cy.contains("14:00 - 16:00").should("have.class", "selected");
  });

  it("devrait ajouter une offre au panier après sélection d'une date et d'un créneau", () => {
    // Intercepter la requête pour obtenir les créneaux horaires
    cy.intercept("GET", "/api/timeslots*", {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: "timeslot1",
            date: "2023-12-15",
            startTime: "14:00",
            endTime: "16:00",
            capacity: 10,
            availableSpots: 5,
          },
        ],
      },
    }).as("timeslotsRequest");

    // Intercepter la requête pour ajouter au panier
    cy.intercept("POST", "/api/cart/add", {
      statusCode: 200,
      body: {
        success: true,
        message: "Offre ajoutée au panier avec succès",
      },
    }).as("addToCartRequest");

    // Visiter la page de l'offre
    cy.visit("/offres/offer123");

    // Attendre que la requête d'offre soit interceptée
    cy.wait("@offerRequest");

    // Sélectionner une date
    cy.get('[data-testid="date-picker"]').click();
    cy.contains("15").click();

    // Attendre que la requête de créneaux horaires soit interceptée
    cy.wait("@timeslotsRequest");

    // Sélectionner un créneau horaire
    cy.contains("14:00 - 16:00").click();

    // Cliquer sur le bouton d'ajout au panier
    cy.get('[data-testid="add-to-cart-button"]').click();

    // Attendre que la requête d'ajout au panier soit interceptée
    cy.wait("@addToCartRequest");

    // Vérifier que le message de succès est affiché
    cy.contains("Offre ajoutée au panier avec succès").should("be.visible");
  });

  it("devrait afficher une erreur si aucun créneau n'est sélectionné", () => {
    // Visiter la page de l'offre
    cy.visit("/offres/offer123");

    // Attendre que la requête d'offre soit interceptée
    cy.wait("@offerRequest");

    // Cliquer sur le bouton d'ajout au panier sans sélectionner de date ni de créneau
    cy.get('[data-testid="add-to-cart-button"]').click();

    // Vérifier que le message d'erreur est affiché
    cy.contains("Veuillez sélectionner une date et un créneau horaire").should(
      "be.visible"
    );
  });
});
