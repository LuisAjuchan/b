"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Expresión regular para validar email
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Validar contraseña (mínimo 6 caracteres, una mayúscula y un número)
  const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const { name, email, password, confirmPassword } = formData;

    // Validaciones
    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
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
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true); // Bloquear botón mientras se procesa

    setTimeout(() => {
      console.log("Usuario registrado:", formData);
      router.push("/login"); // Redirigir al login
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
          📝 Registrarse
        </motion.h1>
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Crea tu cuenta
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
            <label htmlFor="name" className="block text-gray-600 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-400" : "border-gray-800 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-400" : "border-gray-800 focus:ring-blue-400"
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
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-400" : "border-gray-800 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-600 mb-2">
              Confirmar contraseña
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 ${
                error ? "border-red-500 focus:ring-red-400" : "border-gray-800 focus:ring-blue-400"
              }`}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
