// app/layout.js
"use client"; // Asegúrate de que este archivo se ejecute en el cliente

import { AuthProvider } from "../contexts/authContext"; // Ruta correcta al contexto
import { TaskProvider } from "../contexts/taskContext"; // Ruta correcta al contexto
import "../app/globals.css"; // Asegúrate de importar los estilos globales
import { ToastContainer } from 'react-toastify'
import { FaClock, FaCheckCircle, FaTasks, FaPlus, FaTrash, FaEdit, FaList, FaHome, FaUser } from "react-icons/fa";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Aquí puedes agregar tus metas, links y scripts globales */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Gestor de Tareas</title>
      </head>
      <body>
        {/* Aquí puedes agregar el AuthProvider para envolver toda la aplicación */}
        <TaskProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
        </TaskProvider>
      </body>
      {/* Menú en el Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-around text-white">
        <a href="#" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
          <FaHome className="text-xl" />
          <span className="text-sm">Inicio</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
          <FaList className="text-xl" />
          <span className="text-sm">Tareas</span>
        </a>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
          <FaUser className="text-xl" />
          <span className="text-sm">Perfil</span>
        </a>
      </footer>
    </html>
  );
}