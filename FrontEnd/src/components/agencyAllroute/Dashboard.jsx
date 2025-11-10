import React from "react";
import { useOutletContext } from "react-router-dom";
import LiveFleetMap from "./LiveFleetMap";
import Bus from "../icons/Bus";
import RouteIcon from "../icons/RouteIcon";
import Gauge from "../icons/Gauge";
import Users from "../icons/Users";

const Dashboard = () => {
  // Access data from Outlet context
  const { buses, routes } = useOutletContext();
  console.log(buses);

  const onTimeCount = buses.filter((b) => b.status === "On Time").length;
  const delayedCount = buses.filter((b) => b.status === "Delayed").length;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg shadow flex items-center">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Bus className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Buses</p>
            <p className="text-2xl font-bold">{buses.length}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <Bus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">On Time</p>
            <p className="text-2xl font-bold">{onTimeCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <Bus className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Delayed</p>
            <p className="text-2xl font-bold">{delayedCount}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <RouteIcon />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Routes</p>
            <p className="text-2xl font-bold">{routes.length}</p>
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow h-[60vh]">
          <h2 className="text-xl font-bold mb-4">Live Fleet Status</h2>
          <LiveFleetMap buses={buses} />
        </div>
      

      {/* Bus Details */}
            <div className="bg-white p-6 rounded-lg shadow h-[60vh] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-4">Bus Details</h2>
                    <ul className="space-y-4">
                        {buses.map(bus => (
                            <li key={bus._id} className="border-b pb-2">
                                <p className="font-bold">{bus.busNumber} <span className="font-normal text-gray-600">- {bus.route.name}</span></p>
                                <div className="flex justify-between text-sm text-gray-500 mt-1">
                                    <span className="flex items-center"><Gauge /> {bus.speed} km/h</span>
                                    <span className="flex items-center"><Users /> {bus.passengers}</span>
                                    <span className={`font-semibold ${bus.status === 'Delayed' ? 'text-red-500' : 'text-green-500'}`}>{bus.status}</span>

                                </div>
                            </li>
                        ))}
                    </ul>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
