"use client";  // Agrega esta línea al principio del archivo

import { useState, useContext } from "react";
import AuthContext from "../../src/contexts/authContext"; // Asegúrate de que la ruta sea correcta
import Input from "../../src/components/Input";
import Button from "../../src/components/Button";

export default function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Iniciar sesión</h2>
        
        {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 mb-2">Correo electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="Tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-600 mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Iniciar sesión
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