import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Admin register
export const adminRegister = async (formData) => {
  const { data } = await API.post("/admin/register", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

// Admin login
export const adminLogin = async (formData) => {
  const { data } = await API.post("/admin/login", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

// Add bus
export const addBus = async (busData) => {
  const { data } = await API.post("/admin/add-bus", busData);
  return data;
};

// Get buses
export const getBuses = async () => {
  const { data } = await API.get("/admin/buses");
  return data;
};

// Add route
export const addRoute = async (routeData) => {
  const { data } = await API.post("/admin/add-route", routeData);
  return data;
};

// Get routes
export const getRoutes = async () => {
  const { data } = await API.get("/admin/routes");
  return data;
};

// Assign driver
export const assignDriver = async (assignmentData) => {
  const { data } = await API.post("/admin/assign-driver", assignmentData);
  return data;
};

// Get drivers
export const getDrivers = async () => {
  const { data } = await API.get("/admin/drivers");
  return data;
};

// Get live bus location
export const getLiveBusLocation = async (busId) => {
  const { data } = await API.get(`/admin/live/${busId}`);
  return data;
};

