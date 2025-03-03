import apiClient from "./apiClient";

export const getTasks = async () => {
  const { data } = await apiClient.get("/tasks");
  return data;
};

export const createTask = async (task) => {
  return await apiClient.post("/tasks", task);
};

export const updateTask = async (id, task) => {
  return await apiClient.put(`/tasks/${id}`, task);
};

export const deleteTask = async (id) => {
  return await apiClient.delete(`/tasks/${id}`);
};
