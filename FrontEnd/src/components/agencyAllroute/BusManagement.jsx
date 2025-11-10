import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import AddnewBus from "../bus/AddnewBus";
import API from "axios";

const BusManagement = () => {
  const { buses, setBuses } = useOutletContext();

  // Fetch buses when page loads
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await API.get("http://localhost:5000/pi/official/buses");
        console.log("it came "+res);
        setBuses(res.data);
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    };
    fetchBuses();
  }, [setBuses]);

  // Add new bus (called from AddnewBus child)
  const handleAddBus = async (formData) => {
    try {
      const res = await API.post("http://localhost:5000/pi/official/buses", formData);
      setBuses((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Error adding bus:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bus Table */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Manage Buses</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-2">Bus Number</th>
                <th className="p-2">Route</th>
                <th className="p-2">Driver</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-mono">{bus.busNumber}</td>
                  <td className="p-2">{bus.route?.name || "N/A"}</td>
                  <td className="p-2">{bus.driver?.name || "N/A"}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        bus.status === "on-time"
                          ? "bg-green-100 text-green-800"
                          : bus.status === "delayed"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </td>
                </tr>
              ))}
              {buses.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No buses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bus Form */}
      <AddnewBus onAddBus={handleAddBus} />
    </div>
  );
};

export default BusManagement;
