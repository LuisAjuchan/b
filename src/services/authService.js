import {execute} from "./apiClient";

export const login = async (email, password) => {
  const data  = await execute("auth/login",'POST',{ email, password });
 
  return data.token;
};

export const register = async (userData) => {
  return await execute("auth/register",'POST', userData);
};