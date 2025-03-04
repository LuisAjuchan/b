"use client";
import { useState, useContext } from "react";
import TaskContext from "../../contexts/taskContext";
import { FaClock, FaCheckCircle, FaTasks, FaPlus, FaTrash, FaEdit, FaList, FaHome, FaUser } from "react-icons/fa";

export default function TaskList() {
  const { tasks, loading, addTask, editTask, removeTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "pending" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("");

  const handleSaveTask = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      if (editingTask) {
        editTask({ ...editingTask, ...newTask });
      } else {
        addTask(newTask);
      }
      setNewTask({ title: "", description: "", status: "pending" });
      setIsModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleEditTask = (task) => {
    setNewTask(task);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaTasks className="text-yellow-400 text-xl" />;
      case "in-progress":
        return <FaClock className="text-blue-400 text-xl" />;
      case "completed":
        return <FaCheckCircle className="text-green-400 text-xl" />;
      default:
        return <FaTasks className="text-gray-400 text-xl" />;
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <p className="text-center text-gray-400">Cargando tareas...</p>;

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-gray-200">
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">Lista de Tareas</h2>

        {/* Filtro de tareas */}
        <input
          type="text"
          placeholder="Filtrar tareas..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg bg-gray-800 text-white"
        />

        {/* Grid de tareas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="p-4 bg-gray-800 rounded-xl shadow-md">
              {/* Toolbar con título e iconos */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-medium text-gray-100">{task.title}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleEditTask(task)} className="text-blue-400 hover:text-blue-500">
                    <FaEdit />
                  </button>
                  <button onClick={() => removeTask(task.id)} className="text-red-400 hover:text-red-500">
                    <FaTrash />
                  </button>
                </div>
              </div>
              {/* Descripción */}
              <p className="text-sm text-gray-400">{task.description}</p>
              {/* Estado */}
              <div className="mt-3 flex items-center gap-2">
                {getStatusIcon(task.status)}
                <span className="text-sm text-gray-300">{task.status.replace("-", " ")}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      

      {/* Modal para agregar o editar tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-end justify-end p-6 bg-black bg-opacity-50 transition-all">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-bold text-gray-100 mb-4">
              {editingTask ? "Editar Tarea" : "Agregar Nueva Tarea"}
            </h3>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Título"
              className="w-full p-2 border rounded-lg bg-gray-700 text-white mb-2"
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Descripción"
              className="w-full p-2 border rounded-lg bg-gray-700 text-white mb-2 h-20"
            />
            <select
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              className="w-full p-2 border rounded-lg bg-gray-700 text-white mb-4"
            >
              <option value="pending">Pendiente</option>
              <option value="in-progress">En progreso</option>
              <option value="completed">Completado</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTask(null);
                }}
                className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTask}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingTask ? "Guardar Cambios" : "Agregar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
