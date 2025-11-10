const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Import models
const SuperAdmin = require("./models/SuperAdmin");
const Admin = require("./models/Admin");
const Driver = require("./models/Driver");
const Bus = require("./models/Bus");
const Route = require("./models/Route");

dotenv.config();

// Seed data
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("Clearing existing data...");
    await SuperAdmin.deleteMany({});
    await Admin.deleteMany({});
    await Driver.deleteMany({});
    await Bus.deleteMany({});
    await Route.deleteMany({});
    console.log("Existing data cleared");

    // 1. Create Super Admin
    console.log("Creating Super Admin...");
    const superAdmin = await SuperAdmin.create({
      name: "System Administrator",
      email: "superadmin@whereisbus.com",
      password: "SuperAdmin123!", // Will be hashed by pre-save hook
      role: "superadmin"
    });
    console.log("✅ Super Admin created:", superAdmin.email);

    // 2. Create Admins (Bus Organizations)
    console.log("\nCreating Bus Organizations (Admins)...");
    const admins = await Admin.create([
      {
        name: "Rajesh Kumar",
        email: "rajesh@redbus.com",
        password: "Admin123!",
        organizationName: "Red Bus Services",
        phone: "+91-9876543210",
        address: "123 Transport Nagar, Bangalore",
        isActive: true,
        verificationStatus: "approved"
      },
      {
        name: "Priya Sharma",
        email: "priya@govtbus.com",
        password: "Admin123!",
        organizationName: "Government Bus Corporation",
        phone: "+91-9876543211",
        address: "456 Public Transport Hub, Delhi",
        isActive: true,
        verificationStatus: "approved"
      },
      {
        name: "Amit Patel",
        email: "amit@greenbus.com",
        password: "Admin123!",
        organizationName: "Green Line Transport",
        phone: "+91-9876543212",
        address: "789 Eco Transport Center, Mumbai",
        isActive: true,
        verificationStatus: "approved"
      }
    ]);
    console.log(`✅ Created ${admins.length} bus organizations`);

    // 3. Create Routes for each Admin
    // ⚠️ IMPORTANT: Buses are ONLY assigned to these routes below.
    // Users can only search and track buses for these specific routes.
    console.log("\nCreating Routes with Stops...");
    const routes = [];

    // Routes for Red Bus Services (Bangalore)
    const redBusRoutes = await Route.create([
      {
        name: "Majestic to ITPL",
        adminId: admins[0]._id,
        numberOfStops: 10,
        stops: [
          { stopName: "Majestic Bus Station", latitude: 12.9772, longitude: 77.5683, stopOrder: 1 },
          { stopName: "Kempegowda Bus Stand", latitude: 12.9750, longitude: 77.5700, stopOrder: 2 },
          { stopName: "Corporation Circle", latitude: 12.9716, longitude: 77.5946, stopOrder: 3 },
          { stopName: "Richmond Circle", latitude: 12.9616, longitude: 77.6016, stopOrder: 4 },
          { stopName: "MG Road", latitude: 12.9716, longitude: 77.6096, stopOrder: 5 },
          { stopName: "Trinity Circle", latitude: 12.9650, longitude: 77.6200, stopOrder: 6 },
          { stopName: "Indiranagar", latitude: 12.9784, longitude: 77.6408, stopOrder: 7 },
          { stopName: "Marathahalli", latitude: 12.9352, longitude: 77.6965, stopOrder: 8 },
          { stopName: "Graphite India", latitude: 12.9200, longitude: 77.7200, stopOrder: 9 },
          { stopName: "ITPL", latitude: 12.9000, longitude: 77.7500, stopOrder: 10 }
        ],
        distanceKm: 28.5,
        estimatedTime: "50 mins"
      },
      {
        name: "City Center to Airport",
        adminId: admins[0]._id,
        numberOfStops: 8,
        stops: [
          { stopName: "City Center", latitude: 12.9716, longitude: 77.5946, stopOrder: 1 },
          { stopName: "Vidhana Soudha", latitude: 12.9794, longitude: 77.5908, stopOrder: 2 },
          { stopName: "Hebbal", latitude: 13.0350, longitude: 77.5970, stopOrder: 3 },
          { stopName: "Yelahanka", latitude: 13.1000, longitude: 77.6000, stopOrder: 4 },
          { stopName: "Bagalur Cross", latitude: 13.1500, longitude: 77.6500, stopOrder: 5 },
          { stopName: "Devanahalli", latitude: 13.2470, longitude: 77.7100, stopOrder: 6 },
          { stopName: "Airport Terminal 1", latitude: 13.1986, longitude: 77.7066, stopOrder: 7 },
          { stopName: "Airport Terminal 2", latitude: 13.2000, longitude: 77.7100, stopOrder: 8 }
        ],
        distanceKm: 38.0,
        estimatedTime: "65 mins"
      },
      {
        name: "Electronic City to Whitefield",
        adminId: admins[0]._id,
        numberOfStops: 12,
        stops: [
          { stopName: "Electronic City", latitude: 12.8456, longitude: 77.6633, stopOrder: 1 },
          { stopName: "Hosur Road", latitude: 12.8600, longitude: 77.6700, stopOrder: 2 },
          { stopName: "Bommanahalli", latitude: 12.8900, longitude: 77.6800, stopOrder: 3 },
          { stopName: "HSR Layout", latitude: 12.9100, longitude: 77.6500, stopOrder: 4 },
          { stopName: "Koramangala", latitude: 12.9352, longitude: 77.6245, stopOrder: 5 },
          { stopName: "Indiranagar", latitude: 12.9784, longitude: 77.6408, stopOrder: 6 },
          { stopName: "KR Puram", latitude: 13.0200, longitude: 77.6900, stopOrder: 7 },
          { stopName: "Marathahalli", latitude: 12.9352, longitude: 77.6965, stopOrder: 8 },
          { stopName: "Kundalahalli", latitude: 12.9500, longitude: 77.7100, stopOrder: 9 },
          { stopName: "Hopefarm", latitude: 12.9700, longitude: 77.7300, stopOrder: 10 },
          { stopName: "ITPL Main Gate", latitude: 12.9000, longitude: 77.7500, stopOrder: 11 },
          { stopName: "Whitefield", latitude: 12.9698, longitude: 77.7499, stopOrder: 12 }
        ],
        distanceKm: 42.0,
        estimatedTime: "75 mins"
      }
    ]);

    // Routes for Government Bus Corporation (Delhi/NCR)
    const govtBusRoutes = await Route.create([
      {
        name: "Delhi Central to Noida",
        adminId: admins[1]._id,
        numberOfStops: 10,
        stops: [
          { stopName: "Delhi Central Station", latitude: 28.6139, longitude: 77.2090, stopOrder: 1 },
          { stopName: "New Delhi Railway Station", latitude: 28.6428, longitude: 77.2207, stopOrder: 2 },
          { stopName: "Connaught Place", latitude: 28.6304, longitude: 77.2177, stopOrder: 3 },
          { stopName: "India Gate", latitude: 28.6129, longitude: 77.2295, stopOrder: 4 },
          { stopName: "ITO", latitude: 28.6275, longitude: 77.2431, stopOrder: 5 },
          { stopName: "Laxmi Nagar", latitude: 28.6333, longitude: 77.2833, stopOrder: 6 },
          { stopName: "Preet Vihar", latitude: 28.6200, longitude: 77.2900, stopOrder: 7 },
          { stopName: "Mayur Vihar", latitude: 28.6000, longitude: 77.3000, stopOrder: 8 },
          { stopName: "Noida Sector 18", latitude: 28.5500, longitude: 77.3200, stopOrder: 9 },
          { stopName: "Noida City Center", latitude: 28.5350, longitude: 77.3900, stopOrder: 10 }
        ],
        distanceKm: 32.0,
        estimatedTime: "55 mins"
      },
      {
        name: "Delhi to Gurgaon",
        adminId: admins[1]._id,
        numberOfStops: 9,
        stops: [
          { stopName: "Dhaula Kuan", latitude: 28.5842, longitude: 77.1708, stopOrder: 1 },
          { stopName: "IGI Airport", latitude: 28.5562, longitude: 77.1000, stopOrder: 2 },
          { stopName: "Mahipalpur", latitude: 28.5400, longitude: 77.1200, stopOrder: 3 },
          { stopName: "Dwarka Sector 21", latitude: 28.5500, longitude: 77.0500, stopOrder: 4 },
          { stopName: "Gurgaon Bus Stand", latitude: 28.4089, longitude: 77.0378, stopOrder: 5 },
          { stopName: "Gurgaon Sector 14", latitude: 28.4200, longitude: 77.0500, stopOrder: 6 },
          { stopName: "Gurgaon Sector 29", latitude: 28.4300, longitude: 77.0800, stopOrder: 7 },
          { stopName: "DLF Cyber City", latitude: 28.4967, longitude: 77.0931, stopOrder: 8 },
          { stopName: "Gurgaon Sector 56", latitude: 28.4100, longitude: 77.0900, stopOrder: 9 }
        ],
        distanceKm: 35.0,
        estimatedTime: "60 mins"
      },
      {
        name: "Old Delhi to Dwarka",
        adminId: admins[1]._id,
        numberOfStops: 11,
        stops: [
          { stopName: "Old Delhi Railway Station", latitude: 28.6619, longitude: 77.2274, stopOrder: 1 },
          { stopName: "Chandni Chowk", latitude: 28.6562, longitude: 77.2310, stopOrder: 2 },
          { stopName: "Red Fort", latitude: 28.6562, longitude: 77.2410, stopOrder: 3 },
          { stopName: "Kashmere Gate", latitude: 28.6654, longitude: 77.2290, stopOrder: 4 },
          { stopName: "ISBT Kashmere Gate", latitude: 28.6700, longitude: 77.2300, stopOrder: 5 },
          { stopName: "Rohini", latitude: 28.7200, longitude: 77.1200, stopOrder: 6 },
          { stopName: "Pitampura", latitude: 28.6900, longitude: 77.1300, stopOrder: 7 },
          { stopName: "Janakpuri", latitude: 28.6200, longitude: 77.0900, stopOrder: 8 },
          { stopName: "Dwarka Sector 10", latitude: 28.5800, longitude: 77.0600, stopOrder: 9 },
          { stopName: "Dwarka Sector 21", latitude: 28.5500, longitude: 77.0500, stopOrder: 10 },
          { stopName: "Dwarka Sector 25", latitude: 28.5300, longitude: 77.0400, stopOrder: 11 }
        ],
        distanceKm: 30.0,
        estimatedTime: "70 mins"
      }
    ]);

    // Routes for Green Line Transport (Mumbai)
    const greenBusRoutes = await Route.create([
      {
        name: "Mumbai CST to Andheri",
        adminId: admins[2]._id,
        numberOfStops: 12,
        stops: [
          { stopName: "CST Station", latitude: 18.9400, longitude: 72.8350, stopOrder: 1 },
          { stopName: "Fort", latitude: 18.9350, longitude: 72.8370, stopOrder: 2 },
          { stopName: "Marine Lines", latitude: 18.9500, longitude: 72.8300, stopOrder: 3 },
          { stopName: "Churchgate", latitude: 18.9300, longitude: 72.8300, stopOrder: 4 },
          { stopName: "Grant Road", latitude: 18.9600, longitude: 72.8200, stopOrder: 5 },
          { stopName: "Dadar", latitude: 19.0176, longitude: 72.8477, stopOrder: 6 },
          { stopName: "Bandra", latitude: 19.0600, longitude: 72.8300, stopOrder: 7 },
          { stopName: "Santacruz", latitude: 19.0800, longitude: 72.8400, stopOrder: 8 },
          { stopName: "Vile Parle", latitude: 19.1000, longitude: 72.8500, stopOrder: 9 },
          { stopName: "Juhu", latitude: 19.1100, longitude: 72.8300, stopOrder: 10 },
          { stopName: "Versova", latitude: 19.1200, longitude: 72.8200, stopOrder: 11 },
          { stopName: "Andheri", latitude: 19.1136, longitude: 72.8697, stopOrder: 12 }
        ],
        distanceKm: 28.0,
        estimatedTime: "50 mins"
      },
      {
        name: "Bandra to Thane",
        adminId: admins[2]._id,
        numberOfStops: 10,
        stops: [
          { stopName: "Bandra", latitude: 19.0600, longitude: 72.8300, stopOrder: 1 },
          { stopName: "Khar", latitude: 19.0700, longitude: 72.8400, stopOrder: 2 },
          { stopName: "Santacruz", latitude: 19.0800, longitude: 72.8400, stopOrder: 3 },
          { stopName: "Vile Parle", latitude: 19.1000, longitude: 72.8500, stopOrder: 4 },
          { stopName: "Andheri", latitude: 19.1136, longitude: 72.8697, stopOrder: 5 },
          { stopName: "Goregaon", latitude: 19.1600, longitude: 72.8500, stopOrder: 6 },
          { stopName: "Malad", latitude: 19.1900, longitude: 72.8400, stopOrder: 7 },
          { stopName: "Kandivali", latitude: 19.2100, longitude: 72.8300, stopOrder: 8 },
          { stopName: "Borivali", latitude: 19.2300, longitude: 72.8600, stopOrder: 9 },
          { stopName: "Thane", latitude: 19.2183, longitude: 72.9781, stopOrder: 10 }
        ],
        distanceKm: 35.0,
        estimatedTime: "65 mins"
      },
      {
        name: "Colaba to Powai",
        adminId: admins[2]._id,
        numberOfStops: 11,
        stops: [
          { stopName: "Colaba", latitude: 18.9067, longitude: 72.8147, stopOrder: 1 },
          { stopName: "Nariman Point", latitude: 18.9200, longitude: 72.8300, stopOrder: 2 },
          { stopName: "Marine Drive", latitude: 18.9400, longitude: 72.8250, stopOrder: 3 },
          { stopName: "Churchgate", latitude: 18.9300, longitude: 72.8300, stopOrder: 4 },
          { stopName: "Grant Road", latitude: 18.9600, longitude: 72.8200, stopOrder: 5 },
          { stopName: "Dadar", latitude: 19.0176, longitude: 72.8477, stopOrder: 6 },
          { stopName: "Sion", latitude: 19.0400, longitude: 72.8600, stopOrder: 7 },
          { stopName: "Kurla", latitude: 19.0700, longitude: 72.8800, stopOrder: 8 },
          { stopName: "Bhandup", latitude: 19.1400, longitude: 72.9300, stopOrder: 9 },
          { stopName: "Vikhroli", latitude: 19.1100, longitude: 72.9400, stopOrder: 10 },
          { stopName: "Powai", latitude: 19.1200, longitude: 72.9000, stopOrder: 11 }
        ],
        distanceKm: 32.0,
        estimatedTime: "70 mins"
      }
    ]);

    routes.push(...redBusRoutes, ...govtBusRoutes, ...greenBusRoutes);
    console.log(`✅ Created ${routes.length} routes`);

    // 4. Create Drivers for each Admin
    console.log("\nCreating Drivers...");
    const drivers = [];

    // Drivers for Red Bus Services
    const redBusDrivers = await Driver.create([
      {
        name: "Ramesh Singh",
        email: "ramesh.driver@redbus.com",
        password: "Driver123!",
        licenseNumber: "KA-123456",
        phone: "+91-9876500001",
        experience: 5,
        adminId: admins[0]._id,
        isActive: true
      },
      {
        name: "Suresh Kumar",
        email: "suresh.driver@redbus.com",
        password: "Driver123!",
        licenseNumber: "KA-123457",
        phone: "+91-9876500002",
        experience: 8,
        adminId: admins[0]._id,
        isActive: true
      },
      {
        name: "Mahesh Yadav",
        email: "mahesh.driver@redbus.com",
        password: "Driver123!",
        licenseNumber: "KA-123458",
        phone: "+91-9876500003",
        experience: 3,
        adminId: admins[0]._id,
        isActive: true
      },
      {
        name: "Rajesh Kumar",
        email: "rajesh.driver@redbus.com",
        password: "Driver123!",
        licenseNumber: "KA-123459",
        phone: "+91-9876500008",
        experience: 6,
        adminId: admins[0]._id,
        isActive: true
      },
      {
        name: "Vikash Sharma",
        email: "vikash.driver@redbus.com",
        password: "Driver123!",
        licenseNumber: "KA-123460",
        phone: "+91-9876500009",
        experience: 4,
        adminId: admins[0]._id,
        isActive: true
      }
    ]);

    // Drivers for Government Bus Corporation
    const govtBusDrivers = await Driver.create([
      {
        name: "Vikram Mehta",
        email: "vikram.driver@govtbus.com",
        password: "Driver123!",
        licenseNumber: "DL-223456",
        phone: "+91-9876500004",
        experience: 10,
        adminId: admins[1]._id,
        isActive: true
      },
      {
        name: "Anil Verma",
        email: "anil.driver@govtbus.com",
        password: "Driver123!",
        licenseNumber: "DL-223457",
        phone: "+91-9876500005",
        experience: 7,
        adminId: admins[1]._id,
        isActive: true
      },
      {
        name: "Rohit Gupta",
        email: "rohit.driver@govtbus.com",
        password: "Driver123!",
        licenseNumber: "DL-223458",
        phone: "+91-9876500010",
        experience: 9,
        adminId: admins[1]._id,
        isActive: true
      },
      {
        name: "Sandeep Singh",
        email: "sandeep.driver@govtbus.com",
        password: "Driver123!",
        licenseNumber: "DL-223459",
        phone: "+91-9876500011",
        experience: 5,
        adminId: admins[1]._id,
        isActive: true
      },
      {
        name: "Manoj Kumar",
        email: "manoj.driver@govtbus.com",
        password: "Driver123!",
        licenseNumber: "DL-223460",
        phone: "+91-9876500012",
        experience: 8,
        adminId: admins[1]._id,
        isActive: true
      }
    ]);

    // Drivers for Green Line Transport
    const greenBusDrivers = await Driver.create([
      {
        name: "Sunil Desai",
        email: "sunil.driver@greenbus.com",
        password: "Driver123!",
        licenseNumber: "MH-323456",
        phone: "+91-9876500006",
        experience: 6,
        adminId: admins[2]._id,
        isActive: true
      },
      {
        name: "Ravi Joshi",
        email: "ravi.driver@greenbus.com",
        password: "Driver123!",
        licenseNumber: "MH-323457",
        phone: "+91-9876500007",
        experience: 4,
        adminId: admins[2]._id,
        isActive: true
      },
      {
        name: "Ajay Patil",
        email: "ajay.driver@greenbus.com",
        password: "Driver123!",
        licenseNumber: "MH-323458",
        phone: "+91-9876500013",
        experience: 7,
        adminId: admins[2]._id,
        isActive: true
      },
      {
        name: "Nitin Sawant",
        email: "nitin.driver@greenbus.com",
        password: "Driver123!",
        licenseNumber: "MH-323459",
        phone: "+91-9876500014",
        experience: 5,
        adminId: admins[2]._id,
        isActive: true
      },
      {
        name: "Prakash Gaikwad",
        email: "prakash.driver@greenbus.com",
        password: "Driver123!",
        licenseNumber: "MH-323460",
        phone: "+91-9876500015",
        experience: 6,
        adminId: admins[2]._id,
        isActive: true
      }
    ]);

    drivers.push(...redBusDrivers, ...govtBusDrivers, ...greenBusDrivers);
    console.log(`✅ Created ${drivers.length} drivers`);

    // 5. Create Buses and assign to routes and drivers
    // ⚠️ IMPORTANT NOTE: Buses are ONLY created for the routes defined above.
    // Users can ONLY search and track buses for these specific routes.
    // Each bus is assigned to one route and one driver.
    console.log("\nCreating Buses and assigning to routes and drivers...");
    console.log("⚠️  NOTE: Buses are ONLY available for the routes created above.");
    const buses = [];

    // Buses for Red Bus Services - Route 1 (Majestic to ITPL)
    const redBus1 = await Bus.create({
      busNumber: "KA-01-AB-1234",
      capacity: 50,
      adminId: admins[0]._id,
      route: redBusRoutes[0]._id,
      driver: redBusDrivers[0]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
    });
    redBusDrivers[0].assignedBus = redBus1._id;
    await redBusDrivers[0].save();
    buses.push(redBus1);

    const redBus2 = await Bus.create({
      busNumber: "KA-01-CD-5678",
      capacity: 45,
      adminId: admins[0]._id,
      route: redBusRoutes[0]._id,
      driver: redBusDrivers[1]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
    });
    redBusDrivers[1].assignedBus = redBus2._id;
    await redBusDrivers[1].save();
    buses.push(redBus2);

    // Red Bus - Route 2 (City Center to Airport)
    const redBus3 = await Bus.create({
      busNumber: "KA-01-EF-9012",
      capacity: 40,
      adminId: admins[0]._id,
      route: redBusRoutes[1]._id,
      driver: redBusDrivers[2]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
    });
    redBusDrivers[2].assignedBus = redBus3._id;
    await redBusDrivers[2].save();
    buses.push(redBus3);

    // Red Bus - Route 3 (Electronic City to Whitefield)
    const redBus4 = await Bus.create({
      busNumber: "KA-01-GH-3456",
      capacity: 48,
      adminId: admins[0]._id,
      route: redBusRoutes[2]._id,
      driver: redBusDrivers[3]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 hours from now
    });
    redBusDrivers[3].assignedBus = redBus4._id;
    await redBusDrivers[3].save();
    buses.push(redBus4);

    const redBus5 = await Bus.create({
      busNumber: "KA-01-IJ-7890",
      capacity: 52,
      adminId: admins[0]._id,
      route: redBusRoutes[2]._id,
      driver: redBusDrivers[4]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
    });
    redBusDrivers[4].assignedBus = redBus5._id;
    await redBusDrivers[4].save();
    buses.push(redBus5);

    // Buses for Government Bus Corporation - Route 1 (Delhi Central to Noida)
    const govtBus1 = await Bus.create({
      busNumber: "DL-01-GH-3456",
      capacity: 55,
      adminId: admins[1]._id,
      route: govtBusRoutes[0]._id,
      driver: govtBusDrivers[0]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 1 * 60 * 60 * 1000) // 1 hour from now
    });
    govtBusDrivers[0].assignedBus = govtBus1._id;
    await govtBusDrivers[0].save();
    buses.push(govtBus1);

    const govtBus2 = await Bus.create({
      busNumber: "DL-01-IJ-7890",
      capacity: 50,
      adminId: admins[1]._id,
      route: govtBusRoutes[0]._id,
      driver: govtBusDrivers[1]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 5 * 60 * 60 * 1000) // 5 hours from now
    });
    govtBusDrivers[1].assignedBus = govtBus2._id;
    await govtBusDrivers[1].save();
    buses.push(govtBus2);

    // Govt Bus - Route 2 (Delhi to Gurgaon)
    const govtBus3 = await Bus.create({
      busNumber: "DL-01-KL-2345",
      capacity: 52,
      adminId: admins[1]._id,
      route: govtBusRoutes[1]._id,
      driver: govtBusDrivers[2]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000) // 2.5 hours from now
    });
    govtBusDrivers[2].assignedBus = govtBus3._id;
    await govtBusDrivers[2].save();
    buses.push(govtBus3);

    // Govt Bus - Route 3 (Old Delhi to Dwarka)
    const govtBus4 = await Bus.create({
      busNumber: "DL-01-MN-6789",
      capacity: 48,
      adminId: admins[1]._id,
      route: govtBusRoutes[2]._id,
      driver: govtBusDrivers[3]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 3.5 * 60 * 60 * 1000) // 3.5 hours from now
    });
    govtBusDrivers[3].assignedBus = govtBus4._id;
    await govtBusDrivers[3].save();
    buses.push(govtBus4);

    const govtBus5 = await Bus.create({
      busNumber: "DL-01-OP-0123",
      capacity: 54,
      adminId: admins[1]._id,
      route: govtBusRoutes[2]._id,
      driver: govtBusDrivers[4]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 7 * 60 * 60 * 1000) // 7 hours from now
    });
    govtBusDrivers[4].assignedBus = govtBus5._id;
    await govtBusDrivers[4].save();
    buses.push(govtBus5);

    // Buses for Green Line Transport - Route 1 (Mumbai CST to Andheri)
    const greenBus1 = await Bus.create({
      busNumber: "MH-01-KL-2345",
      capacity: 48,
      adminId: admins[2]._id,
      route: greenBusRoutes[0]._id,
      driver: greenBusDrivers[0]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000) // 2.5 hours from now
    });
    greenBusDrivers[0].assignedBus = greenBus1._id;
    await greenBusDrivers[0].save();
    buses.push(greenBus1);

    const greenBus2 = await Bus.create({
      busNumber: "MH-01-MN-6789",
      capacity: 42,
      adminId: admins[2]._id,
      route: greenBusRoutes[0]._id,
      driver: greenBusDrivers[1]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 6 * 60 * 60 * 1000) // 6 hours from now
    });
    greenBusDrivers[1].assignedBus = greenBus2._id;
    await greenBusDrivers[1].save();
    buses.push(greenBus2);

    // Green Bus - Route 2 (Bandra to Thane)
    const greenBus3 = await Bus.create({
      busNumber: "MH-01-QR-4567",
      capacity: 46,
      adminId: admins[2]._id,
      route: greenBusRoutes[1]._id,
      driver: greenBusDrivers[2]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hours from now
    });
    greenBusDrivers[2].assignedBus = greenBus3._id;
    await greenBusDrivers[2].save();
    buses.push(greenBus3);

    // Green Bus - Route 3 (Colaba to Powai)
    const greenBus4 = await Bus.create({
      busNumber: "MH-01-ST-8901",
      capacity: 44,
      adminId: admins[2]._id,
      route: greenBusRoutes[2]._id,
      driver: greenBusDrivers[3]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 3 * 60 * 60 * 1000) // 3 hours from now
    });
    greenBusDrivers[3].assignedBus = greenBus4._id;
    await greenBusDrivers[3].save();
    buses.push(greenBus4);

    const greenBus5 = await Bus.create({
      busNumber: "MH-01-UV-2345",
      capacity: 50,
      adminId: admins[2]._id,
      route: greenBusRoutes[2]._id,
      driver: greenBusDrivers[4]._id,
      status: "offline",
      tripStatus: "not-started",
      scheduledDepartureTime: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours from now
    });
    greenBusDrivers[4].assignedBus = greenBus5._id;
    await greenBusDrivers[4].save();
    buses.push(greenBus5);

    console.log(`✅ Created ${buses.length} buses with proper assignments`);

    // Summary
    console.log("\n" + "=".repeat(60));
    console.log("SEED DATA SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Super Admin: 1`);
    console.log(`✅ Bus Organizations (Admins): ${admins.length}`);
    console.log(`✅ Routes: ${routes.length}`);
    console.log(`✅ Drivers: ${drivers.length}`);
    console.log(`✅ Buses: ${buses.length}`);
    console.log("\n" + "=".repeat(60));
    console.log("⚠️  IMPORTANT: BUSES ARE ONLY AVAILABLE FOR THESE ROUTES");
    console.log("=".repeat(60));
    console.log("\n📌 Red Bus Services (Bangalore):");
    redBusRoutes.forEach((route, idx) => {
      const routeBuses = buses.filter(b => b.route.toString() === route._id.toString());
      console.log(`   ${idx + 1}. ${route.name} (${route.numberOfStops} stops) - ${routeBuses.length} bus(es)`);
      routeBuses.forEach(bus => {
        console.log(`      - ${bus.busNumber}`);
      });
    });
    console.log("\n📌 Government Bus Corporation (Delhi/NCR):");
    govtBusRoutes.forEach((route, idx) => {
      const routeBuses = buses.filter(b => b.route.toString() === route._id.toString());
      console.log(`   ${idx + 1}. ${route.name} (${route.numberOfStops} stops) - ${routeBuses.length} bus(es)`);
      routeBuses.forEach(bus => {
        console.log(`      - ${bus.busNumber}`);
      });
    });
    console.log("\n📌 Green Line Transport (Mumbai):");
    greenBusRoutes.forEach((route, idx) => {
      const routeBuses = buses.filter(b => b.route.toString() === route._id.toString());
      console.log(`   ${idx + 1}. ${route.name} (${route.numberOfStops} stops) - ${routeBuses.length} bus(es)`);
      routeBuses.forEach(bus => {
        console.log(`      - ${bus.busNumber}`);
      });
    });
    console.log("\n" + "=".repeat(60));
    console.log("📍 ROUTE DETAILS WITH STOPS");
    console.log("=".repeat(60));
    routes.forEach((route, idx) => {
      console.log(`\n${idx + 1}. ${route.name} (${route.distanceKm} km, ${route.estimatedTime})`);
      console.log(`   Stops (${route.stops.length}):`);
      route.stops.forEach((stop, stopIdx) => {
        console.log(`   ${stopIdx + 1}. ${stop.stopName} (${stop.latitude}, ${stop.longitude})`);
      });
    });
    console.log("\n" + "=".repeat(60));
    console.log("LOGIN CREDENTIALS");
    console.log("=".repeat(60));
    console.log("\nSuper Admin:");
    console.log(`  Email: superadmin@whereisbus.com`);
    console.log(`  Password: SuperAdmin123!`);
    console.log("\nBus Organization Admins:");
    admins.forEach((admin, index) => {
      console.log(`\n  ${index + 1}. ${admin.organizationName}`);
      console.log(`     Email: ${admin.email}`);
      console.log(`     Password: Admin123!`);
    });
    console.log("\nDrivers:");
    drivers.forEach((driver, index) => {
      console.log(`\n  ${index + 1}. ${driver.name}`);
      console.log(`     Email: ${driver.email}`);
      console.log(`     Password: Driver123!`);
      console.log(`     Assigned Bus: ${driver.assignedBus ? 'Yes' : 'No'}`);
    });
    console.log("\n" + "=".repeat(60));
    console.log("✅ Seed data created successfully!");
    console.log("=".repeat(60));
    console.log("\n💡 NOTE: Users can only search and track buses for the routes listed above.");
    console.log("   Each route has buses assigned to it. Search using stop names from the routes.");
    console.log("=".repeat(60));

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Run seed function
seedData();

