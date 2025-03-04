import {execute} from "./apiClient";

export const login = async (email, password) => {
  const data  = await execute("auth/login",'POST',{ email, password });
 
  return {token:data.token,user :data.user};
};

export const register = async (userData) => {
  return await execute("auth/register",'POST', userData);
};