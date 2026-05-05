import api from "./api";

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

const register = async (formData) => {
  const response = await api.post("/auth/register", formData);
  return response.data;
};

const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export default {
  login,
  register,
  logout
};
