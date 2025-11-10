# User Search Guide

## Available Routes and Stops

⚠️ **IMPORTANT**: Buses are **ONLY** available for the routes listed below. Users can only search and track buses using stop names from these routes.

## How to Search

1. Enter the **exact stop name** or a **partial match** in the "From Station" field
2. Enter the **exact stop name** or a **partial match** in the "To Station" field
3. Click "Find Buses"
4. The system will show all buses available for routes between those stops

## Search Features

- **Case-insensitive**: "majestic" will match "Majestic Bus Station"
- **Partial matching**: "ITPL" will match "ITPL" or "ITPL Main Gate"
- **Shows all buses**: Includes scheduled (offline), active, and ongoing buses
- **Real-time updates**: Once a bus starts its trip, you'll see live location updates

## Available Stops by City

### Bangalore (Red Bus Services)

**Route 1: Majestic to ITPL**
- Majestic Bus Station
- Kempegowda Bus Stand
- Corporation Circle
- Richmond Circle
- MG Road
- Trinity Circle
- Indiranagar
- Marathahalli
- Graphite India
- ITPL

**Route 2: City Center to Airport**
- City Center
- Vidhana Soudha
- Hebbal
- Yelahanka
- Bagalur Cross
- Devanahalli
- Airport Terminal 1
- Airport Terminal 2

**Route 3: Electronic City to Whitefield**
- Electronic City
- Hosur Road
- Bommanahalli
- HSR Layout
- Koramangala
- Indiranagar
- KR Puram
- Marathahalli
- Kundalahalli
- Hopefarm
- ITPL Main Gate
- Whitefield

### Delhi/NCR (Government Bus Corporation)

**Route 1: Delhi Central to Noida**
- Delhi Central Station
- New Delhi Railway Station
- Connaught Place
- India Gate
- ITO
- Laxmi Nagar
- Preet Vihar
- Mayur Vihar
- Noida Sector 18
- Noida City Center

**Route 2: Delhi to Gurgaon**
- Dhaula Kuan
- IGI Airport
- Mahipalpur
- Dwarka Sector 21
- Gurgaon Bus Stand
- Gurgaon Sector 14
- Gurgaon Sector 29
- DLF Cyber City
- Gurgaon Sector 56

**Route 3: Old Delhi to Dwarka**
- Old Delhi Railway Station
- Chandni Chowk
- Red Fort
- Kashmere Gate
- ISBT Kashmere Gate
- Rohini
- Pitampura
- Janakpuri
- Dwarka Sector 10
- Dwarka Sector 21
- Dwarka Sector 25

### Mumbai (Green Line Transport)

**Route 1: Mumbai CST to Andheri**
- CST Station
- Fort
- Marine Lines
- Churchgate
- Grant Road
- Dadar
- Bandra
- Santacruz
- Vile Parle
- Juhu
- Versova
- Andheri

**Route 2: Bandra to Thane**
- Bandra
- Khar
- Santacruz
- Vile Parle
- Andheri
- Goregaon
- Malad
- Kandivali
- Borivali
- Thane

**Route 3: Colaba to Powai**
- Colaba
- Nariman Point
- Marine Drive
- Churchgate
- Grant Road
- Dadar
- Sion
- Kurla
- Bhandup
- Vikhroli
- Powai

## Example Searches

✅ **Working Examples:**
- From: "Majestic Bus Station" → To: "ITPL"
- From: "Delhi Central" → To: "Noida"
- From: "CST" → To: "Andheri"
- From: "majestic" → To: "itpl" (case-insensitive)
- From: "MG Road" → To: "Indiranagar"

❌ **Not Working:**
- From: "Random Stop" → To: "Another Stop" (not in database)
- From: "ITPL" → To: "Majestic Bus Station" (reverse direction - must be in route order)

## API Endpoints

### Search Routes
```
GET /pi/routes?from=Majestic Bus Station&to=ITPL
```

### Get All Stops
```
GET /pi/stops
```
Returns all available stop names for reference.

### Get Buses by Route
```
GET /pi/bus/:routeId
```

### Calculate ETA
```
GET /pi/eta?busId=...&stopName=...
```

## Troubleshooting

### No buses showing up?

1. **Check stop names**: Make sure you're using stop names from the routes above
2. **Check direction**: The "from" stop must come before the "to" stop in the route
3. **Case sensitivity**: Search is case-insensitive, but spelling must be correct
4. **Bus status**: All buses (offline, active, ongoing) are shown, so if no buses appear, they may not be assigned to that route

### Getting 404 on /pi/me?

- This is normal if you're not logged in
- The endpoint now returns `{ user: null }` instead of 404 for unauthenticated users
- User section works without authentication

### Buses showing as "Scheduled"?

- Buses start with status "offline" (scheduled)
- When a driver starts a trip, status changes to "ongoing"
- Users can see scheduled buses to know when they'll depart

## Notes

- Each route has 1-2 buses assigned
- Buses are assigned to specific drivers
- Real-time tracking starts when driver starts the trip
- All buses show scheduled departure times

