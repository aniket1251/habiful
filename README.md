<p align="center">
  <img src="client/public/navLogo.svg" alt="Habiful Logo" width="60" />
</p>

<h1 align="center">Habiful</h1>

<p align="center">
  A full-stack rental property discovery platform connecting tenants with verified listings and property managers with streamlined tenant management.
</p>

<p align="center">
  <a href="https://habiful.vercel.app"><img src="https://img.shields.io/badge/🔗_Live_Demo-Visit_Habiful-dc2828?style=for-the-badge" alt="Live Demo" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/AWS-EC2_|_S3_| RDS-FF9900?logo=amazonaws" alt="AWS" />
</p>

---

## Preview

<p align="center">
  <img src="https://res.cloudinary.com/dsouhrbvy/image/upload/v1773672748/Screenshot_42_vhokit.png" alt="Habiful Search Page" width="100%" />
</p>

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User                                │
└──────────────────────────┬──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   Next.js 15 (React 19) │
              │   Mapbox GL · Redux     │
              └────────────┬────────────┘
                           │ REST API
              ┌────────────▼────────────┐
              │   Express 5 (Node.js)   │
              │   AWS EC2               │
              │   JWT Auth · Multer     │
              └──┬─────────┬─────────┬──┘
                 │         │         │
     ┌───────────▼──┐ ┌───▼───┐ ┌───▼──────────┐
     │ PostgreSQL   │ │ AWS   │ │ Nominatim    │
     │ + PostGIS    │ │ S3    │ │ (Geocoding)  │
     │ Amazon RDS   │ │       │ │              │
     └──────────────┘ └───────┘ └──────────────┘
```

---

## Features

### Tenant
- **Property Search** — Filter by location (50km radius via PostGIS), price, beds, baths, square feet, property type, amenities, and availability
- **Interactive Map** — Mapbox GL with property markers, popups, and fly-to animations
- **Grid / List Toggle** — Switch between card and compact list views
- **Favorites** — Save and manage favorite properties
- **Applications** — Submit rental applications with contact details
- **Residences** — View active leases with property details and billing history
- **Settings** — Update profile information

### Manager
- **Property Listing** — Create properties with drag-and-drop photo uploads (S3), amenities, highlights, and auto-geocoded addresses
- **Application Management** — Review, approve, or deny applications with tabbed filtering (All / Pending / Approved / Denied)
- **Tenant Overview** — Per-property tenant list with lease periods, rent, and payment status
- **Auto Lease Creation** — Approving an application automatically creates a 1-year lease record
- **Settings** — Update manager profile

### Platform
- **Role-Based Access** — Separate dashboards, API routes, and middleware for tenants and managers
- **Responsive Design** — Mobile-first with breakpoints at 375px, 640px, 768px, 1024px, 1280px
- **Mobile Navigation** — Hamburger menu with full navigation drawer
- **Toast Notifications** — Success/error feedback on all mutations via Sonner
- **Image Fallbacks** — Placeholder images on load failure
- **Legal Pages** — Terms, privacy, cookies, FAQ
- **Contact Form** — Public contact page

---

## Tech Stack

### Client
| Technology | Purpose |
|-----------|---------|
| Next.js 15 | React framework with App Router |
| React 19 | UI library |
| TypeScript 5 | Type safety |
| Redux Toolkit + RTK Query | State management and API caching |
| Tailwind CSS 4 | Utility-first styling |
| Radix UI (shadcn/ui) | Accessible component primitives |
| Mapbox GL | Interactive map rendering |
| AWS Amplify | Authentication (Cognito) |
| Framer Motion | Landing page animations |
| React Hook Form + Zod | Form handling and validation |
| FilePond | Drag-and-drop image uploads |
| Sonner | Toast notifications |

### Server
| Technology | Purpose |
|-----------|---------|
| Express 5 | HTTP server |
| TypeScript 5 | Type safety |
| Prisma 6 | ORM with PostgreSQL |
| PostGIS | Geospatial queries (radius search) |
| AWS Cognito | JWT-based authentication |
| AWS S3 | Property image storage |
| Multer | Multipart file upload handling |
| Nominatim | Address geocoding (OpenStreetMap) |
| Helmet | Security headers |
| Morgan | HTTP request logging |
| k6 | Load and performance testing |

### Infrastructure
| Service | Purpose |
|---------|---------|
| AWS Amplify | Frontend hosting + CI/CD |
| AWS EC2 | Backend API hosting |
| Amazon RDS | PostgreSQL + PostGIS database |
| AWS S3 | Image object storage |
| AWS Cognito | User pool and authentication |
| PM2 | Production process management |

---

## Database Schema

7 models with PostGIS spatial support:

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Manager  │────►│ Property │◄────│ Location │
│          │ 1:N │          │ 1:1 │ (PostGIS)│
└──────────┘     └────┬─────┘     └──────────┘
                      │
              ┌───────┼───────┐
              │       │       │
         ┌────▼──┐ ┌──▼───┐ ┌─▼────────────┐
         │ Lease │ │Tenant│ │ Application  │
         │       │ │      │ │              │
         └───┬───┘ └──────┘ └──────────────┘
             │
        ┌────▼───┐
        │Payment │
        └────────┘

Tenant ◄──► Property (M:N — favorites)
Tenant ◄──► Property (M:N — current residences)
```

