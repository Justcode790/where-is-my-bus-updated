import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

// Search routes between two stops
export const searchRoutes = async (from, to) => {
  const { data } = await API.get("/pi/routes", {
    params: { from, to },
  });
  return data;
};

// Get buses for a route
export const getBusesByRoute = async (routeId) => {
  const { data } = await API.get(`/pi/bus/${routeId}`);
  return data;
};

// Calculate ETA
export const calculateETA = async (busId, stopName) => {
  const { data } = await API.get("/pi/eta", {
    params: { busId, stopName },
  });
  return data;
};

