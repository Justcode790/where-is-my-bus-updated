import React, { useState, useEffect } from "react";
import { getRoutes, getDrivers } from "../../api/adminService";

function AddnewBus({ onAddBus }) {
  const [formData, setFormData] = useState({
    busNumber: "",
    capacity: "",
    route: "",
    driver: "",
    scheduledDepartureTime: "",
  });

  const [routes, setRoutes] = useState([]);
  const [drivers, setDrivers] = useState([]);

  // Fetch routes and drivers for dropdown
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch routes using admin service
        const routeData = await getRoutes();
        setRoutes(routeData.routes || []);

        // Fetch drivers using admin service
        const driverData = await getDrivers();
        setDrivers(driverData.drivers || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddBus(formData); // send data to parent
    setFormData({ busNumber: "", capacity: "", route: "", driver: "" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add New Bus</h2>
      <form onSubmit={handleSubmit}>
        {/* Bus Number */}
        <div className="mb-4">
          <label
            htmlFor="busNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Bus Number
          </label>
          <input
            type="text"
            id="busNumber"
            name="busNumber"
            value={formData.busNumber}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., KA-01-F-9999"
          />
        </div>

        {/* Capacity */}
        <div className="mb-4">
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Capacity
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 50"
          />
        </div>

        {/* Route Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="route"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Route
          </label>
          <select
            id="route"
            name="route"
            value={formData.route}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Route</option>
            {routes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Driver Dropdown */}
        <div className="mb-4">
          <label
            htmlFor="driver"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Driver
          </label>
          <select
            id="driver"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md 
                     hover:bg-blue-700 transition"
        >
          Add Bus
        </button>
      </form>
    </div>
  );
}

export default AddnewBus;
