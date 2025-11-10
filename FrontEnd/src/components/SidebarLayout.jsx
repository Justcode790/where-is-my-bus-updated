import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Bus from "../components/icons/Bus";
import RouteIcon from "../components/icons/RouteIcon";
import Megaphone from "../components/icons/Megaphone";
import MapPin from "../components/icons/MapPin";
import { useAuth } from "../context/AuthContext";

const SidebarLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Determine active tab dynamically
  const activeTab = location.pathname.split("/")[2]; // gets "dashboard", "buses", etc.

  const NavLink = ({ to, icon, label }) => {
    const tabName = to.split("/")[2]; 
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => navigate(to)}
        className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${
          isActive ? "bg-blue-600 text-white" : "hover:bg-gray-700"
        }`}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold">Agency Portal</h1>
          <p className="text-sm text-gray-400">Bus Tracking System</p>
        </div>

        {/* <nav className="flex-1 p-4 space-y-2">
          <NavLink to="/official/dashboard" icon={<MapPin />} label="Dashboard" />
          <NavLink to="/official/buses" icon={<Bus className="w-5 h-5" />} label="Manage Buses" />
          <NavLink to="/official/routes" icon={<RouteIcon />} label="Manage Routes" />
          <NavLink to="/official/announcements" icon={<Megaphone />} label="Announcements" />
        </nav> */}

        <nav className="flex-1 p-4 space-y-2">
            <button
                onClick={() => navigate("/official/dashboard")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${
                location.pathname === "/official/dashboard" ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`}
            >
                <MapPin />
                <span className="ml-2">Dashboard</span>
            </button>

            <button
                onClick={() => navigate("/official/buses")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${
                location.pathname === "/official/buses" ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`}
            >
                <Bus className="w-5 h-5" />
                <span className="ml-2">Manage Buses</span>
            </button>

            <button
                onClick={() => navigate("/official/routes")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${
                location.pathname === "/official/routes" ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`}
            >
                <RouteIcon />
                <span className="ml-2">Manage Routes</span>
            </button>

            <button
                onClick={() => navigate("/official/announcements")}
                className={`flex items-center w-full text-left px-4 py-3 rounded-lg transition ${
                location.pathname === "/official/announcements" ? "bg-blue-600 text-white" : "hover:bg-gray-700"
                }`}
            >
                <Megaphone />
                <span className="ml-2">Announcements</span>
            </button>
            </nav>


        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default SidebarLayout;
