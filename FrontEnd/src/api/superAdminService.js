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

// Super Admin register
export const superAdminRegister = async (formData) => {
  const { data } = await API.post("/superadmin/register", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

// Super Admin login
export const superAdminLogin = async (formData) => {
  const { data } = await API.post("/superadmin/login", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

// Get all admins
export const getAllAdmins = async () => {
  const { data } = await API.get("/superadmin/admins");
  return data;
};

// Get admin details
export const getAdminDetails = async (adminId) => {
  const { data } = await API.get(`/superadmin/admin/${adminId}`);
  return data;
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  const { data } = await API.delete(`/superadmin/admin/${adminId}`);
  return data;
};

// Get all buses
export const getAllBuses = async () => {
  const { data } = await API.get("/superadmin/buses");
  return data;
};

