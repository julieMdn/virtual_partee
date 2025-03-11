describe("Processus de réservation", () => {
  beforeEach(() => {
    // Simuler un utilisateur connecté
    cy.setCookie("token", "fake-jwt-token");
  });

  it("devrait afficher la page d'une offre", () => {
    // Visiter la page de l'offre
    cy.visit("/offres/1");

    // Attendre que la page se charge (en vérifiant qu'un élément est visible)
    cy.get("h1").should("exist");

    // Vérifier que la page contient des éléments attendus
    cy.get("main").should("be.visible");
  });

  it("devrait afficher un message d'erreur pour un ID d'offre invalide", () => {
    // Visiter la page avec un ID d'offre invalide
    cy.visit("/offres/invalid");

    // Vérifier que le message d'erreur s'affiche
    cy.contains("ID d'offre invalide").should("be.visible");
  });
});
