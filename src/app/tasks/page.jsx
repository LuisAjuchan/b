"use client";
import { useState, useContext,useEffect } from "react";
import TaskContext from "../../contexts/taskContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaClock, FaCheckCircle, FaTasks, FaPlus, FaTrash, FaEdit, FaList, FaHome, FaUser } from "react-icons/fa";
import { ClipLoader } from "react-spinners";


export default function TaskList() {
  const { tasks, loading, addTask, editTask, removeTask } = useContext(TaskContext);
  const [newTask, setNewTask] = useState({user_id:0 ,title: "", description: "",status_ic:0,priority_id: "1", status: "PEND"});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("");
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUserData = localStorage.getItem("dataUser");
  
    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);
  
        if (parsedData && Object.keys(parsedData).length > 0) {
          setUserData(parsedData);
        } else {
          console.warn("dataUser está vacío o no es un objeto válido:", parsedData);
        }
      } catch (error) {
        console.error("Error al parsear dataUser:", error);
      }
    }
  }, []);

  const refreshTasks = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula carga
    setIsProcessing(false);
  };


  const handleSaveTask = async () => {
    newTask.user_id = userData.id;
    if (newTask.title.trim() && newTask.description.trim()) {
      setIsProcessing(true);
      if (editingTask) {
        await editTask(editingTask.id, { ...editingTask, ...newTask });
        toast.success("Tarea actualizada correctamente");
      } else {
        await addTask(newTask);
        toast.success("Tarea agregada correctamente");
      }
      setNewTask({ title: "", description: "", status: "PEND" });
      setIsModalOpen(false);
      setEditingTask(null);
      await refreshTasks();
    }
  };

  const handleEditTask = (task) => {
    setNewTask(task);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PEND":
        return <FaTasks className="text-yellow-400 text-xl" />;
      case "INPG":
        return <FaClock className="text-blue-400 text-xl" />;
      case "COMP":
        return <FaCheckCircle className="text-green-400 text-xl" />;
      default:
        return <FaTasks className="text-gray-400 text-xl" />;
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task?.title?.toLowerCase()?.includes(filter.toLowerCase())
  );
  

  if (loading) return <p className="text-center text-gray-400">Cargando tareas...</p>;

  return (
    <div className="h-screen flex flex-col  text-gray-200">
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
         {isProcessing && <ClipLoader color="#36D7B7" size={50} className="mx-auto mb-4" />}

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
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-16 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaPlus className="text-2xl" />
        </button>
        <a href="#" className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition">
          <FaUser className="text-xl" />
          <span className="text-sm">Perfil</span>
        </a>
      </footer>

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
              <option value="PEND">Pendiente</option>
              <option value="INPG">En progreso</option>
              <option value="COMP">Completado</option>
            </select>
            <select
              value={newTask.priority_id}
              onChange={(e) => setNewTask({ ...newTask, priority_id: e.target.value })}
              className="w-full p-2 border rounded-lg bg-gray-700 text-white mb-4"
            >
              <option value="1">Baja</option>
              <option value="2">Media</option>
              <option value="3">Alta</option>
              <option value="4">Urgente</option>
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
