
# Habiful

Habiful is a full-stack rental property management platform that models real-world rental workflows such as property listing, applications, approvals, and lease management.  
The project is designed to reflect how a production system is built, deployed, and debugged end-to-end.

🔗 **Live Demo**  
<https://main.d3tjyubg6cgnal.amplifyapp.com>

---

## Overview

Habiful focuses on practical problems commonly found in rental platforms:

- Managing property listings with structured metadata
- Supporting distinct user roles (manager and tenant)
- Handling application and lease workflows
- Uploading and serving property images reliably
- Deploying and operating the system in a cloud environment

The emphasis is on **backend workflow design** and **full-stack integration**, rather than isolated UI features.

---

## Preview

![Search Page Preview](https://7060rs-s3-images.s3.us-east-1.amazonaws.com/Screenshot+(40).png)

## System Architecture

```text
User
│
▼
Frontend (Next.js, React)
│   └── Deployed on AWS Amplify
│
▼
Backend API (Node.js, Express)
│   └── Hosted on AWS EC2
│
├── PostgreSQL (via Prisma ORM)
│   ├── Properties
│   ├── Applications
│   ├── Leases
│   └── Users (Tenants / Managers)
│
└── AWS S3
    └── Property Images


```

The system follows a clear separation of responsibilities between the frontend, backend, database, and cloud services, closely resembling real production architectures.

---

## What This Project Demonstrates

- End-to-end ownership of a full-stack application
- Backend design driven by real business workflows, not just CRUD
- Clear separation between frontend, backend, and data layers
- Cloud deployment experience using AWS services
- Debugging and resolving production-only issues

---

## Core Features

### Property Management

- Create and manage rental property listings
- Store location data, pricing, amenities, and availability
- Upload and retrieve property images using cloud storage

### Search and Discovery

- Filter properties by price, size, amenities, and availability
- Support location-based property discovery
- Designed to resemble real rental search behavior

### Application & Lease Workflow

- Tenants can apply for listed properties
- Managers can review, approve, or reject applications
- Approved applications result in lease creation
- Lease records track duration and payment timelines

### Role-Based Access Control

- Clear separation between tenant and manager capabilities
- Protected backend routes based on user role
- Backend logic enforces valid state transitions

---

## Technology Stack

### Frontend

- **Next.js (React)** for UI and routing
- Component-based design with reusable layouts
- API communication abstracted into service layers
- Deployed using **AWS Amplify**

### Backend

- **Node.js & Express** REST API
- **Prisma ORM** with PostgreSQL
- Controllers organized by domain (properties, applications, leases)
- Deployed on **AWS EC2**

### Cloud & Infrastructure

- **AWS S3** for property image storage
- Public image access handled via bucket policies (ACL-free)
- Environment-specific configuration using `.env` files

---

## Engineering Highlight

During deployment, image uploads worked correctly in local development but resulted in corrupted files in the production environment.  
The issue was traced to differences in request handling between local and cloud setups, specifically related to multipart data processing.

Resolving this required:

- Understanding how request streams behave in production
- Correcting middleware order and binary handling
- Verifying uploads end-to-end rather than relying on local success

This experience reinforced the importance of **production-aware debugging** and careful handling of file uploads in cloud-hosted applications.

---

## Repository Structure

```text
habiful/
├── client/                 
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .gitignore
│
├── server/                 
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

Each part of the system is developed independently while working together as a single application.
