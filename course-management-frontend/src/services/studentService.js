import api from "./api";

const getAll = async () => {
  const response = await api.get("/student");
  return response.data;
};

const getMyProfile = async () => {
  const response = await api.get("/student/me");
  return response.data;
};

const createProfile = async (profileData) => {
  const response = await api.post("/student/me", profileData);
  return response.data;
};


const updateProfile = async (profileData) => {
  const response = await api.put("/student/me", profileData);
  return response.data;
};

const getCourses = async (studentId) => {
  const response = await api.get(`/student/courses/${studentId}`);
  return response.data;
};

const deleteStudent = async (id) => {
  const response = await api.delete(`/student/${id}`);
  return response.data;
};

export default {
  getAll,
  getMyProfile,
  createProfile,
  updateProfile, 
  getCourses,
  deleteStudent
};