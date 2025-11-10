# Data Model Mapping & Relationships

This document explains the relationships between all models in the "Where Is My Bus" system.

## Entity Relationship Diagram

```
SuperAdmin (1)
    │
    │ (manages)
    │
    ▼
Admin (N) ────────────┐
    │                 │
    │ (owns)          │ (owns)
    │                 │
    ▼                 ▼
Route (N)          Driver (N)
    │                 │
    │                 │ (assigned to)
    │                 │
    └─────┬───────────┘
          │
          ▼
       Bus (1)
```

## Detailed Relationships

### 1. SuperAdmin → Admin (One-to-Many)
- **SuperAdmin** manages multiple **Admins** (bus organizations)
- SuperAdmin can view, manage, and delete Admins
- No direct foreign key in Admin model (managed through controllers)

**Example:**
```javascript
SuperAdmin {
  _id: ObjectId("...")
  name: "System Administrator"
  email: "superadmin@whereisbus.com"
}

Admin {
  _id: ObjectId("...")
  organizationName: "Red Bus Services"
  // No direct SuperAdmin reference
}
```

### 2. Admin → Route (One-to-Many)
- Each **Admin** (bus organization) owns multiple **Routes**
- Route has `adminId` field referencing Admin

**Example:**
```javascript
Admin {
  _id: ObjectId("admin123")
  organizationName: "Red Bus Services"
}

Route {
  _id: ObjectId("route456")
  adminId: ObjectId("admin123")  // ← References Admin
  name: "Majestic to ITPL"
  stops: [...]
}
```

### 3. Admin → Driver (One-to-Many)
- Each **Admin** employs multiple **Drivers**
- Driver has `adminId` field referencing Admin

**Example:**
```javascript
Admin {
  _id: ObjectId("admin123")
  organizationName: "Red Bus Services"
}

Driver {
  _id: ObjectId("driver789")
  adminId: ObjectId("admin123")  // ← References Admin
  name: "Ramesh Singh"
  licenseNumber: "DL-123456"
}
```

### 4. Admin → Bus (One-to-Many)
- Each **Admin** owns multiple **Buses**
- Bus has `adminId` field referencing Admin

**Example:**
```javascript
Admin {
  _id: ObjectId("admin123")
  organizationName: "Red Bus Services"
}

Bus {
  _id: ObjectId("bus101")
  adminId: ObjectId("admin123")  // ← References Admin
  busNumber: "KA-01-AB-1234"
}
```

### 5. Route → Bus (One-to-Many)
- Each **Route** can have multiple **Buses** assigned
- Bus has `route` field referencing Route

**Example:**
```javascript
Route {
  _id: ObjectId("route456")
  name: "Majestic to ITPL"
  stops: [...]
}

Bus {
  _id: ObjectId("bus101")
  route: ObjectId("route456")  // ← References Route
  busNumber: "KA-01-AB-1234"
}
```

### 6. Driver → Bus (One-to-One)
- Each **Driver** is assigned to one **Bus**
- Each **Bus** has one **Driver**
- Driver has `assignedBus` field
- Bus has `driver` field

**Example:**
```javascript
Driver {
  _id: ObjectId("driver789")
  name: "Ramesh Singh"
  assignedBus: ObjectId("bus101")  // ← References Bus
}

Bus {
  _id: ObjectId("bus101")
  busNumber: "KA-01-AB-1234"
  driver: ObjectId("driver789")  // ← References Driver
}
```

### 7. Route → Stops (One-to-Many, Embedded)
- Each **Route** contains multiple **Stops** (embedded document)
- Stops are stored as an array within the Route document

**Example:**
```javascript
Route {
  _id: ObjectId("route456")
  name: "Majestic to ITPL"
  stops: [
    {
      stopName: "Majestic Bus Station",
      latitude: 12.9772,
      longitude: 77.5683,
      stopOrder: 1
    },
    {
      stopName: "ITPL",
      latitude: 12.9000,
      longitude: 77.7500,
      stopOrder: 8
    }
  ]
}
```

## Complete Data Flow Example

### Scenario: A bus trip from start to finish

1. **SuperAdmin** creates/manages **Admin** (Red Bus Services)
2. **Admin** creates:
   - **Route**: "Majestic to ITPL" with 8 stops
   - **Driver**: Ramesh Singh
   - **Bus**: KA-01-AB-1234
3. **Admin** assigns:
   - **Driver** to **Bus** (one-to-one relationship)
   - **Bus** to **Route** (many buses can use same route)
