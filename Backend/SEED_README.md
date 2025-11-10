# Database Seed File

This seed file populates the database with sample data for testing and development.

## What Gets Created

1. **1 Super Admin** - System administrator account
2. **3 Bus Organizations (Admins)** - Different bus service providers
3. **9 Routes** - Various bus routes with stops (Bangalore, Delhi, Mumbai)
4. **15 Drivers** - Assigned to different organizations
5. **15 Buses** - Assigned to routes and drivers

⚠️ **IMPORTANT**: Buses are **ONLY** available for the routes created in this seed file. Users can only search and track buses for these specific routes.

## How to Run

Make sure you have:
1. MongoDB connection string in your `.env` file
2. All dependencies installed (`npm install`)

Then run:
```bash
npm run seed
```

Or directly:
```bash
node seed.js
```

## Login Credentials

### Super Admin
- **Email:** `superadmin@whereisbus.com`
- **Password:** `SuperAdmin123!`

### Bus Organization Admins

#### 1. Red Bus Services
- **Email:** `rajesh@redbus.com`
- **Password:** `Admin123!`

#### 2. Government Bus Corporation
- **Email:** `priya@govtbus.com`
- **Password:** `Admin123!`

#### 3. Green Line Transport
- **Email:** `amit@greenbus.com`
- **Password:** `Admin123!`

### Drivers

All drivers use the password: `Driver123!`

#### Red Bus Services (5 drivers)
1. **Ramesh Singh** - `ramesh.driver@redbus.com` - Assigned to KA-01-AB-1234
2. **Suresh Kumar** - `suresh.driver@redbus.com` - Assigned to KA-01-CD-5678
3. **Mahesh Yadav** - `mahesh.driver@redbus.com` - Assigned to KA-01-EF-9012
4. **Rajesh Kumar** - `rajesh.driver@redbus.com` - Assigned to KA-01-GH-3456
5. **Vikash Sharma** - `vikash.driver@redbus.com` - Assigned to KA-01-IJ-7890

#### Government Bus Corporation (5 drivers)
6. **Vikram Mehta** - `vikram.driver@govtbus.com` - Assigned to DL-01-GH-3456
7. **Anil Verma** - `anil.driver@govtbus.com` - Assigned to DL-01-IJ-7890
8. **Rohit Gupta** - `rohit.driver@govtbus.com` - Assigned to DL-01-KL-2345
9. **Sandeep Singh** - `sandeep.driver@govtbus.com` - Assigned to DL-01-MN-6789
10. **Manoj Kumar** - `manoj.driver@govtbus.com` - Assigned to DL-01-OP-0123

#### Green Line Transport (5 drivers)
11. **Sunil Desai** - `sunil.driver@greenbus.com` - Assigned to MH-01-KL-2345
12. **Ravi Joshi** - `ravi.driver@greenbus.com` - Assigned to MH-01-MN-6789
13. **Ajay Patil** - `ajay.driver@greenbus.com` - Assigned to MH-01-QR-4567
14. **Nitin Sawant** - `nitin.driver@greenbus.com` - Assigned to MH-01-ST-8901
15. **Prakash Gaikwad** - `prakash.driver@greenbus.com` - Assigned to MH-01-UV-2345

## Data Structure

### Routes Created

⚠️ **NOTE**: Buses are **ONLY** assigned to these routes. Users can only search using stop names from these routes.

#### Red Bus Services (Bangalore) - 3 Routes

1. **Majestic to ITPL**
   - 10 stops: Majestic Bus Station → Kempegowda Bus Stand → Corporation Circle → Richmond Circle → MG Road → Trinity Circle → Indiranagar → Marathahalli → Graphite India → ITPL
   - Distance: 28.5 km | Time: 50 mins
   - **2 buses assigned**: KA-01-AB-1234, KA-01-CD-5678

2. **City Center to Airport**
   - 8 stops: City Center → Vidhana Soudha → Hebbal → Yelahanka → Bagalur Cross → Devanahalli → Airport Terminal 1 → Airport Terminal 2
   - Distance: 38.0 km | Time: 65 mins
   - **1 bus assigned**: KA-01-EF-9012

