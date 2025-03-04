"use client";

import { createContext, useContext, useState, useEffect } from "react";
import{ getTasks, createTask, updateTask, deleteTask } from "../services/taskService"; // Ajusta la ruta según tu estructura

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener tareas al cargar
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        console.log('task', data);
        setTasks(data);
      } catch (error) {
        console.error("Error al obtener tareas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Agregar una nueva tarea
  const addTask = async (task) => {
    try {
      const newTask = await createTask(task);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  // Editar una tarea existente
  const editTask = async (id, updatedTask) => {
    try {
      const updated = await updateTask(id, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updated : task))
      );
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
    }
  };

  // Eliminar una tarea
  const removeTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, editTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
