// pages/Layout.jsx
import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: collapsed ? "80px" : "200px",
          background: "#1e293b",
          color: "white",
          padding: "10px",
          transition: "width 0.3s",
        }}
      >
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ marginBottom: "20px", background: "transparent", color: "white", border: "none" }}
        >
          {collapsed ? "👉" : "👈"}
        </button>

        <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
          <Link to="/buses" style={{ color: "white", textDecoration: "none" }}>Bus Management</Link>
          <Link to="/routes" style={{ color: "white", textDecoration: "none" }}>Route Management</Link>
          <Link to="/livefleet" style={{ color: "white", textDecoration: "none" }}>Live Fleet</Link>
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
