import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authProvider = {
  // Appelé lors de la connexion
  login: async ({ username, password }) => {
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const user = await response.json();
      localStorage.setItem("auth", JSON.stringify(user));
      return Promise.resolve();
    } catch {
      return Promise.reject("Invalid credentials");
    }
  },

  // Appelé lors de la déconnexion
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

  // Appelé quand l'utilisateur navigue
  checkAuth: () => {
    return localStorage.getItem("auth") ? Promise.resolve() : Promise.reject();
  },

  // Appelé pour obtenir l'identité de l'utilisateur
  getIdentity: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return Promise.reject();

    const { fullName } = JSON.parse(auth);
    return Promise.resolve({ id: "user", fullName });
  },

  // Appelé pour obtenir les permissions de l'utilisateur
  getPermissions: () => {
    const auth = localStorage.getItem("auth");
    if (!auth) return Promise.reject();
    return Promise.resolve();
  },
};

export default authProvider;