3. **Electronic City to Whitefield**
   - 12 stops: Electronic City → Hosur Road → Bommanahalli → HSR Layout → Koramangala → Indiranagar → KR Puram → Marathahalli → Kundalahalli → Hopefarm → ITPL Main Gate → Whitefield
   - Distance: 42.0 km | Time: 75 mins
   - **2 buses assigned**: KA-01-GH-3456, KA-01-IJ-7890

#### Government Bus Corporation (Delhi/NCR) - 3 Routes

4. **Delhi Central to Noida**
   - 10 stops: Delhi Central Station → New Delhi Railway Station → Connaught Place → India Gate → ITO → Laxmi Nagar → Preet Vihar → Mayur Vihar → Noida Sector 18 → Noida City Center
   - Distance: 32.0 km | Time: 55 mins
   - **2 buses assigned**: DL-01-GH-3456, DL-01-IJ-7890

5. **Delhi to Gurgaon**
   - 9 stops: Dhaula Kuan → IGI Airport → Mahipalpur → Dwarka Sector 21 → Gurgaon Bus Stand → Gurgaon Sector 14 → Gurgaon Sector 29 → DLF Cyber City → Gurgaon Sector 56
   - Distance: 35.0 km | Time: 60 mins
   - **1 bus assigned**: DL-01-KL-2345

6. **Old Delhi to Dwarka**
   - 11 stops: Old Delhi Railway Station → Chandni Chowk → Red Fort → Kashmere Gate → ISBT Kashmere Gate → Rohini → Pitampura → Janakpuri → Dwarka Sector 10 → Dwarka Sector 21 → Dwarka Sector 25
   - Distance: 30.0 km | Time: 70 mins
   - **2 buses assigned**: DL-01-MN-6789, DL-01-OP-0123

#### Green Line Transport (Mumbai) - 3 Routes

7. **Mumbai CST to Andheri**
   - 12 stops: CST Station → Fort → Marine Lines → Churchgate → Grant Road → Dadar → Bandra → Santacruz → Vile Parle → Juhu → Versova → Andheri
   - Distance: 28.0 km | Time: 50 mins
   - **2 buses assigned**: MH-01-KL-2345, MH-01-MN-6789

8. **Bandra to Thane**
   - 10 stops: Bandra → Khar → Santacruz → Vile Parle → Andheri → Goregaon → Malad → Kandivali → Borivali → Thane
   - Distance: 35.0 km | Time: 65 mins
   - **1 bus assigned**: MH-01-QR-4567

9. **Colaba to Powai**
   - 11 stops: Colaba → Nariman Point → Marine Drive → Churchgate → Grant Road → Dadar → Sion → Kurla → Bhandup → Vikhroli → Powai
   - Distance: 32.0 km | Time: 70 mins
   - **2 buses assigned**: MH-01-ST-8901, MH-01-UV-2345

### Bus Assignments

- Each bus is assigned to:
  - An admin (bus organization)
  - A route (⚠️ **ONLY** the routes listed above)
  - A driver
  - Has scheduled departure times

### Total Count

- **9 Routes** with **81 stops** total
- **15 Buses** distributed across all routes
- **15 Drivers** (5 per organization)
- All buses are assigned to drivers and routes

## Notes

- The seed file will **clear all existing data** before seeding
- All passwords are hashed automatically by the models
- GPS coordinates are provided for all stops
- Scheduled departure times are set to future times (1-8 hours from now)
- All buses start with status "offline" and tripStatus "not-started"
- ⚠️ **IMPORTANT**: Buses are **ONLY** available for the 9 routes created above
- Users can only search for routes using stop names from these routes
- Each route has 1-2 buses assigned to it
- All drivers have buses assigned to them

## Customization

You can modify the seed file (`seed.js`) to:
- Add more organizations
- Create additional routes
- Add more drivers and buses
- Change the sample data

After modifications, run `npm run seed` again to update the database.

