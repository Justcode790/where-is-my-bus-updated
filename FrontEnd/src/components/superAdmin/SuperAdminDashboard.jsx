import React, { useState, useEffect } from "react";
import socket from "../../socket";
import { getAllAdmins, getAdminDetails, deleteAdmin, getAllBuses } from "../../api/superAdminService";

const SuperAdminDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("admins");

  useEffect(() => {
    fetchAdmins();
    fetchBuses();

    // Listen for real-time bus location updates
    socket.on("busLocationUpdate", (data) => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus._id === data.busId
            ? {
                ...bus,
                currentLocation: data.location,
                status: data.status,
                tripStatus: data.tripStatus,
              }
            : bus
        )
      );
    });

    // Listen for bus started notifications
    socket.on("busStartedNotification", (data) => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus._id === data.busId
            ? {
                ...bus,
                status: "ongoing",
                tripStatus: "in-progress",
                currentLocation: data.location,
              }
            : bus
        )
      );
    });

    // Listen for bus stopped notifications
    socket.on("busStoppedNotification", (data) => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) =>
          bus._id === data.busId
            ? {
                ...bus,
                status: "offline",
                tripStatus: "completed",
              }
            : bus
        )
      );
    });

    return () => {
      socket.off("busLocationUpdate");
      socket.off("busStartedNotification");
      socket.off("busStoppedNotification");
    };
  }, []);

  const fetchAdmins = async () => {
    try {
      const data = await getAllAdmins();
      setAdmins(data.admins);
    } catch (err) {
      console.error("Error fetching admins:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuses = async () => {
    try {
      const data = await getAllBuses();
      setBuses(data.buses);
    } catch (err) {
      console.error("Error fetching buses:", err);
    }
  };

  const handleViewAdmin = async (adminId) => {
    try {
      const data = await getAdminDetails(adminId);
      setSelectedAdmin(data);
    } catch (err) {
      console.error("Error fetching admin details:", err);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) {
      return;
    }

    try {
      await deleteAdmin(adminId);
      setAdmins(admins.filter((admin) => admin._id !== adminId));
      alert("Admin deleted successfully");
    } catch (err) {
      console.error("Error deleting admin:", err);
      alert("Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 py-2 rounded ${
              activeTab === "admins"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            Admins ({admins.length})
          </button>
          <button
            onClick={() => setActiveTab("buses")}
            className={`px-4 py-2 rounded ${
              activeTab === "buses"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            All Buses ({buses.length})
          </button>
        </div>

        {/* Admins Tab */}
        {activeTab === "admins" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">All Bus Organizations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Organization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Admin Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.organizationName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{admin.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{admin.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            admin.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {admin.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleViewAdmin(admin._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Buses Tab */}
        {activeTab === "buses" && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">All Buses (Real-time)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {buses.map((bus) => (
                <div
                  key={bus._id}
                  className="border rounded-lg p-4 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{bus.busNumber}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        bus.status === "ongoing"
                          ? "bg-green-100 text-green-800"
                          : bus.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {bus.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Organization: {bus.adminId?.organizationName || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Route: {bus.route?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Driver: {bus.driver?.name || "Not assigned"}
                  </p>
                  {bus.currentLocation && (
                    <p className="text-xs text-gray-500 mt-2">
                      Location: {bus.currentLocation.lat.toFixed(4)},{" "}
                      {bus.currentLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Admin Details Modal */}
        {selectedAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {selectedAdmin.admin.organizationName}
                </h2>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold">Buses ({selectedAdmin.buses.length})</h3>
                  <div className="mt-2 space-y-2">
                    {selectedAdmin.buses.map((bus) => (
                      <div key={bus._id} className="border p-2 rounded">
                        <p className="font-semibold">{bus.busNumber}</p>
                        <p className="text-sm text-gray-600">
                          Route: {bus.route?.name || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {bus.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold">Routes ({selectedAdmin.routes.length})</h3>
                  <div className="mt-2 space-y-2">
                    {selectedAdmin.routes.map((route) => (
                      <div key={route._id} className="border p-2 rounded">
                        <p className="font-semibold">{route.name}</p>
                        <p className="text-sm text-gray-600">
                          Stops: {route.numberOfStops}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold">Drivers ({selectedAdmin.drivers.length})</h3>
                  <div className="mt-2 space-y-2">
                    {selectedAdmin.drivers.map((driver) => (
                      <div key={driver._id} className="border p-2 rounded">
                        <p className="font-semibold">{driver.name}</p>
                        <p className="text-sm text-gray-600">
                          License: {driver.licenseNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

