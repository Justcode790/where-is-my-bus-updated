import React, { useState, useRef, useEffect } from "react";
import socket from "../../socket";
import { getAssignedBus, startTrip, stopTrip } from "../../api/driverService";

const DriverPanel = () => {
  const [assignedBus, setAssignedBus] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [tripStatus, setTripStatus] = useState("not-started");
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch assigned bus on mount
    const fetchAssignedBus = async () => {
      try {
        const data = await getAssignedBus();
        setAssignedBus(data.bus);
        setTripStatus(data.bus?.tripStatus || "not-started");
      } catch (err) {
        console.error("Error fetching assigned bus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedBus();

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const sendLocation = () => {
    if (!navigator.geolocation || !assignedBus) {
      console.error("Geolocation not supported or no bus assigned");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const speed = pos.coords.speed ? pos.coords.speed * 3.6 : 0; // Convert m/s to km/h

        // Emit location update via Socket.IO
        socket.emit("driverLocationUpdate", {
          busId: assignedBus._id,
          lat: latitude,
          lng: longitude,
          speed: speed,
        });

        console.log(`📍 Location sent: ${latitude}, ${longitude}`);
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );
  };

  const handleStartTrip = async () => {
    if (!assignedBus) {
      alert("No bus assigned");
      return;
    }

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          // Start trip via API
          await startTrip({ lat: latitude, lng: longitude });

          // Emit Socket.IO event
          socket.emit("busStarted", {
            busId: assignedBus._id,
            lat: latitude,
            lng: longitude,
          });

          // Start sending location updates
          sendLocation();
          const id = setInterval(sendLocation, 5000); // Every 5 seconds
          intervalRef.current = id;
          setIsTracking(true);
          setTripStatus("in-progress");
        } catch (err) {
          console.error("Error starting trip:", err);
          alert("Failed to start trip");
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Failed to get location");
      }
    );
  };

  const handleStopTrip = async () => {
    if (!assignedBus) return;

    try {
      await stopTrip();

      // Emit Socket.IO event
      socket.emit("busStopped", {
        busId: assignedBus._id,
      });

      // Stop location updates
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsTracking(false);
      setTripStatus("completed");
    } catch (err) {
      console.error("Error stopping trip:", err);
      alert("Failed to stop trip");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!assignedBus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/90 shadow-md rounded-lg p-6 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Driver Panel</h1>
          <p className="text-gray-600">No bus assigned. Please contact your administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen flex items-center justify-center font-sans bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('./Screenshot_2025-09-10_195914-removebg-preview(1).png')",
      }}
    >
      <div className="relative z-20 bg-white/90 shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Driver Panel</h1>

        <div className="mb-4 text-left">
          <p className="font-semibold">Bus Number: {assignedBus.busNumber}</p>
          <p className="text-sm text-gray-600">Route: {assignedBus.route?.name || "N/A"}</p>
          <p className="text-sm text-gray-600">
            Status: <span className="font-semibold">{tripStatus}</span>
          </p>
        </div>

        {tripStatus === "not-started" || tripStatus === "completed" ? (
          <button
            onClick={handleStartTrip}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mb-2"
          >
            Start Trip
          </button>
        ) : (
          <button
            onClick={handleStopTrip}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full mb-2"
          >
            Stop Trip
          </button>
        )}

        {isTracking && (
          <div className="mt-4">
            <p className="text-green-600 font-semibold">
              ✅ Trip in progress - Live location is being shared
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Location updates every 5 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPanel;



// import React, { useState, useRef, useContext } from "react";
// import { LocationContext } from "./LocationProvider";

// const DriverPanel = () => {
//   const [busId, setBusId] = useState("");
//   const [isTracking, setIsTracking] = useState(false);
//   const [capturedPhoto, setCapturedPhoto] = useState(null);
//   const intervalRef = useRef(null);
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   const { setLocation } = useContext(LocationContext);

//   // Start webcam
//   const startCamera = async () => {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//       } catch (err) {
//         console.error("Error accessing webcam:", err);
//       }
//     }
//   };

//   // Capture photo
//   const capturePhoto = () => {
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     if (video && canvas) {
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//       const dataUrl = canvas.toDataURL("image/png");
//       setCapturedPhoto(dataUrl);
//       return dataUrl;
//     }
//     return null;
//   };

//   const sendLocation = () => {
//     if (!navigator.geolocation) {
//       console.error("Geolocation not supported");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         console.log(`Sending location: ${latitude}, ${longitude}`);

//         // Capture a photo each time we send location (for demo)
//         const photoData = capturePhoto();

//         try {
//           const res = await fetch("http://localhost:4000/api/update-location", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               busId,
//               latitude,
//               longitude,
//               timestamp: new Date().toISOString(),
//               photo: photoData, // send photo data
//             }),
//           });
//           console.log("✅ Location (and photo) sent successfully");
//           const response = await res.json();
//           setLocation(response);
//           localStorage.setItem("busLocation", JSON.stringify(response));
//           console.log(response);
//         } catch (err) {
//           console.error("Error sending location:", err);
//         }
//       },
//       (err) => console.error("Geolocation error:", err),
//       { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
//     );
//   };

//   const startTracking = () => {
//     if (!busId) {
//       alert("Please enter Bus ID (e.g. R101-B)");
//       return;
//     }
//     startCamera(); // start camera
//     sendLocation();
//     const id = setInterval(sendLocation, 2000);
//     intervalRef.current = id;
//     setIsTracking(true);
//   };

//   const stopTracking = () => {
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//       intervalRef.current = null;
//     }
//     // Stop webcam stream
//     if (videoRef.current && videoRef.current.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach((track) => track.stop());
//     }
//     setIsTracking(false);
//     console.log("🛑 Stopped tracking");
//   };

//   return (
//     <div
//       className="relative min-h-screen flex items-center justify-center font-sans bg-contain bg-center bg-no-repeat"
//       style={{
//         backgroundImage:
//           "url('./Screenshot_2025-09-10_195914-removebg-preview(1).png')",
//       }}
//     >
//       {/* Main content */}
//       <div className="relative z-20 bg-white/90 shadow-md rounded-lg p-6 w-full max-w-md text-center">
//         <h1 className="text-2xl font-bold mb-4">Driver Panel</h1>

//         <input
//           type="text"
//           placeholder="Enter Bus ID (e.g. R101-B)"
//           value={busId}
//           onChange={(e) => setBusId(e.target.value)}
//           className="w-full p-2 border rounded mb-4"
//         />

//         {!isTracking ? (
//           <button
//             onClick={startTracking}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
//           >
//             Start Tracking
//           </button>
//         ) : (
//           <button
//             onClick={stopTracking}
//             className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
//           >
//             Stop Tracking
//           </button>
//         )}

//         {isTracking && (
//           <p className="text-green-600 mt-4 font-semibold">
//             ✅ Live location & photo is being sent for Bus {busId} every 2 seconds
//           </p>
//         )}

//         {/* Webcam preview */}
//         {isTracking && (
//           <div className="mt-4">
//             <video ref={videoRef} className="w-full rounded border" />
//             <canvas ref={canvasRef} className="hidden" />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DriverPanel;
