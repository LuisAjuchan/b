"use client";
import { createContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";
import { login as apiLogin } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(jwtDecode(token));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const token = await apiLogin(email, password);
      localStorage.setItem("token", token);
      setUser(jwtDecode(token));
      router.push("/tasks");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