4. **Driver** logs in and sees assigned **Bus** and **Route**
5. **Driver** starts trip:
   - Updates **Bus** status to "ongoing"
   - Sends GPS location via Socket.IO
   - Location updates **Bus.currentLocation**
6. **User** searches for route "Majestic to ITPL"
   - System finds **Route** and associated **Buses**
   - User sees real-time **Bus** location via Socket.IO
   - System calculates ETA based on **Bus.currentLocation** and **Route.stops**

## Model Field Mappings

### SuperAdmin
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "superadmin"
}
```

### Admin
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  organizationName: String,
  phone: String,
  address: String,
  role: "admin",
  isActive: Boolean,
  verificationStatus: "approved" | "pending" | "rejected"
}
```

### Driver
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  licenseNumber: String (unique),
  phone: String,
  experience: Number,
  adminId: ObjectId (ref: "Admin"),      // ← Admin relationship
  assignedBus: ObjectId (ref: "Bus"),    // ← Bus relationship
  isActive: Boolean,
  role: "driver"
}
```

### Route
```javascript
{
  name: String,
  adminId: ObjectId (ref: "Admin"),       // ← Admin relationship
  numberOfStops: Number,
  stops: [                                // ← Embedded stops
    {
      stopName: String,
      latitude: Number,
      longitude: Number,
      stopOrder: Number
    }
  ],
  distanceKm: Number,
  estimatedTime: String
}
```

### Bus
```javascript
{
  busNumber: String (unique),
  capacity: Number,
  adminId: ObjectId (ref: "Admin"),       // ← Admin relationship
  route: ObjectId (ref: "Route"),        // ← Route relationship
  driver: ObjectId (ref: "Driver"),      // ← Driver relationship
  currentLocation: {
    lat: Number,
    lng: Number
  },
  speed: Number,
  passengers: Number,
  status: "active" | "offline" | "ongoing" | "maintenance",
  tripStatus: "not-started" | "in-progress" | "completed" | "cancelled",
  scheduledDepartureTime: Date,
  actualDepartureTime: Date,
  lastLocationUpdate: Date
}
```

## Populate Queries

### Get Admin with all related data
```javascript
const admin = await Admin.findById(adminId)
  .populate('buses')  // Not directly, need to query separately
  .populate('routes') // Not directly, need to query separately
  .populate('drivers'); // Not directly, need to query separately

// Better approach:
const admin = await Admin.findById(adminId);
const buses = await Bus.find({ adminId: admin._id })
  .populate('route')
  .populate('driver');
const routes = await Route.find({ adminId: admin._id });
const drivers = await Driver.find({ adminId: admin._id });
```

### Get Bus with full details
```javascript
const bus = await Bus.findById(busId)
  .populate('adminId', 'name organizationName')
  .populate('route')
  .populate('driver', 'name licenseNumber phone');
```

### Get Driver with assigned bus
```javascript
const driver = await Driver.findById(driverId)
  .populate('adminId', 'name organizationName')
  .populate('assignedBus')
    .populate('route');
```

### Get Route with buses
```javascript
const route = await Route.findById(routeId)
  .populate('adminId', 'name organizationName');

const buses = await Bus.find({ route: routeId })
  .populate('driver');
```

## Indexes for Performance

Recommended indexes for better query performance:

```javascript
// Admin model
adminSchema.index({ email: 1 });
adminSchema.index({ organizationName: 1 });

// Driver model
driverSchema.index({ email: 1 });
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ adminId: 1 });
driverSchema.index({ assignedBus: 1 });

// Route model
routeSchema.index({ adminId: 1 });
routeSchema.index({ 'stops.stopName': 1 });

// Bus model
busSchema.index({ busNumber: 1 });
busSchema.index({ adminId: 1 });
busSchema.index({ route: 1 });
busSchema.index({ driver: 1 });
busSchema.index({ status: 1 });
```

## Summary

- **SuperAdmin** → Manages → **Admins** (no direct FK)
- **Admin** → Owns → **Routes** (adminId in Route)
- **Admin** → Employs → **Drivers** (adminId in Driver)
- **Admin** → Owns → **Buses** (adminId in Bus)
- **Route** → Has → **Buses** (route in Bus)
- **Route** → Contains → **Stops** (embedded array)
- **Driver** ↔ **Bus** (one-to-one, bidirectional)

All relationships are properly mapped and can be queried using Mongoose populate() or separate queries.

