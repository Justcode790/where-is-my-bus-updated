import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SidebarLayout from "../components/SidebarLayout";
import API from "../api/axios"; // your axios instance

function AgencyPage() {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [busesRes, routesRes, announcementsRes] = await Promise.all([
          API.get("/official/buses"),          // your backend endpoint for buses
          API.get("/official/routes"),         // backend endpoint for routes
          // API.get("/agency/announcements"),  // backend endpoint for announcements
        ]);

        setBuses(busesRes.data);
        setRoutes(routesRes.data);
        // setAnnouncements(announcementsRes.data);
      } catch (err) {
        console.error("Error fetching agency data:", err);
        setError("Failed to load data. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;

  return (
    <SidebarLayout>
      <Outlet context={{ buses, setBuses, routes, setRoutes, announcements, setAnnouncements }} />
    </SidebarLayout>
  );
}

export default AgencyPage;



// import React, { useState } from "react";
// import { Outlet } from "react-router-dom";
// import SidebarLayout from "../components/SidebarLayout";

// function AgencyPage() {
//   const [buses, setBuses] = useState([]);
//   const [routes, setRoutes] = useState([]);
//   const [announcements, setAnnouncements] = useState([]);
  
//   // Dummy buses
//   // const [buses, setBuses] = useState([
//   //   { id: 1, registration: "UP14AB1234", routeId: "R1", speed: 60, passengers: 35, status: "On Time" },
//   //   { id: 2, registration: "DL5C7890", routeId: "R2", speed: 40, passengers: 20, status: "Delayed" },
//   //   { id: 3, registration: "HR26CD4567", routeId: "R3", speed: 50, passengers: 28, status: "On Time" }
//   // ]);

//   // // Dummy routes
//   // const [routes, setRoutes] = useState([
//   //   { id: "R1", name: "Route 1", start: "Delhi", end: "Noida" },
//   //   { id: "R2", name: "Route 2", start: "Noida", end: "Ghaziabad" },
//   //   { id: "R3", name: "Route 3", start: "Gurgaon", end: "Faridabad" }
//   // ]);

//   // // Dummy announcements
//   // const [announcements, setAnnouncements] = useState([
//   //   { id: 1, message: "All buses will be sanitized daily.", date: "2025-09-12" },
//   //   { id: 2, message: "Route 2 timing has been changed.", date: "2025-09-11" }
//   // ]);

//   return (
//     <SidebarLayout>
//       {/* Pass state via Outlet context */}
//       <Outlet context={{ buses, setBuses, routes, setRoutes, announcements, setAnnouncements }} />
//     </SidebarLayout>

//   );
// }

// export default AgencyPage;
