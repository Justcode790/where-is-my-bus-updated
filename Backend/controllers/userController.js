const Route = require("../models/Route");
const Bus = require("../models/Bus");

// Get all available stops (for autocomplete/search help)
exports.getAllStops = async (req, res) => {
  try {
    const routes = await Route.find({});
    const allStops = new Set();
    
    routes.forEach(route => {
      route.stops.forEach(stop => {
        allStops.add(stop.stopName);
      });
    });
    
    res.json({ 
      stops: Array.from(allStops).sort(),
      totalStops: allStops.size,
      totalRoutes: routes.length
    });
  } catch (err) {
    console.error("Get All Stops Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Search routes between two stops
exports.searchRoutes = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ msg: "Both 'from' and 'to' parameters are required" });
    }

    console.log(`🔍 Searching routes from "${from}" to "${to}"`);

    // Find all routes
    const routes = await Route.find({}).populate("adminId", "name organizationName");
    console.log(`📊 Found ${routes.length} total routes in database`);

    // Filter routes where 'from' comes before 'to' (case-insensitive matching)
    const validRoutes = routes.filter((route) => {
      const fromIndex = route.stops.findIndex((s) => {
        const stopNameLower = s.stopName.toLowerCase().trim();
        const fromLower = from.toLowerCase().trim();
        return stopNameLower === fromLower || 
               stopNameLower.includes(fromLower) || 
               fromLower.includes(stopNameLower);
      });
      const toIndex = route.stops.findIndex((s) => {
        const stopNameLower = s.stopName.toLowerCase().trim();
        const toLower = to.toLowerCase().trim();
        return stopNameLower === toLower || 
               stopNameLower.includes(toLower) || 
               toLower.includes(stopNameLower);
      });
      
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
        console.log(`✅ Found matching route: ${route.name} (${route.stops[fromIndex].stopName} → ${route.stops[toIndex].stopName})`);
        return true;
      }
      return false;
    });

    console.log(`✅ Found ${validRoutes.length} valid routes`);

    if (validRoutes.length === 0) {
      return res.json({ 
        routes: [],
        message: `No routes found from "${from}" to "${to}". Please check the stop names.`
      });
    }

    // Get buses for these routes
    // Note: Include all buses (offline, active, ongoing) so users can see scheduled buses
    const routeIds = validRoutes.map((r) => r._id);
    const buses = await Bus.find({
      route: { $in: routeIds },
      // Remove status filter to show all buses, including scheduled ones (offline status)
      // Users can see buses that are scheduled, active, or currently running
    })
      .populate("route")
      .populate("adminId", "name organizationName")
      .populate("driver", "name");
    
    console.log(`🚌 Found ${buses.length} buses for ${validRoutes.length} routes`);

    // Format response
    const response = validRoutes.map((route) => {
      const routeBuses = buses.filter(
        (bus) => bus.route._id.toString() === route._id.toString()
      );

      // Find matching stops (case-insensitive)
      const fromStopIndex = route.stops.findIndex((s) => 
        s.stopName.toLowerCase().includes(from.toLowerCase()) || 
        from.toLowerCase().includes(s.stopName.toLowerCase())
      );
      const toStopIndex = route.stops.findIndex((s) => 
        s.stopName.toLowerCase().includes(to.toLowerCase()) || 
        to.toLowerCase().includes(s.stopName.toLowerCase())
      );

      return {
        routeId: route._id,
        routeName: route.name,
        fromStop: route.stops[fromStopIndex],
        toStop: route.stops[toStopIndex],
        distanceKm: route.distanceKm,
        estimatedTime: route.estimatedTime,
        numberOfStops: route.numberOfStops,
        stops: route.stops, // Include all stops for the route
        buses: routeBuses.map((bus) => ({
          busId: bus._id,
          busNumber: bus.busNumber,
          status: bus.status,
          tripStatus: bus.tripStatus,
          currentLocation: bus.currentLocation,
          speed: bus.speed,
          scheduledDepartureTime: bus.scheduledDepartureTime,
          actualDepartureTime: bus.actualDepartureTime,
          organizationName: bus.adminId?.organizationName,
          driverName: bus.driver?.name,
        })),
      };
    });

    res.json({ routes: response });
  } catch (err) {
    console.error("Search Routes Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get buses for a specific route
exports.getBusesByRoute = async (req, res) => {
  try {
    const { routeId } = req.params;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ msg: "Route not found" });
    }

    // Get all buses for this route (including offline/scheduled buses)
    const buses = await Bus.find({
      route: routeId,
      // Remove status filter to show all buses
    })
      .populate("route")
      .populate("adminId", "name organizationName")
      .populate("driver", "name licenseNumber");

    res.json({
      route: {
        id: route._id,
        name: route.name,
        stops: route.stops,
        distanceKm: route.distanceKm,
        estimatedTime: route.estimatedTime,
      },
      buses: buses.map((bus) => ({
        busId: bus._id,
        busNumber: bus.busNumber,
        status: bus.status,
        tripStatus: bus.tripStatus,
        currentLocation: bus.currentLocation,
        speed: bus.speed,
        passengers: bus.passengers,
        capacity: bus.capacity,
        scheduledDepartureTime: bus.scheduledDepartureTime,
        actualDepartureTime: bus.actualDepartureTime,
        lastLocationUpdate: bus.lastLocationUpdate,
        organizationName: bus.adminId?.organizationName,
        driver: bus.driver ? {
          name: bus.driver.name,
          licenseNumber: bus.driver.licenseNumber,
        } : null,
      })),
    });
  } catch (err) {
    console.error("Get Buses By Route Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Calculate ETA for a specific stop
exports.calculateETA = async (req, res) => {
  try {
    const { busId, stopName } = req.query;

    if (!busId || !stopName) {
      return res.status(400).json({ msg: "busId and stopName are required" });
    }

    const bus = await Bus.findById(busId).populate("route");
    if (!bus) {
      return res.status(404).json({ msg: "Bus not found" });
    }

    const route = bus.route;
    if (!route) {
      return res.status(404).json({ msg: "Route not found" });
    }

    const stop = route.stops.find((s) => s.stopName === stopName);
    if (!stop) {
      return res.status(404).json({ msg: "Stop not found in route" });
    }

    const currentStopIndex = route.stops.findIndex(
      (s) =>
        Math.abs(s.latitude - bus.currentLocation.lat) < 0.01 &&
        Math.abs(s.longitude - bus.currentLocation.lng) < 0.01
    );

    const targetStopIndex = route.stops.findIndex((s) => s.stopName === stopName);

    if (targetStopIndex === -1) {
      return res.status(404).json({ msg: "Stop not found in route" });
    }

    // Calculate distance remaining
    let distanceRemaining = 0;
    const startIndex = currentStopIndex >= 0 ? currentStopIndex : 0;

    for (let i = startIndex; i < targetStopIndex; i++) {
      const stop1 = route.stops[i];
      const stop2 = route.stops[i + 1];
      // Simple distance calculation (Haversine would be more accurate)
      const latDiff = stop2.latitude - stop1.latitude;
      const lngDiff = stop2.longitude - stop1.longitude;
      distanceRemaining += Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // rough km conversion
    }

    // Calculate ETA based on current speed
    const avgSpeed = bus.speed > 0 ? bus.speed : 30; // default 30 km/h
    const etaMinutes = Math.round((distanceRemaining / avgSpeed) * 60);

    res.json({
      busId: bus._id,
      busNumber: bus.busNumber,
      stopName,
      distanceRemaining: Math.round(distanceRemaining * 10) / 10,
      etaMinutes,
      currentLocation: bus.currentLocation,
      currentSpeed: bus.speed,
    });
  } catch (err) {
    console.error("Calculate ETA Error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

