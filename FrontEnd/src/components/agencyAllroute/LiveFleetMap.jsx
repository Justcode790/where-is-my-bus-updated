import { useRef } from 'react';
import Bus from '../icons/Bus';

const LiveFleetMap = ({ buses }) => {
    const mapRef = useRef(null);

    return (
        <div ref={mapRef} className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
            <div className="absolute inset-0 bg-gray-200" style={{ backgroundImage: "url('https://www.svgrepo.com/show/426326/map-symbol.svg')", backgroundSize: 'cover', opacity: 0.05 }}></div>
            <p className="absolute top-2 left-2 text-gray-500 bg-white/50 backdrop-blur-sm px-2 py-1 rounded">Map Placeholder</p>
            {buses.map(bus => (
                <div 
                    key={bus._id} 
                    className="absolute transition-all duration-1000 ease-linear transform -translate-x-1/2 -translate-y-1/2" 
                    style={{ 
                        left: `${((bus.lng - 77.55) / 0.1) * 100}%`, 
                        top: `${((13.00 - bus.lat) / 0.08) * 100}% `
                    }}
                >
                    <div className="relative group">
                        <Bus className={`w-8 h-8 text-white p-1 rounded-full shadow-lg ${bus.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-500'}`} />
                        <div className="absolute bottom-full mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {bus.busNumber} ({bus.status})
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LiveFleetMap