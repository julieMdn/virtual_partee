import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authProvider = {
  // Appelé quand l'utilisateur tente de se connecter
  login: async ({ username, password }) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user = await response.json();
      localStorage.setItem("auth", JSON.stringify(user));
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return Promise.reject("Invalid credentials");
    }
  },

  // Appelé quand l'utilisateur clique sur le bouton de déconnexion
  logout: () => {
    localStorage.removeItem("auth");
    return Promise.resolve();
  },

  // Appelé quand l'API retourne une erreur
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("auth");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  // Appelé quand l'utilisateur navigue dans l'application
  checkAuth: () => {
    return localStorage.getItem("auth") ? Promise.resolve() : Promise.reject();
  },

  // Appelé pour obtenir les permissions de l'utilisateur
  getPermissions: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return Promise.reject();

    const { role } = JSON.parse(auth);
    return Promise.resolve(role);
  },

  // Appelé quand l'application a besoin d'afficher les informations de l'utilisateur
  getIdentity: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return Promise.reject();

    const { id, fullName } = JSON.parse(auth);
    return Promise.resolve({ id, fullName });
  },

  // Appelé pour vérifier si l'utilisateur peut accéder à une ressource
  canAccess: async ({ resource, action }) => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      return Promise.reject();
    }
    const { user } = JSON.parse(auth);

    // Exemple de vérification des permissions
    if (user.role === "ADMIN") {
      return Promise.resolve(); // Les admins ont accès à tout
    }

    // Ajouter ici votre logique de permissions
    return Promise.reject();
  },

  // Appelé après une redirection OAuth
  handleCallback: async () => {
    // À implémenter si vous utilisez OAuth
    return Promise.resolve();
  },
};

export default authProvider;
