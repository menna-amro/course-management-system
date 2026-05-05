import api from "./api";

const getAll = async () => {
  const response = await api.get("/course");
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/course/${id}`);
  return response.data;
};

const createCourse = async (course) => {
  const response = await api.post("/course", course);
  return response.data;
};

const updateCourse = async (id, course) => {
  const response = await api.put(`/course/${id}`, course);
  return response.data;
};

const deleteCourse = async (id) => {
  const response = await api.delete(`/course/${id}`);
  return response.data;
};

export default {
  getAll,
  getById,
  createCourse,
  updateCourse,
  deleteCourse
};
