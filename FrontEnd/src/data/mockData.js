// Full route data with stops
export const availableBusesData = [
  {
    id: "R101-A",
    busNumber: "KA-01-F-1234",
    name: "Majestic to ITPL",
    platform: 5,
    status: "On Time",
    etaMinutes: 5,
    stops: [
      { id: 1, name: "Majestic Bus Station", time: "10:00 AM" },
      { id: 2, name: "Corporation Circle", time: "10:10 AM" },
      { id: 3, name: "Richmond Circle", time: "10:20 AM" },
      { id: 4, name: "MG Road", time: "10:30 AM" },
      { id: 5, name: "Indiranagar", time: "10:45 AM" },
      { id: 6, name: "Marathahalli", time: "11:00 AM" },
      { id: 7, name: "Graphite India", time: "11:10 AM" },
      { id: 8, name: "ITPL", time: "11:20 AM" },
    ],
    initialStopIndex: 3,
  },
  {
    id: "R101-B",
    busNumber: "KA-02-G-9101",
    name: "Majestic to ITPL",
    platform: 5,
    status: "Delayed",
    etaMinutes: 18,
    stops: [
      { id: 1, name: "Majestic Bus Station", time: "10:05 AM" },
      { id: 2, name: "Corporation Circle", time: "10:15 AM" },
      { id: 3, name: "Richmond Circle", time: "10:25 AM" },
      { id: 4, name: "MG Road", time: "10:35 AM" },
      { id: 5, name: "Indiranagar", time: "10:50 AM" },
      { id: 6, name: "Marathahalli", time: "11:05 AM" },
      { id: 7, name: "Graphite India", time: "11:15 AM" },
      { id: 8, name: "ITPL", time: "11:25 AM" },
    ],
    initialStopIndex: 1,
  },
];


// Simplified live-tracking data
export const initialBuses = [
  {
    id: "BUS001",
    registration: "KA-01-F-1234",
    routeId: "R101",
    status: "On Time",
    lat: 12.9716,
    lng: 77.5946,
    passengers: 32,
    speed: 45,
  },
  {
    id: "BUS002",
    registration: "KA-02-G-9101",
    routeId: "R101",
    status: "Delayed",
    lat: 12.9555,
    lng: 77.5755,
    passengers: 21,
    speed: 50,
  },
  {
    id: "BUS003",
    registration: "KA-01-F-5678",
    routeId: "R102",
    status: "Delayed",
    lat: 12.9352,
    lng: 77.6245,
    passengers: 45,
    speed: 22,
  },
  {
    id: "BUS004",
    registration: "KA-03-H-1121",
    routeId: "R103",
    status: "Early",
    lat: 12.9810,
    lng: 77.6340,
    passengers: 15,
    speed: 55,
  },
];


// Route summary data
export const initialRoutes = [
  {
    id: "R101",
    name: "Majestic to ITPL",
    stops: availableBusesData[0].stops.length, // 8 stops
    distance: "22 km",
  },
  {
    id: "R102",
    name: "Koramangala to Marathahalli",
    stops: 15,
    distance: "12 km",
  },
  {
    id: "R103",
    name: "Bannerghatta Road to Hebbal",
    stops: 25,
    distance: "30 km",
  },
];


 export const demoBusesData = [
    {
        busId: 'AP-39-TA-1234',
        routeName: 'Guntur to Tenali',
        nextStopName: 'Sangam Jagarlamudi',
        lat: 16.4426, // Starting near Vadlamudi
        lon: 80.6225,
        pathIndex: 0,
        path: [
            { lat: 16.4426, lon: 80.6225 }, { lat: 16.4416, lon: 80.6235 },
            { lat: 16.4406, lon: 80.6245 }, { lat: 16.4396, lon: 80.6255 },
            { lat: 16.4386, lon: 80.6265 }, { lat: 16.4376, lon: 80.6275 },
        ]
    },
    {
        busId: 'AP-07-Z-5678',
        routeName: 'Vijayawada Express',
        nextStopName: 'Kankipadu',
        lat: 16.4450, // Starting north of Vadlamudi
        lon: 80.6280,
        pathIndex: 0,
        path: [
            { lat: 16.4450, lon: 80.6280 }, { lat: 16.4460, lon: 80.6275 },
            { lat: 16.4470, lon: 80.6270 }, { lat: 16.4480, lon: 80.6265 },
            { lat: 16.4490, lon: 80.6260 }, { lat: 16.4500, lon: 80.6255 },
        ]
    }
];