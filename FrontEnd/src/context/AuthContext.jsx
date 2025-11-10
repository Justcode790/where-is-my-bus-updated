import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, logoutUser, getCurrentUser } from "../api/authService";
import { superAdminLogin } from "../api/superAdminService";
import { adminLogin } from "../api/adminService";
import { driverLogin } from "../api/driverService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // wait until /me finishes

  // Load user from backend on refresh
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (err) {
        setUser(null); // no valid session
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 🔹 Login - Routes to appropriate endpoint based on role
  const login = async (formData) => {
    const { role, email, password } = formData;
    let data;

    // Route to appropriate login endpoint based on role
    if (role === "superadmin") {
      data = await superAdminLogin({ email, password });
    } else if (role === "admin") {
      data = await adminLogin({ email, password });
    } else if (role === "driver") {
      data = await driverLogin({ email, password });
    } else {
      // Default to user/login for other roles (official, etc.)
      data = await loginUser(formData);
    }

    if (data.user) {
      setUser(data.user);
      // Store token if provided
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
    }
    return data;
  };

  // 🔹 Register
  const register = async (formData) => {
    const data = await registerUser(formData);
    if (data.user) {
      setUser(data.user);
    }
    return data;
  };

  // 🔹 Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
