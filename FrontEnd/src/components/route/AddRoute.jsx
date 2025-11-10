import React, { useState, useEffect } from "react";
import API from "axios";

const AddRoute = () => {
  const [routes, setRoutes] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    stops: "",
    distance: "",
    estimatedTime: ""
  });

  // Fetch all routes on mount
//   useEffect(() => {
//     const fetchRoutes = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/pi/official/routes");
//         setRoutes(res.data);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchRoutes();
//   }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      const stopsArray = formData.stops.split(",").map((s) => s.trim());

      const res = await API.post("http://localhost:5000/pi/official/routes", {
        name: formData.name,
        stops: stopsArray,
        distance: formData.distance,
        estimatedTime: formData.estimatedTime
      });

      setRoutes([...routes, res.data]);
      setFormData({ name: "", stops: "", distance: "", estimatedTime: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Add New Route</h2>
        <form onSubmit={handleAddRoute}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Route Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Majestic to ITPL"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="stops" className="block text-sm font-medium text-gray-700 mb-1">
              Stops (comma separated)
            </label>
            <input
              type="text"
              id="stops"
              name="stops"
              value={formData.stops}
              onChange={handleChange}
              placeholder="e.g., Majestic, MG Road, KR Puram, ITPL"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
              Distance (km)
            </label>
            <input
              type="number"
              id="distance"
              name="distance"
              value={formData.distance}
              onChange={handleChange}
              placeholder="e.g., 22"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Time
            </label>
            <input
              type="text"
              id="estimatedTime"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              placeholder="e.g., 1h 15m"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Add Route
          </button>
        </form>
      </div>
  );
};

export default AddRoute;
