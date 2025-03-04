'use client';
import { useState, useContext, useEffect } from 'react';
import TaskContext from '../../contexts/taskContext';
import AuthContext from '../../contexts/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiLogout } from "react-icons/ci";
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
import { ClipLoader } from 'react-spinners';
import{ getTasks,getTasksByUser, createTask, updateTask, deleteTask } from "../../services/taskService"; // Ajusta la ruta según tu estructura

export default function TaskList() {
  const { tasks, loading, addTask, editTask, removeTask } = useContext(
    TaskContext
  );
  const {logout } = useContext(
    AuthContext
  );
  const [newTask, setNewTask] = useState({
    user_id: 0,
    title: '',
    description: '',
    status_ic: 0,
    priority_id: '1',
    status: 'PEND',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('');
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasksByUser, setTasksByUser] = useState([]);
  const router = useRouter();

 
// Función para obtener las tareas
const fetchTasks = async () => {
  try {
    const storedUserData = JSON.parse(localStorage.getItem("dataUser"));
    if (!storedUserData) return;
    setUserData(storedUserData);
    const data = await getTasksByUser(storedUserData.id);
    setTasksByUser(data);
  } catch (error) {
    console.error("Error al obtener tareas:", error);
  } finally {
  
  }
};
  
// Ejecutar fetchTasks al montar el componente y cuando `tasksByUser` cambie
useEffect(() => {
  fetchTasks();


}, [tasksByUser]);

   


  useEffect(() => {
    const storedUserData = localStorage.getItem('dataUser');

    if (storedUserData) {
      try {
        const parsedData = JSON.parse(storedUserData);

        if (parsedData && Object.keys(parsedData).length > 0) {
          setUserData(parsedData);
        } else {
          console.warn(
            'dataUser está vacío o no es un objeto válido:',
            parsedData
          );
        }
      } catch (error) {
        console.error('Error al parsear dataUser:', error);
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
        toast.success('Tarea actualizada correctamente');
      } else {
        await addTask(newTask);
        toast.success('Tarea agregada correctamente');
      }
      setNewTask({ title: '', description: '', status: 'PEND' });
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
      case 'PEND':
        return <FaTasks className='text-yellow-400 text-xl' />;
      case 'INPG':
        return <FaClock className='text-blue-400 text-xl' />;
      case 'COMP':
        return <FaCheckCircle className='text-green-400 text-xl' />;
      default:
        return <FaTasks className='text-gray-400 text-xl' />;
    }
  };
   
  {/* Función para obtener el texto y el color del estado */}
const getStatusLabel = (status) => {
  switch (status) {
    case "PEND":
      return { text: "Pendiente", color: "text-yellow-400" };
    case "INPG":
      return { text: "En progreso", color: "text-blue-400" };
    case "COMP":
      return { text: "Completado", color: "text-green-400" };
    default:
      return { text: "Desconocido", color: "text-gray-400" };
  }
};

  const filteredTasks = tasksByUser.filter((task) =>
    task?.title?.toLowerCase()?.includes(filter.toLowerCase())
  );

  if (loading)
    return <p className='text-center text-gray-400'>Cargando tareas...</p>;



  return (
    <div className='h-screen flex flex-col  text-gray-200'>
      <main className='flex-1 p-6'>
        <h2 className='text-3xl font-bold text-center text-gray-100 mb-6'>
          Lista de Tareas
        </h2>

        {/* Filtro de tareas */}
        <input
          type='text'
          placeholder='Buscar tareas...'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='w-full p-2 mb-4 border rounded-lg bg-gray-800 text-white'
        />
        {isProcessing && (
          <ClipLoader color='#36D7B7' size={50} className='mx-auto mb-4' />
        )}

        {/* Grid de tareas */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {filteredTasks.map((task) => (
        
            <div key={task.id} className='p-4 bg-gray-800 rounded-xl shadow-md'>
              {/* Toolbar con título e iconos */}

              <div className='flex justify-between items-center mb-3'>
                <span className='text-lg font-medium text-gray-100'>
                  {task.title}
                </span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEditTask(task)}
                    className='text-blue-400 hover:text-blue-500'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    className='text-red-400 hover:text-red-500'
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              {/* Descripción */}
              <p className='text-sm text-gray-400'>{task.description}</p>
              {/* Estado */}
              <div className='mt-3 flex items-center gap-2'>
                {getStatusIcon(task.status)}
                <span className='text-sm text-gray-300'>
                <span className={`text-sm font-medium ${getStatusLabel(task.status).color}`}>{   getStatusLabel(task.status).text}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Menú en el Footer */}
      <footer className='fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-around text-white'>
      <button
      onClick={logout}
      className="flex flex-col items-center gap-1 text-gray-300 hover:text-white transition"
    >
      <CiLogout className="text-xl" />
      <span className="text-sm">Salir</span>
    </button>
        <a
          href='#'
          className='flex flex-col items-center gap-1 text-gray-300 hover:text-white transition'
        >
          <FaList className='text-xl' />
          <span className='text-sm'>Tareas</span>
        </a>
        <button
          onClick={() => setIsModalOpen(true)}
          className='absolute bottom-16 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition'
        >
          <FaPlus className='text-2xl' />
        </button>
        <a
          href='#'
          className='flex flex-col items-center gap-1 text-gray-300 hover:text-white transition'
        >
          <FaUser className='text-xl' />
          <span className='text-sm'>Perfil</span>
        </a>
      </footer>

      {/* Modal para agregar o editar tarea */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-end justify-end p-6 bg-black bg-opacity-50 transition-all'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm'>
            <h3 className='text-xl font-bold text-gray-100 mb-4'>
              {editingTask ? 'Editar Tarea' : 'Agregar Nueva Tarea'}
            </h3>
            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Titulo {editingTask ? null : <span className="text-red-500">*</span>}
                
              </label>
              <input
                type='text'
                value={newTask.title}
                disabled={editingTask}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                placeholder='Ingresa un título'
                className={`w-full p-2 border rounded-lg mb-4 
                  ${editingTask ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white"}`}
                
              />
            </div>
            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Descripción {editingTask ? null : <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={newTask.description}
                disabled={editingTask}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder='Ingresa una descripción'
                className={`w-full p-2 border rounded-lg mb-4 
                  ${editingTask ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white"}`}
                
              />
            </div>

            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Estado {editingTask ? null : <span className="text-red-500">*</span>}
              </label>
              <select
                value={newTask.status}
            
                onChange={(e) =>
                  setNewTask({ ...newTask, status: e.target.value })
                }
                className='w-full p-2 border rounded-lg bg-gray-700 text-white mb-4'
              >
                <option value='PEND'>Pendiente</option>
                <option value='INPG'>En progreso</option>
                <option value='COMP'>Completado</option>
              </select>
            </div>

            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Prioridad {editingTask ? null : <span className="text-red-500">*</span>}
              </label>
              <select
                value={newTask.priority_id}
                disabled={editingTask}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority_id: e.target.value })
                }
                className={`w-full p-2 border rounded-lg mb-4 
                  ${editingTask ? "bg-gray-500 cursor-not-allowed" : "bg-gray-700 text-white"}`}
                
              >
                <option value='1'>Baja</option>
                <option value='2'>Media</option>
                <option value='3'>Alta</option>
                <option value='4'>Urgente</option>
              </select>
            </div>

            <div className='flex justify-end gap-2'>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTask(null);
                }}
                className='px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition'
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTask}
                className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
              >
                {editingTask ? 'Guardar Cambios' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
