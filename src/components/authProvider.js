"use client";

const authProvider = {
  // Appelé lors de la connexion
  async login({ username, password }) {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Erreur de connexion");
      }

      const user = await response.json();
      console.log("Received user data:", user);

      localStorage.setItem("user", JSON.stringify(user));
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error.message);
    }
  },

  // Appelé lors de la déconnexion
  async logout() {
    localStorage.removeItem("user");
    return Promise.resolve();
  },

  // Appelé quand l'API retourne une erreur
  async checkError(error) {
    const status = error.status;
    if (status === 401 || status === 403) {
      localStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Appelé quand l'utilisateur navigue
  async checkAuth() {
    const user = localStorage.getItem("user");
    if (!user) {
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Appelé pour obtenir l'identité de l'utilisateur
  async getIdentity() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return Promise.reject();

      const user = JSON.parse(userStr);

      return Promise.resolve({
        id: user.id,
        fullName: user.fullName, // Utilisez directement fullName comme renvoyé par l'API
        role: user.role,
      });
    } catch (error) {
      console.error("Error in getIdentity:", error);
      return Promise.reject(error);
    }
  },

  // Appelé pour obtenir les permissions de l'utilisateur
  getPermissions: () => {
    const auth = localStorage.getItem("user");
    if (!auth) return Promise.reject();
    return Promise.resolve();
  },
};

export default authProvider;
