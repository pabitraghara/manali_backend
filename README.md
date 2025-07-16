# manali_backend

# Manali Hotel & Package Management API

A comprehensive NestJS backend application for managing hotels, travel packages, and schedules in Manali. This API supports both local authentication and Google OAuth, with role-based access control for admin and regular users.

## 🚀 Features

- **Authentication & Authorization**
  - Local signup/login with email and password
  - Google OAuth 2.0 integration
  - JWT-based authentication
  - Role-based access control (Admin/User)

- **Hotel Management**
  - CRUD operations for hotels
  - Hotel scheduling system
  - Availability checking
  - Location-based filtering
  - Price and rating filters

- **Package Management**
  - Travel package creation and management
  - Package scheduling with date ranges
  - Availability management
  - Featured packages
  - Multi-criteria filtering

- **Admin Features**
  - Admin-only hotel and package creation
  - Schedule management for hotels and packages
  - User management capabilities

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Local & Google OAuth)
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **ORM**: TypeORM

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- Google Cloud Console account (for OAuth)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd manali_backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**

   ```bash
   # Create database
   createdb manali_db
   ```

4. **Configure environment variables**
   Update the `.env` file with your configurations:

   ```env
   # Database Configuration
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=manali_db

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

   # Application Configuration
   PORT=3000
   NODE_ENV=development
   ```

5. **Set up Google OAuth**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/auth/google/callback`
   - Update the `.env` file with your client ID and secret

6. **Run database migrations and seed data**
   ```bash
   npm run start:dev  # This will create tables automatically
   npm run seed      # This will create an admin user
   ```

## 🚀 Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at:

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api

## 👤 Default Admin Credentials

After running the seed command, you can login with:

- **Email**: admin@manali.com
- **Password**: admin123

## 📚 API Documentation

### Authentication Endpoints

#### Local Authentication

```bash
# Register new user
POST /auth/register
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

# Login
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Google OAuth

```bash
# Initiate Google OAuth
GET /auth/google

# Google callback (handled automatically)
GET /auth/google/callback
```

### Hotel Management

#### Create Hotel (Admin Only)

```bash
POST /hotels
Authorization: Bearer <jwt_token>
{
  "name": "Hotel Snow Peak",
  "description": "Luxury hotel with mountain views",
  "address": "Mall Road, Manali",
  "city": "Manali",
  "state": "Himachal Pradesh",
  "pincode": "175131",
  "phone": "+91-1902-252000",
  "email": "info@snowpeak.com",
  "pricePerNight": 5000,
  "totalRooms": 50,
  "availableRooms": 45,
  "type": "luxury",
  "amenities": ["WiFi", "Swimming Pool", "Spa"],
  "latitude": 32.2396,
  "longitude": 77.1887
}
```

#### Get All Hotels

```bash
GET /hotels?page=1&limit=10&city=Manali&type=luxury&minPrice=1000&maxPrice=10000
```

#### Create Hotel Schedule

```bash
POST /hotels/{hotelId}/schedules
Authorization: Bearer <jwt_token>
{
  "date": "2024-12-25",
  "availableRooms": 10,
  "specialPrice": 6000,
  "status": "available"
}
```

### Package Management

#### Create Package (Admin Only)

```bash
POST /packages
Authorization: Bearer <jwt_token>
{
  "name": "Manali Adventure Package",
  "description": "Complete adventure package with trekking and river rafting",
  "highlights": "Trekking, River Rafting, Paragliding",
  "itinerary": "Day 1: Arrival\nDay 2: Adventure activities",
  "duration": 4,
  "nights": 3,
  "price": 15000,
  "maxGroupSize": 20,
  "type": "adventure",
  "inclusions": ["Accommodation", "Meals", "Transportation"],
  "destinations": ["Manali", "Solang Valley", "Rohtang Pass"]
}
```

#### Get All Packages

```bash
GET /packages?page=1&limit=10&type=adventure&minPrice=5000&maxPrice=20000
```

#### Create Package Schedule

```bash
POST /packages/{packageId}/schedules
Authorization: Bearer <jwt_token>
{
  "startDate": "2024-12-25",
  "endDate": "2024-12-28",
  "availableSlots": 15,
  "specialPrice": 16000,
  "pickupLocation": "Mall Road, Manali",
  "pickupTime": "06:00:00"
}
```

### Search & Availability

#### Search Available Hotels

```bash
GET /hotels/available/search?checkIn=2024-12-25&checkOut=2024-12-28
```

#### Search Available Packages

```bash
GET /packages/available/search?startDate=2024-12-25&endDate=2024-12-28
```

#### Get Featured Packages

```bash
GET /packages/featured?limit=6
```

## 🔒 Authentication & Authorization

### JWT Token Usage

Include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access

- **Admin**: Can create, update, and delete hotels and packages
- **User**: Can view hotels and packages, manage their own bookings (future feature)

## 🗄️ Database Schema

### Users Table

- id (UUID, Primary Key)
- email (Unique)
- name
- password (nullable for OAuth users)
- role (admin/user)
- provider (local/google)
- googleId (nullable)
- avatar (nullable)
- isActive
- createdAt, updatedAt

### Hotels Table

- id (UUID, Primary Key)
- name, description, address, city, state, pincode
- phone, email
- pricePerNight, totalRooms, availableRooms
- type, status, amenities, images
- rating, reviewCount
- latitude, longitude
- createdBy (Foreign Key to Users)
- createdAt, updatedAt

### Hotel Schedules Table

- id (UUID, Primary Key)
- date
- availableRooms, bookedRooms
- specialPrice, status, notes
- hotelId (Foreign Key to Hotels)
- createdBy (Foreign Key to Users)
- createdAt, updatedAt

### Packages Table

- id (UUID, Primary Key)
- name, description, highlights, itinerary
- duration, nights, price, originalPrice
- maxGroupSize, minGroupSize
- type, status
- inclusions, exclusions, images, destinations
- rating, reviewCount
- terms, cancellationPolicy
- createdBy (Foreign Key to Users)
- createdAt, updatedAt

### Package Schedules Table

- id (UUID, Primary Key)
- startDate, endDate
- availableSlots, bookedSlots
- specialPrice, status, notes
- pickupLocation, pickupTime
- packageId (Foreign Key to Packages)
- createdBy (Foreign Key to Users)
- createdAt, updatedAt

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Update database credentials
3. Set secure JWT secret
4. Configure Google OAuth for production domain

### Build and Run

```bash
npm run build
npm run start:prod
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the UNLICENSED License.

## 🆘 Support

For support and questions, please create an issue in the repository.

---

**Happy Coding! 🏔️**
