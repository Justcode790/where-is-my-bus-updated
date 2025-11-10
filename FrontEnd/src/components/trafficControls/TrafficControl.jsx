import React, { useState, useEffect, useRef } from 'react';
import { demoBusesData } from '../../data/mockData';

// The backend server address (commented out for demo)
// const API_URL = "http://localhost:3001";

// --- Helper Icons ---
const BusIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M8 6v6" /><path d="M15 6v6" /><path d="M2 12h19.6" /><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
);

const PhoneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);

// --- Main Traffic Control Component ---
export default function TrafficControl() {
    // Default location set to Vadlamudi, Andhra Pradesh
    setInterval(()=>{
        console.log(localStorage.getItem("busLocation"))
    },2000)

    const [userLocation, setUserLocation] = useState({ lat: 16.4426, lon: 80.6225 });
    const [buses, setBuses] = useState(demoBusesData);
    const [selectedBus, setSelectedBus] = useState(null);
    const [error, setError] = useState(null);
    const mapRef = useRef(null); // Ref for the map container

    // Fetch user's actual location (will override the default if successful)
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lon: longitude });
                },
                (err) => {
                    setError("Could not get your location. Using default. Please enable location services for accuracy.");
                    console.error(err);
                }
            );
        } else {
            setError("Geolocation is not supported by this browser.");
        }
    }, []);

    // --- DEMO SIMULATION ---
    useEffect(() => {
        const simulationInterval = setInterval(() => {
            setBuses(currentBuses => 
                currentBuses.map(bus => {
                    const nextIndex = bus.pathIndex + 1;
                    // Reset path if it reaches the end, creating a loop
                    const newIndex = nextIndex >= bus.path.length ? 0 : nextIndex;
                    const newPosition = bus.path[newIndex];
                    
                    return {
                        ...bus,
                        lat: newPosition.lat,
                        lon: newPosition.lon,
                        pathIndex: newIndex,
                    };
                })
            );
        }, 3000); // Update every 3 seconds

        return () => clearInterval(simulationInterval);
    }, []);


    /* --- ACTUAL LIVE DATA FETCHING (COMMENTED OUT) ---
    useEffect(() => {
        const fetchAllBuses = async () => {
            try {
                const response = await fetch(`${API_URL}/api/allBusesStatus`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBuses(data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch bus data from server.");
                console.error(err);
            }
        };

        fetchAllBuses();
        const intervalId = setInterval(fetchAllBuses, 7000); // Poll every 7 seconds

        return () => clearInterval(intervalId);
    }, []);
    */

    // Helper to calculate position on a simple grid map
    const getMapPosition = (lat, lon) => {
        if (!userLocation || !mapRef.current) return { top: '50%', left: '50%' };
        
        const mapWidth = mapRef.current.offsetWidth;
        const mapHeight = mapRef.current.offsetHeight;

        // Simple projection: assumes a relatively small, flat area
        // Multiplier is increased for more visible movement on the map
        const left = mapWidth * (0.5 + (lon - userLocation.lon) * 100);
        const top = mapHeight * (0.5 - (lat - userLocation.lat) * 100);

        return { top: `${top}px`, left: `${left}px` };
    };

    return (
        <div className="font-sans bg-gray-100 min-h-screen">
            <header className="bg-blue-800 text-white p-4 shadow-md text-center">
                <h1 className="text-2xl font-bold">Traffic Control Live Map</h1>
            </header>

            {error && <div className="bg-yellow-500 text-white p-3 text-center">{error}</div>}

            <div className="p-4">
                <div ref={mapRef} className="relative w-full h-[60vh] bg-green-100 rounded-lg shadow-lg overflow-hidden border-4 border-white">
                    {/* Placeholder for a real map tile layer */}
                    <div className="absolute inset-0 bg-grid-gray-300/20" style={{ backgroundImage: 'linear-gradient(white 2px, transparent 2px), linear-gradient(90deg, white 2px, transparent 2px), linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)', backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px', backgroundPosition: '-2px -2px, -2px -2px, -1px -1px, -1px -1px' }}></div>

                    {userLocation && (
                        <div className="absolute" style={getMapPosition(userLocation.lat, userLocation.lon)}>
                             <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white transform -translate-x-1/2 -translate-y-1/2 shadow-xl animate-pulse"></div>
                        </div>
                    )}

                    {buses.map(bus => (
                        <div 
                            key={bus.busId} 
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-linear cursor-pointer" 
                            style={getMapPosition(bus.lat, bus.lon)}
                            onClick={() => setSelectedBus(bus)}
                        >
                           <BusIcon className={`w-10 h-10 text-white p-1 rounded-full shadow-2xl ${selectedBus?.busId === bus.busId ? 'bg-red-600' : 'bg-gray-800'}`} />
                        </div>
                    ))}
                </div>

                {/* Bus Information Panel */}
                <div className="mt-4">
                    {selectedBus ? (
                        <div className="bg-white p-4 rounded-lg shadow-md border animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800">{selectedBus.busId}</h2>
                            <p className="text-gray-600">Route: {selectedBus.routeName}</p>
                            <p className="text-gray-600">Next Stop: {selectedBus.nextStopName}</p>
                            <button className="w-full mt-4 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition">
                               <PhoneIcon /> Contact Agency
                            </button>
                        </div>
                    ) : (
                         <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
                            <p>Click on a bus to see its details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

