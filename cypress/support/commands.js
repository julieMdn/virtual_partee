// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Commande personnalisée pour se connecter
Cypress.Commands.add(
  "login",
  (email = "john@example.com", password = "password123") => {
    // Intercepter la requête de connexion
    cy.intercept("POST", "/api/auth/user/login", {
      statusCode: 200,
      body: {
        success: true,
        data: {
          user: {
            id: "user123",
            firstName: "John",
            lastName: "Doe",
            email: email,
          },
          token: "fake-jwt-token",
        },
      },
    }).as("loginRequest");

    // Visiter la page de connexion
    cy.visit("/login");

    // Remplir le formulaire
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Attendre la réponse de la requête
    cy.wait("@loginRequest");

    // Définir le cookie d'authentification
    cy.setCookie("token", "fake-jwt-token");
  }
);

// Commande personnalisée pour ajouter une offre au panier
Cypress.Commands.add("addToCart", (offerId = "offer123") => {
  // Intercepter la requête pour obtenir les détails de l'offre
  cy.intercept("GET", `/api/offers/${offerId}`, {
    statusCode: 200,
    body: {
      success: true,
      data: {
        id: offerId,
        title: "Expérience VR Immersive",
        description: "Une expérience de réalité virtuelle incroyable",
        price: 29.99,
        duration: 120,
        image: "/images/vr-experience.jpg",
      },
    },
  }).as("offerRequest");

  // Intercepter la requête pour obtenir les créneaux horaires
  cy.intercept("GET", `/api/timeslots*`, {
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
  cy.visit(`/offres/${offerId}`);

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
});

// Commande personnalisée pour vérifier le panier
Cypress.Commands.add("checkCart", (itemCount = 1, total = 29.99) => {
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
        total: total,
      },
    },
  }).as("cartRequest");

  // Visiter la page du panier
  cy.visit("/cart");

  // Attendre que la requête du panier soit interceptée
  cy.wait("@cartRequest");

  // Vérifier le nombre d'articles et le total
  cy.get('[data-testid="cart-item"]').should("have.length", itemCount);
  cy.contains(`${total}`).should("be.visible");
});
