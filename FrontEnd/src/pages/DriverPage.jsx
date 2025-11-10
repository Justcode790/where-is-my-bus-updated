import React from "react";
import DriverPanel from "../components/driver/DriverPanel";
import { useAuth } from "../context/AuthContext";

function DriverPage() {
  const { logout } = useAuth();

  // DriverPanel component already fetches the assigned bus internally
  // No need to fetch here - it will handle its own data fetching



  return (
    <div className="relative">
      {/* Logout Button - Fixed position */}
      <button
        onClick={logout}
        className="fixed top-4 right-4 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition duration-300 z-50"
      >
        Logout
      </button>

      {/* Driver Panel - Handles its own data fetching */}
      <DriverPanel />
    </div>
  );
}

export default DriverPage;
