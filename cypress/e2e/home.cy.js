describe("Page d'accueil", () => {
  beforeEach(() => {
    // Visiter la page d'accueil avant chaque test
    cy.visit("http://localhost:3000");
  });

  it("devrait charger la page d'accueil", () => {
    // Vérifier que la page se charge correctement
    cy.url().should("include", "/");
  });

  it("devrait avoir un titre", () => {
    // Vérifier la présence d'un titre (à adapter selon votre structure HTML)
    cy.get("h1").should("exist");
  });
});
