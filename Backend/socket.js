const Bus = require("./models/Bus");
const Driver = require("./models/Driver");

function initializeSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Driver sends location update
    socket.on("driverLocationUpdate", async (data) => {
      try {
        const { busId, lat, lng, speed } = data;

        // Update bus location in database
        const bus = await Bus.findById(busId);
        if (bus) {
          bus.currentLocation = { lat, lng };
          if (speed !== undefined) bus.speed = speed;
          bus.lastLocationUpdate = new Date();
          await bus.save();

          // Broadcast to all clients (admins, users, super admin)
          io.emit("busLocationUpdate", {
            busId: bus._id,
            busNumber: bus.busNumber,
            location: { lat, lng },
            speed: bus.speed,
            status: bus.status,
            tripStatus: bus.tripStatus,
            lastUpdate: bus.lastLocationUpdate,
          });
        }
      } catch (err) {
        console.error("Error handling driverLocationUpdate:", err.message);
      }
    });

    // Driver starts trip
    socket.on("busStarted", async (data) => {
      try {
        const { busId, lat, lng } = data;

        const bus = await Bus.findById(busId);
        if (bus) {
          bus.status = "ongoing";
          bus.tripStatus = "in-progress";
          bus.actualDepartureTime = new Date();
          bus.currentLocation = { lat, lng };
          bus.lastLocationUpdate = new Date();
          await bus.save();

          // Notify admins and super admin
          io.emit("busStartedNotification", {
            busId: bus._id,
            busNumber: bus.busNumber,
            adminId: bus.adminId,
            location: { lat, lng },
            startedAt: bus.actualDepartureTime,
          });
        }
      } catch (err) {
        console.error("Error handling busStarted:", err.message);
      }
    });

    // Driver stops trip
    socket.on("busStopped", async (data) => {
      try {
        const { busId } = data;

        const bus = await Bus.findById(busId);
        if (bus) {
          bus.status = "offline";
          bus.tripStatus = "completed";
          await bus.save();

          // Notify admins and super admin
          io.emit("busStoppedNotification", {
            busId: bus._id,
            busNumber: bus.busNumber,
            adminId: bus.adminId,
            stoppedAt: new Date(),
          });
        }
      } catch (err) {
        console.error("Error handling busStopped:", err.message);
      }
    });

    // Join room for specific bus tracking
    socket.on("joinBusRoom", (busId) => {
      socket.join(`bus-${busId}`);
      console.log(`Socket ${socket.id} joined bus room: bus-${busId}`);
    });

    // Leave bus room
    socket.on("leaveBusRoom", (busId) => {
      socket.leave(`bus-${busId}`);
      console.log(`Socket ${socket.id} left bus room: bus-${busId}`);
    });

    // Join room for admin dashboard
    socket.on("joinAdminRoom", (adminId) => {
      socket.join(`admin-${adminId}`);
      console.log(`Socket ${socket.id} joined admin room: admin-${adminId}`);
    });

    // Driver goes offline
    socket.on("driverOffline", async (data) => {
      try {
        const { driverId } = data;

        const driver = await Driver.findById(driverId);
        if (driver && driver.assignedBus) {
          const bus = await Bus.findById(driver.assignedBus);
          if (bus) {
            bus.status = "offline";
            await bus.save();

            // Notify admin
            io.to(`admin-${bus.adminId}`).emit("driverOfflineNotification", {
              busId: bus._id,
              busNumber: bus.busNumber,
              driverId: driver._id,
              driverName: driver.name,
            });
          }
        }
      } catch (err) {
        console.error("Error handling driverOffline:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
}

module.exports = initializeSocket;

