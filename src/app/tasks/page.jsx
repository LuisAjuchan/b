'use client';
import { useState, useContext, useEffect } from 'react';
import TaskContext from '../../contexts/taskContext';
import AuthContext from '../../contexts/authContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiLogout } from 'react-icons/ci';
import {
  FaClock,
  FaCheckCircle,
  FaTasks,
  FaPlus,
  FaTrash,
  FaEdit,
  FaList,
  FaHome,
  FaBiking,
  FaUser,
} from 'react-icons/fa';

import ClipLoader from 'react-spinners/ClipLoader';
import PacmanLoader from 'react-spinners/PacmanLoader';
import {
  getTasks,
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
} from '../../services/taskService'; // Ajusta la ruta según tu estructura

export default function TaskList() {
  const { tasks, loading, addTask, editTask, removeTask } = useContext(
    TaskContext
  );
  const { logout } = useContext(AuthContext);
  const [newTask, setNewTask] = useState({
    user_id: 0,
    title: '',
    description: '',
    status_ic: 0,
    priority_id: '1',
    status: 'PEND',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [activeTab, setActiveTab] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('');
  const [userData, setUserData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tasksByUser, setTasksByUser] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [time, setTime] = useState(new Date());
 

  
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      const storedUserData = JSON.parse(localStorage.getItem('dataUser'));
      if (!storedUserData) return;

      setUserData(storedUserData);

      const data = await getTasksByUser(storedUserData.id);
      setTasksByUser(data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
    }
  };

  // Detectar la pestaña activa en la URL
  useEffect(() => {
    setActiveTab(window.location.hash);
  }, []);

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [shouldFetch]); // Se ejecuta cuando shouldFetch cambia

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

    setShouldFetch((prev) => !prev);
    setIsProcessing(false);
  };

  const handleSaveTask = async () => {
    newTask.user_id = userData.id;
    if (newTask.title.trim() && newTask.description.trim()) {
      setIsProcessing(true);
      if (editingTask) {
        await editTask(editingTask.id, { ...editingTask, ...newTask });
        toast.success('Tarea actualizada correctamente');
        await refreshTasks();
      } else {
        await addTask(newTask);
        toast.success('Tarea agregada correctamente');
        await refreshTasks();
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

  {
    /* Función para obtener el texto y el color del estado */
  }
  const getStatusLabel = (status) => {
    switch (status) {
      case 'PEND':
        return { text: 'Pendiente', color: 'text-yellow-400' };
      case 'INPG':
        return { text: 'En progreso', color: 'text-blue-400' };
      case 'COMP':
        return { text: 'Completado', color: 'text-green-400' };
      default:
        return { text: 'Desconocido', color: 'text-gray-400' };
    }
  };

  const filteredTasks = tasksByUser.filter((task) =>
    task?.title?.toLowerCase()?.includes(filter.toLowerCase())
  );

  if (loading)
    return <p className='text-center text-gray-400'>Cargando tareas...</p>;

  return (
    <div className='h-screen flex flex-col  text-gray-200'>
      <header className='grid grid-cols-3 items-center bg-gradient-to-t from-gray-900 to-gray-800 mb-6 px-4 py-2 bg-gray-900 rounded-b-xl'>
        <h1 className='text-3xl font-bold text-center text-gray-100 col-span-3'>
          Lista de Tareas
        </h1>
      </header>

      <main className='flex-1 p-6'>
        {/* Filtro de tareas */}
        <input
          type='text'
          placeholder='Buscar tareas...'
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className='w-full p-2 mb-4 border rounded-lg bg-gray-800 text-white'
        />
        {isProcessing && (
          <div className='fixed inset-0 flex flex-col items-center justify-center bg-transparent'>
            <div className='bg-white/20 p-6 rounded-3xl shadow-lg flex flex-col items-center backdrop-blur-lg'>
              <PacmanLoader color='#FFD700' size={10}>
                <FaBiking />
              </PacmanLoader>
              <p className='mt-4 text-sm font-semibold text-gray-100'>
                Loading...
              </p>
              <p className='mt-2 text-gray-300 text-sm'>
                {time.toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Grid de tareas */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1'>
          {filteredTasks.map((task) => (
            <div key={task.id} className='p-4 bg-gray-800 rounded-xl shadow-md'>
              {/* Toolbar con título e iconos */}

              <div className='flex justify-between items-center mb-3'>
                <span className='text-lg font-medium text-gray-100'>
                  {task.title}
                </span>
                <div className='flex gap-2'>
                  <button
                    onClick={() => {
                      refreshTasks();
                      handleEditTask(task);
                    }}
                    className='text-blue-400 hover:text-blue-500'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => {
                      refreshTasks();
                      removeTask(task.id);
                    }}
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
                  <span
                    className={`text-sm font-medium ${
                      getStatusLabel(task.status).color
                    }`}
                  >
                    {getStatusLabel(task.status).text}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Menú en el Footer */}
      <footer className='fixed bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-gray-800  flex justify-around items-center text-white shadow-lg rounded-t-3xl'>
        <button
          onClick={logout}
          className={`flex flex-col items-center gap-1 p-3 transition-all duration-200 rounded-lg hover:bg-gray-700 ${
            activeTab === '#logout'
              ? 'bg-blue-500 text-white'
              : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <CiLogout className='text-2xl' />
          <span className='text-sm'>Salir</span>
        </button>

        <button
          onClick={() => setActiveTab('#tasks')}
          className={`flex flex-col items-center gap-1 p-3 transition-all duration-300 rounded-lg hover:bg-gray-700 ${
            activeTab === '#tasks'
              ? 'bg-blue-500 text-white'
              : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <FaList className='text-2xl' />
          <span className='text-sm'>Tareas</span>
        </button>

        {/* Botón para abrir el modal */}
        <button
          onClick={() => setIsModalOpen(true)}
          className='absolute bottom-24 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition'
        >
          <FaPlus className='text-2xl' />
        </button>

        <button
          onClick={() => {
            setActiveTab('#profile');
            setIsModalOpen2(true);
          }}
          className={`flex flex-col items-center gap-1 p-3 transition-all duration-200 rounded-lg hover:bg-gray-700 ${
            activeTab === '#profile'
              ? 'bg-blue-500 text-white'
              : 'bg-transparent text-gray-300 hover:text-white'
          }`}
        >
          <FaUser className='text-2xl' />
          <span className='text-sm'>Perfil</span>
        </button>
      </footer>

      {/* Modal para agregar o editar tarea */}
      {isModalOpen && (
        <div className='fixed inset-0 flex items-end justify-start p-6 bg-black bg-opacity-50 transition-all'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm'>
            <h3 className='text-xl font-bold text-gray-100 mb-4'>
              {editingTask ? 'Editar Tarea' : 'Agregar Nueva Tarea'}
            </h3>
            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Titulo{' '}
                {editingTask ? null : <span className='text-red-500'>*</span>}
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
                  ${
                    editingTask
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white'
                  }`}
              />
            </div>
            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Descripción{' '}
                {editingTask ? null : <span className='text-red-500'>*</span>}
              </label>
              <textarea
                value={newTask.description}
                disabled={editingTask}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                placeholder='Ingresa una descripción'
                className={`w-full p-2 border rounded-lg mb-4 
                  ${
                    editingTask
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white'
                  }`}
              />
            </div>

            <div>
              <label htmlFor='name' className='block text-gray-600 mb-2'>
                Estado{' '}
                {editingTask ? null : <span className='text-red-500'>*</span>}
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
                Prioridad{' '}
                {editingTask ? null : <span className='text-red-500'>*</span>}
              </label>
              <select
                value={newTask.priority_id}
                disabled={editingTask}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority_id: e.target.value })
                }
                className={`w-full p-2 border rounded-lg mb-4 
                  ${
                    editingTask
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 text-white'
                  }`}
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

      {/* Modal de Perfil */}
      {isModalOpen2 && (
      <div className='fixed inset-0 flex items-end justify-end bg-black bg-opacity-50 backdrop-blur-md'>
      <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center transform transition-all scale-100 animate-modal-in'>
        {/* Toolbar */}
        <div className='flex justify-end items-end mb-4'>
        
          <div className='flex justify-end  p-0 m-0'>
            <button
              onClick={() => setIsModalOpen2(false)}
              className='text-white text-2xl hover:text-gray-400 p-0 m-0'
            >
              &times;
            </button>
          </div>
        </div>
        
        {/* Título y contenido */}
        <div className='flex justify-center items-center mb-4'>
        <div className='w-20 h-20 rounded-full bg-blue-500 text-white text-3xl flex items-center justify-center'>
            {userData.name.charAt(0).toUpperCase()}
          </div>

        </div>
       
        <h2 className='text-lg text-white font-bold mb-4'>Perfil de Usuario</h2>
        <p className='text-white'><strong>Nombre:</strong> {userData.name}</p>
        <p className='text-white'><strong>Email:</strong> {userData.email}</p>
      </div>
    </div>
    
     
      )}

  
    </div>
  );
}