| Model | Key Fields |
|-------|-----------|
| Property | name, description, pricePerMonth, beds, baths, squareFeet, propertyType, amenities[], highlights[], photoUrls[] |
| Manager | cognitoId, name, email, phoneNumber |
| Tenant | cognitoId, name, email, phoneNumber, favorites[], properties[] |
| Location | address, city, state, country, postalCode, coordinates (geography Point 4326) |
| Application | status (Pending/Approved/Denied), propertyId, tenantCognitoId, name, email, message |
| Lease | startDate, endDate, rent, deposit, propertyId, tenantCognitoId |
| Payment | amountDue, amountPaid, dueDate, paymentDate, paymentStatus |

---

## Project Structure

```
habiful/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   ├── (dashboard)/
│   │   │   │   ├── managers/
│   │   │   │   └── tenants/
│   │   │   ├── (nondashboard)/
│   │   │   │   ├── landing/
│   │   │   │   └── search/
│   │   │   ├── (legal)/
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── Card.tsx
│   │   │   ├── CardCompact.tsx
│   │   │   ├── ApplicationCard.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── state/
│   │   └── types/
│   └── package.json
│
├── server/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── seed.ts
│   │   ├── seedData/
│   │   └── migrations/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.ts
│   ├── tests/k6/
│   ├── ecosystem.config.js
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ with PostGIS extension
- AWS account (Cognito + S3)
- Mapbox account (access token)

### 1. Clone and Install

```bash
git clone <repository-url>
cd habiful

cd server && npm install
cd ../client && npm install
```

### 2. Database Setup

```bash
psql -U postgres -c "CREATE DATABASE \"realEstate\";"
psql -U postgres -d realEstate -c "CREATE EXTENSION IF NOT EXISTS postgis;"

cd server
npx prisma migrate dev
npm run seed
```

### 3. Environment Variables

**`server/.env`**
```env
PORT=8000
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/realEstate?schema=public"
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-s3-bucket
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

**`client/.env`**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your-pool-id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your-client-id
```

### 4. Generate Prisma Client

```bash
cd server
npm run prisma:generate
```

### 5. Run Development Servers

```bash
# Terminal 1 — Server (http://localhost:8000)
cd server && npm run dev

# Terminal 2 — Client (http://localhost:3000)
cd client && npm run dev
```

---

## API Reference

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/properties` | List properties with filters |
| GET | `/properties/:id` | Get property with coordinates |
| GET | `/properties/:id/leases` | Get property leases |

### Tenant Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tenants/:cognitoId` | Get tenant with favorites |
| PUT | `/tenants/:cognitoId` | Update settings |
| POST | `/tenants` | Create tenant |
| GET | `/tenants/:cognitoId/current-residences` | Active residences |
| POST | `/tenants/:cognitoId/favorites/:propertyId` | Add favorite |
| DELETE | `/tenants/:cognitoId/favorites/:propertyId` | Remove favorite |

### Manager Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/managers/:cognitoId` | Get manager |
| PUT | `/managers/:cognitoId` | Update settings |
| POST | `/managers` | Create manager |
| GET | `/managers/:cognitoId/properties` | Managed properties |
| POST | `/properties` | Create property (multipart) |

### Application Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/applications` | List (with userId + userType filters) |
| POST | `/applications` | Submit (tenant only) |
| PUT | `/applications/:id/status` | Approve/deny (manager only) |

### Lease Endpoints (Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leases` | List all leases |
| GET | `/leases/:id/payments` | Payments for a lease |

### Search Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `priceMin` / `priceMax` | number | Monthly rent range |
| `beds` / `baths` | number or "any" | Minimum count |
| `propertyType` | enum or "any" | Rooms, Tinyhouse, Apartment, Villa, Townhouse, Cottage |
| `squareFeetMin` / `squareFeetMax` | number | Area range |
| `amenities` | string | Comma-separated (Pool,Gym,WiFi) |
| `availableFrom` | date | No active lease after this date |
| `latitude` / `longitude` | number | Center for 50km radius search (PostGIS) |
| `favoriteIds` | string | Comma-separated property IDs |

---

## Engineering Highlight

During deployment, image uploads worked correctly in local development but resulted in corrupted files in the production environment. The issue was traced to differences in request handling between local and cloud setups, specifically related to multipart data processing.

Resolving this required understanding how request streams behave in production, correcting middleware order and binary handling, and verifying uploads end-to-end rather than relying on local success. This reinforced the importance of production-aware debugging and careful handling of file uploads in cloud-hosted applications.

---

## Load Testing (k6)

```bash
cd server

npm run k6:smoke       # 1 VU, 1 min — quick sanity check
npm run k6:load        # Ramp to 10 VUs, 9 min — normal traffic
npm run k6:stress      # Ramp to 100 VUs, 12 min — find breaking point
npm run k6:spike       # Burst to 100 VUs, 4 min — sudden traffic

npm run k6:tenant      # Tenant endpoints
npm run k6:manager     # Manager endpoints
npm run k6:applications # Application CRUD
npm run k6:leases      # Lease + payments
```

Tests are in `server/tests/k6/` and require valid JWT tokens in `.env`.

---

## Deployment

| Layer | Service | Details |
|-------|---------|---------|
| Frontend | AWS Amplify | Auto-deploys from Git, serves Next.js |
| Backend | AWS EC2 | PM2 process manager, Express API |
| Database | Amazon RDS | PostgreSQL 14 + PostGIS |
| Storage | AWS S3 | Property images |
| Auth | AWS Cognito | User pool with custom role attribute |

```bash
# Server production build
cd server && npm run build
pm2 start ecosystem.config.js

# Client production build
cd client && npm run build
```

---

## Scripts

### Server

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Compile to `dist/` |
| `npm run start` | Build + start production |
| `npm run seed` | Seed database |
| `npm run prisma:generate` | Generate Prisma client + copy types to client |

### Client

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Start production |
| `npm run lint` | ESLint |

---

## License

ISC
