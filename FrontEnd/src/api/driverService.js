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

// Driver login
export const driverLogin = async (formData) => {
  const { data } = await API.post("/driver/login", formData);
  if (data.token) {
    localStorage.setItem("token", data.token);
  }
  return data;
};

// Get assigned bus
export const getAssignedBus = async () => {
  const { data } = await API.get("/driver/assigned-bus");
  return data;
};

// Start trip
export const startTrip = async (locationData) => {
  const { data } = await API.post("/driver/start-trip", locationData);
  return data;
};

// Stop trip
export const stopTrip = async () => {
  const { data } = await API.post("/driver/stop-trip");
  return data;
};

// Update location
export const updateLocation = async (locationData) => {
  const { data } = await API.post("/driver/update-location", locationData);
  return data;
};

