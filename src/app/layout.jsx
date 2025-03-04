// app/layout.js
"use client"; // Asegúrate de que este archivo se ejecute en el cliente

import { AuthProvider } from "../contexts/authContext"; // Ruta correcta al contexto
import "../app/globals.css"; // Asegúrate de importar los estilos globales
import { ToastContainer } from 'react-toastify'

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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}