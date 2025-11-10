const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const initializeSocket = require("./socket");

const userRoutes = require("./routes/userRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const driverRoutes = require("./routes/driverRoutes");
const adminRoutes = require("./routes/adminRoutes");
const superAdminRoutes = require("./routes/superAdminRoutes");

dotenv.config();
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize socket handlers
initializeSocket(io);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "supersecretkey",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60
  }
}));

// Routes
app.use("/superadmin", superAdminRoutes);
app.use("/admin", adminRoutes);
app.use("/driver", driverRoutes);
app.use("/pi/official/buses", busRoutes);
app.use("/pi/official/routes", routeRoutes);
// Note: Driver routes are now under /driver, not /pi/official/drivers
app.use("/pi", userRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working fine with Socket.IO!");
});

// Connect DB and start server
connectDB();
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
  console.log(`Socket.IO server initialized`);
});





// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");
// const cors = require("cors");
// const busRoutes = require("./routes/busRoutes");
// const routeRoutes = require("./routes/routeRoutes");
// const driverRoutes = require("./routes/driverRoutes");
// const cookieParser = require("cookie-parser");

// dotenv.config();

// // Middleware
// app.use(cors({
//   origin: "http://localhost:5173",  // frontend origin
//   credentials: true,                // allow cookies to be sent
// }));
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use("/pi/official/buses", busRoutes);
// app.use("/pi/official/routes", routeRoutes);
// app.use("/pi/official/drivers", driverRoutes);
// app.use("/pi", userRoutes);

// app.get("/", (req, res) => {
//   res.send("Backend is working fine with cookies ✅");
// });

// // Connect DB and start server
// connectDB();
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Backend running on port ${port}`));
