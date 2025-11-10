// services/authService.js
import API from "./axios";

// Register user
export const registerUser = async (formData) => {
  const { data } = await API.post("/pi/register", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data; // { user, token }
};

// Login user (for official role)
export const loginUser = async (formData) => {
  const { data } = await API.post("/pi/login", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data; // { user, token }
};

// Get current user (works for all roles)
export const getCurrentUser = async () => {
  const { data } = await API.get("/pi/me");
  return data; // { user }
};

// Logout
export const logoutUser = async () => {
  try {
    await API.post("/pi/logout");
  } catch (err) {
    console.error("Logout error:", err);
  }
  localStorage.removeItem("token");
  return { message: "Logged out successfully" };
};
