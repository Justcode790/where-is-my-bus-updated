// src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./context/ProtectedRoute";

// Pages & Components
import Home from "./pages/Home";
import LoginPage from "./auth/LoginPage";
import SignUpPage from "./auth/SignUpPage";
import AgencyPage from "./pages/AgencyPage";  // layout with sidebar + <Outlet />
import DriverPage from "./pages/DriverPage";
import UserSide from "./components/userSide/UserSide";
import Dashboard from "./components/agencyAllroute/Dashboard"; // example default page
import BusManagement from "./components/agencyAllroute/BusManagement";
import RouteManagement from "./components/agencyAllroute/RouteManagement";
import AnnouncementsPage from "./components/agencyAllroute/AnnouncementsPage";
import TrafficControl from "./components/trafficControls/TrafficControl";
import SuperAdminDashboard from "./components/superAdmin/SuperAdminDashboard";

export default function App() {
  return (
    <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* Protected routes */}
          <Route
            path="/user"
            element={
              // <ProtectedRoute>
                <UserSide />
              // </ProtectedRoute>
            }
          />

          <Route path="/official" element={<ProtectedRoute role="official"><AgencyPage /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />       
            <Route path="dashboard" element={<Dashboard />}/>
            <Route path="buses" element={<BusManagement />} /> 
            <Route path="routes" element={<RouteManagement/>} />
            <Route path="announcements" element={<AnnouncementsPage/>} /> 
          </Route>

          {/* Driver */}
          <Route path="/driver" element={
              <ProtectedRoute role="driver">
                <DriverPage />
              </ProtectedRoute>
            }
            />

          {/* Traffic management */}
          <Route path="/traffic" element={<TrafficControl/>}/>

          {/* Super Admin */}
          <Route 
            path="/superadmin" 
            element={
              <ProtectedRoute role="superadmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
    </Routes>
  );
}




// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [buses, setBuses] = useState(initialBuses);
//   const [routes, setRoutes] = useState(initialRoutes);
//   const [announcements, setAnnouncements] = useState([]);

//   // Simulate real-time bus movement
//   useEffect(() => {
//     if (isLoggedIn) {
//       const interval = setInterval(() => {
//         setBuses(currentBuses =>
//           currentBuses.map(bus => {
//             const latChange = (Math.random() - 0.5) * 0.001;
//             const lngChange = (Math.random() - 0.5) * 0.001;
//             const newSpeed = Math.max(
//               15,
//               Math.min(60, bus.speed + (Math.random() - 0.5) * 5)
//             );
//             const newPassengers = Math.max(
//               5,
//               Math.min(
//                 50,
//                 bus.passengers + Math.floor((Math.random() - 0.5) * 3)
//               )
//             );

//             return {
//               ...bus,
//               lat: bus.lat + latChange,
//               lng: bus.lng + lngChange,
//               speed: Math.round(newSpeed),
//               passengers: newPassengers,
//             };
//           })
//         );
//       }, 2000);

//       return () => clearInterval(interval);
//     }
//   }, [isLoggedIn]);

//   return (
//     <Routes>
//       {/* Landing page */}
//       <Route path="/" element={<Vahan />} />

//       {/* Login route */}
//       <Route
//         path="/login"
//         element={
//           isLoggedIn ? (
//             <Navigate to="/agency" replace />
//           ) : (
//             <LoginPage onLogin={() => setIsLoggedIn(true)} />
//           )
//         }
//       />

//       {/* Agency dashboard (protected) */}
//       <Route
//         path="/agency"
//         element={
//           isLoggedIn ? (
//             <Dashboard
//               buses={buses}
//               setBuses={setBuses}
//               routes={routes}
//               setRoutes={setRoutes}
//               announcements={announcements}
//               setAnnouncements={setAnnouncements}
//               // xonLogout={() => setIsLoggedIn(false)}
//             />
//           ) : (
//             <Navigate to="/login" replace />
//           )
//         }
//       />

//       {/* User side (open) */}
//       <Route path="/user" element={<UserSide />} />
//       <Route path="/signup" element={<SignUpPage/>} />

//       {/* Catch-all redirect */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


// import React, { useState, useEffect,} from 'react';
// import LoginPage from './components/LoginPage'
// import Dashboard from './components/Dashboard'
// import UserSide from './components/UserSide';
// import { Routes,Route } from 'react-router-dom';
// import { initialBuses,initialRoutes } from './data/mockData';
// import Vahan from './components/Vahan';

// export default function App() {

  
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const [buses, setBuses] = useState(initialBuses);
//     const [routes, setRoutes] = useState(initialRoutes);
//     const [announcements, setAnnouncements] = useState([]);

//     // Simulate real-time bus movement
//     useEffect(() => {
//         if (isLoggedIn) {
//             const interval = setInterval(() => {
//                 setBuses(currentBuses => 
//                     currentBuses.map(bus => {
//                         const latChange = (Math.random() - 0.5) * 0.001;
//                         const lngChange = (Math.random() - 0.5) * 0.001;
//                         const newSpeed = Math.max(15, Math.min(60, bus.speed + (Math.random() - 0.5) * 5));
//                         const newPassengers = Math.max(5, Math.min(50, bus.passengers + Math.floor((Math.random() - 0.5) * 3)));
                        
//                         return {
//                             ...bus,
//                             lat: bus.lat + latChange,
//                             lng: bus.lng + lngChange,
//                             speed: Math.round(newSpeed),
//                             passengers: newPassengers
//                         };
//                     })
//                 );
//             }, 2000); // Update every 2 seconds

//             return () => clearInterval(interval);
//         }
//     }, [isLoggedIn]);

//     if (!isLoggedIn) {
//         // return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
//         return <Vahan/>
//     }

//     return <>
    
   
//     <Dashboard 
//         buses={buses} 
//         setBuses={setBuses}
//         routes={routes}
//         setRoutes={setRoutes}
//         announcements={announcements}
//         setAnnouncements={setAnnouncements}
//         onLogout={() => setIsLoggedIn(false)} 
//     />;
//     </>
// }




