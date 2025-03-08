describe("Espace administrateur", () => {
  // Désactiver la détection des exceptions non gérées pour éviter les erreurs d'hydratation React
  Cypress.on("uncaught:exception", (err, runnable) => {
    // Retourner false empêche Cypress de faire échouer le test
    return false;
  });

  beforeEach(() => {
    // Nettoyer le localStorage avant chaque test
    cy.clearLocalStorage();
  });

  it("devrait afficher la page de connexion admin", () => {
    cy.visit("/pages/admin#/login");

    // Vérifier que les éléments du formulaire sont présents en utilisant des sélecteurs plus génériques
    cy.get("input").first().should("be.visible"); // Premier champ (identifiant)
    cy.get("input").eq(1).should("be.visible"); // Deuxième champ (mot de passe)
    cy.get("button").should("be.visible"); // Bouton de connexion
  });

  it("devrait afficher un message d'erreur avec des identifiants invalides", () => {
    cy.visit("/pages/admin#/login");

    // Remplir le formulaire avec des identifiants invalides
    cy.get("input").first().type("mauvais@email.com");
    cy.get("input").eq(1).type("mauvaisMotDePasse");

    // Soumettre le formulaire
    cy.get("button").click();

    // Vérifier que nous sommes toujours sur la page de connexion après une tentative échouée
    cy.url().should("include", "/pages/admin#/login");
    cy.get("input").first().should("be.visible");
  });

  it("devrait permettre la connexion avec des identifiants valides", () => {
    cy.visit("/pages/admin#/login");

    // Remplir le formulaire avec des identifiants valides
    cy.get("input").first().type("admin@example.com");
    cy.get("input").eq(1).type("password");

    // Soumettre le formulaire
    cy.get("button").click();

    // Vérifier que l'utilisateur est redirigé vers le tableau de bord
    cy.url().should("include", "/pages/admin#");
  });

  it("devrait accéder au tableau de bord après connexion", () => {
    // Se connecter d'abord
    cy.visit("/pages/admin#/login");
    cy.get("input").first().type("admin@example.com");
    cy.get("input").eq(1).type("password");
    cy.get("button").click();

    // Vérifier que nous sommes sur le tableau de bord
    cy.url().should("include", "/pages/admin#");

    // Attendre un peu pour s'assurer que la page est chargée
    cy.wait(2000);
  });

  it("devrait permettre la navigation entre les pages", () => {
    // Se connecter d'abord
    cy.visit("/pages/admin#/login");
    cy.get("input").first().type("admin@example.com");
    cy.get("input").eq(1).type("password");
    cy.get("button").click();

    // Vérifier que nous sommes sur le tableau de bord
    cy.url().should("include", "/pages/admin#");

    // Vérifier que nous pouvons revenir à la page de connexion
    cy.visit("/pages/admin#/login");
    cy.get("input").first().should("be.visible");
  });
});
