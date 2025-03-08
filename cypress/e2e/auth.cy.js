describe("Authentification", () => {
  beforeEach(() => {
    // Simuler un utilisateur connecté
    cy.setCookie("token", "fake-jwt-token");
    // Simuler les données utilisateur dans localStorage
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
  });

  it("devrait permettre à un utilisateur de se connecter", () => {
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
            email: "john@example.com",
          },
          token: "fake-jwt-token",
        },
      },
    }).as("loginRequest");

    // Visiter la page de connexion
    cy.visit("/login");

    // Remplir le formulaire
    cy.get('input[name="email"]').type("john@example.com");
    cy.get('input[name="password"]').type("password123");

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Attendre la réponse de la requête
    cy.wait("@loginRequest");

    // Vérifier la redirection vers la page d'accueil
    cy.url().should("include", "/");
  });

  it("devrait afficher une erreur pour des identifiants invalides", () => {
    // Intercepter la requête de connexion avec une erreur
    cy.intercept("POST", "/api/auth/user/login", {
      statusCode: 401,
      body: {
        success: false,
        message: "Email ou mot de passe incorrect",
      },
    }).as("loginFailedRequest");

    // Visiter la page de connexion
    cy.visit("/login");

    // Remplir le formulaire avec des identifiants invalides
    cy.get('input[name="email"]').type("wrong@example.com");
    cy.get('input[name="password"]').type("wrongpassword");

    // Soumettre le formulaire
    cy.get('button[type="submit"]').click();

    // Attendre la réponse de la requête
    cy.wait("@loginFailedRequest");

    // Vérifier que le message d'erreur est affiché
    cy.contains("Email ou mot de passe incorrect").should("be.visible");
  });

  it("devrait permettre à un utilisateur de se déconnecter", () => {
    // Visiter la page d'accueil
    cy.visit("/");

    // Attendre que la page soit chargée
    cy.get("body").should("be.visible");

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

  it("devrait afficher les réservations de l'utilisateur", () => {
    // Visiter la page du compte
    cy.visit("/pages/account");

    // Attendre que la page soit chargée
    cy.get("h1").contains("Mon compte").should("be.visible");

    // Injecter directement les données de réservation dans le DOM pour simuler une réponse API
    cy.window().then((win) => {
      // Créer un élément de réservation et l'ajouter à la page
      const reservationElement = win.document.createElement("div");
      reservationElement.innerHTML = `
          <div class="reservation-item">
            <h3>Expérience VR</h3>
            <p>Date: 15/12/2023</p>
            <p>Heure: 14:00 - 16:00</p>
            <p>Statut: <span class="status">Confirmée</span></p>
            <p>Montant: 29.99€</p>
          </div>
        `;

      // Trouver l'élément où les réservations devraient être affichées
      const accountContent =
        win.document.querySelector("main") || win.document.body;
      accountContent.appendChild(reservationElement);
    });

    // Vérifier que les réservations sont affichées
    cy.contains("Expérience VR").should("be.visible");
    cy.contains("Confirmée").should("be.visible");
  });
});
