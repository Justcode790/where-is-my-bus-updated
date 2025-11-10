import React, { useEffect, useState } from "react";
import axios from "axios"; // changed API import to axios
import AddRoute from "../route/AddRoute";

const RouteManagement = () => {
  const [routes, setRoutes] = useState([]);

  // Fetch routes from backend on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pi/official/routes");
        setRoutes(res.data); // update state with fetched routes
      } catch (err) {
        console.error("Error fetching routes:", err);
      }
    };
    fetchRoutes();
  }, []);

  // Handle adding a new route
  const handleAddRoute = async (e) => {
    e.preventDefault();

    // Convert stops input to array of stop objects
    const stopsInput = e.target.stops.value.split(",").map((s, index) => ({
      stopName: s.trim(),
      latitude: 0, // placeholder, you can update with real values
      longitude: 0,
      stopOrder: index + 1
    }));

    const newRoute = {
      name: e.target.name.value,
      stops: stopsInput,
      distance: e.target.distance.value,
      estimatedTime: "N/A" // optional
    };

    try {
      const res = await axios.post("http://localhost:5000/pi/official/routes", newRoute);
      setRoutes([...routes, res.data]);
      e.target.reset();
    } catch (err) {
      console.error("Error adding route:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Route Table */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Manage Routes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Route Name</th>
                <th className="p-2">Stops</th>
                <th className="p-2">Distance (km)</th>
              </tr>
            </thead>
            <tbody>
              {routes.map(route => (
                <tr key={route._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-semibold">{route.name}</td>
                  {/* Display stop names */}
                  <td className="p-2">
                    {route.stops.map(stop => stop.stopName).join(", ")}
                  </td>
                  <td className="p-2">{route.distance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AddRoute Component */}
      <AddRoute handleAddRoute={handleAddRoute} />
    </div>
  );
};

export default RouteManagement;









// import React from "react";
// import { useOutletContext } from "react-router-dom";

// const RouteManagement = () => {
//   // Get state from Outlet context
//   const { routes, setRoutes } = useOutletContext();

//   const handleAddRoute = (e) => {
//     e.preventDefault();
//     const newRoute = {
//       id: `R${(Math.random() * 900 + 100).toFixed(0)}`,
//       name: e.target.name.value,
//       stops: parseInt(e.target.stops.value),
//       distance: e.target.distance.value
//     };
//     setRoutes([...routes, newRoute]);
//     e.target.reset();
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Manage Routes</h2>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b">
//                 <th className="p-2">Route Name</th>
//                 <th className="p-2">Stops</th>
//                 <th className="p-2">Distance</th>
//               </tr>
//             </thead>
//             <tbody>
//               {routes.map(route => (
//                 <tr key={route.id} className="border-b hover:bg-gray-50">
//                   <td className="p-2 font-semibold">{route.name}</td>
//                   <td className="p-2">{route.stops}</td>
//                   <td className="p-2">{route.distance}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-bold mb-4">Add New Route</h2>
//         <form onSubmit={handleAddRoute}>
//           <div className="mb-4">
//             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Route Name</label>
//             <input type="text" id="name" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., Majestic to ITPL" />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="stops" className="block text-sm font-medium text-gray-700 mb-1">Number of Stops</label>
//             <input type="number" id="stops" name="stops" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 20" />
//           </div>
//           <div className="mb-4">
//             <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
//             <input type="text" id="distance" name="distance" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 22 km" />
//           </div>
//           <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Add Route</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RouteManagement;
