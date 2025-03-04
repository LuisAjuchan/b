"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";
import { login as Login, register as Register } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token"); // Eliminar token inválido
        setUser(null);
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const auth = await Login(email, password);
      if (auth.token) {
        localStorage.setItem("token", auth.token);
        localStorage.setItem("dataUser", JSON.stringify(auth.user));
        
        setUser(jwtDecode(auth.token));
        router.push("/tasks");
      }
    } catch (error) {
      console.error("Login fallido:", error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await Register(userData);
      if (response?.token) {
        localStorage.setItem("token", response.token);
   
        setUser(jwtDecode(response.token));
        router.push("/tasks");
      }
    } catch (error) {
      console.error("Registro fallido:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("dataUser");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
