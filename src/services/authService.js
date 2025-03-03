import apiClient from "./apiClient";

export const login = async (email, password) => {
  const { data } = await apiClient.post("auth/login", { email, password });
  return data.token;
};

export const register = async (userData) => {
  return await apiClient.post("auth/register", userData);
};