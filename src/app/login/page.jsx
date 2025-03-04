"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expresión regular para validar email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validar contraseña (mínimo 6 caracteres, al menos una mayúscula y un número)
  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones antes de enviar
    if (!validateEmail(email)) {
      setError("Por favor ingresa un email válido.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener al menos 6 caracteres, una mayúscula y un número."
      );
      return;
    }

    setIsSubmitting(true); // Deshabilitar botón mientras se procesa

    setTimeout(() => {
      if (email === "admin@example.com" && password === "Password123") {
        router.push("/dashboard");
      } else {
        setError("Credenciales incorrectas.");
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#3B82F6] to-[#14B8A6]">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-wide"
        >
          📌 Gestor de Tareas
        </motion.h1>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Iniciar sesión
        </h2>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm text-center mb-4"
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-6  text-gray-700 ${
                error ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 text-gray-700 ${
                error ? "border-red-500 focus:ring-red-400" : "border-gray-200 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
