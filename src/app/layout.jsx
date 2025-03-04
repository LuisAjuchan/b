'use client';

import { useState, useEffect } from 'react';
import { AuthProvider } from '../contexts/authContext';
import { TaskProvider } from '../contexts/taskContext';
import '../app/globals.css';
import { ToastContainer } from 'react-toastify';
import {
  FaClock,
  FaCheckCircle,
  FaTasks,
  FaPlus,
  FaTrash,
  FaEdit,
  FaList,
  FaHome,
  FaUser,
} from 'react-icons/fa';

export default function RootLayout({ children }) {


  return (
    <html lang='en'>
      <head>
        <meta charSet='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <title>Gestor de Tareas</title>
      </head>
      <body>
        <TaskProvider>
          <AuthProvider>{children}</AuthProvider>
        </TaskProvider>
        
   
      </body>
    </html>
  );
}
