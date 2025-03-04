
const API_BASE_URL = process.env.API_URL; // Asegúrate de definir esta variable en tu .env

const getToken = () => localStorage.getItem("token");

export const execute = async (endpoint, method = "GET", body = null, customHeaders = {}) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...customHeaders,
    };

    const config = {
      method,
      headers,
      ...(body ? { body: JSON.stringify(body) } : {}),
    };
     
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error en la solicitud ${method}`);
    }


    const result=  await response.json();
    return result;
  } catch (error) {
    console.error(`Error en ${method}:`, error);
    throw error;
  }
};

export default execute;





