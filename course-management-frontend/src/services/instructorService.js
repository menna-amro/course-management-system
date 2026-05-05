import api from "./api";

const getAll = async () => {
  const response = await api.get("/instructor");
  return response.data;
};

const getMyProfile = async () => {
  const response = await api.get("/instructor/me");
  return response.data;
};

const createProfile = async (profileData) => {
  const response = await api.post("/instructor/me", profileData);
  return response.data;
};


const updateProfile = async (profileData) => {
  const response = await api.put("/instructor/me", profileData);
  return response.data;
};

const getCourses = async (instructorId) => {
  const response = await api.get(`/instructor/courses/${instructorId}`);
  return response.data;
};

const deleteInstructor = async (id) => {
  const response = await api.delete(`/instructor/${id}`);
  return response.data;
};

export default {
  getAll,
  getMyProfile,
  createProfile,
  updateProfile, 
  getCourses,
  deleteInstructor
};