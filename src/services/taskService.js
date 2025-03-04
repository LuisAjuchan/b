import execute from "./apiClient";

export const getTasks = async () => {
  const data  = await execute("tasks",'GET');
  return data;
};

export const getTasksByUser = async (id) => {
  const data = await execute(`tasks/${id}`, 'GET');
  return data;
};

export const createTask = async (task) => {
  return await execute("tasks",'POST', task);
};

export const updateTask = async (id, task) => {
  return await execute(`tasks/${id}`,'PUT',task);
};

export const deleteTask = async (id) => {
  return await execute(`tasks/${id}`, 'DELETE');
};
