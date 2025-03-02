"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    checkAuth();
  }, []);

  const checkAuth = () => {
    const tokenFromCookie = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (tokenFromCookie && storedUser) {
      setToken(tokenFromCookie);
      setUser(JSON.parse(storedUser));
    } else {
      setToken(null);
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Stockage du token et des informations utilisateur
        Cookies.set("token", data.data.token, {
          expires: 1,
          path: "/",
          sameSite: "Lax",
        });
        localStorage.setItem("user", JSON.stringify(data.data.user));
        setToken(data.data.token);
        setUser(data.data.user);
        router.push("/account");
        return { success: true };
      } else {
        return { success: false, error: data.message };
      }
    } catch (error) {
      return {
        success: false,
        error: "Une erreur est survenue lors de la connexion",
      };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
