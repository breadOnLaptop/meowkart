# Meowkart (Flipkart Clone)

A high-fidelity, full-stack e-commerce application modeled after Flipkart's user experience. Meowkart features an optimized infinite-scroll product catalog, functional cart/wishlist management, and a robust Controller-Service-Repository backend architecture.

## Quick Start

### 1. Database & Infrastructure
The project uses PostgreSQL. Start the database container:
```bash
docker-compose up -d
```

### 2. Backend Implementation (Scalable Architecture)
The backend is built with **Node.js/Express** and follows a modular **Service-Repository** pattern for enterprise-grade scalability.
```bash
cd backend
npm install
# Run migrations to set up the schema
npx prisma migrate dev --name init
# Seed the database with 60 high-fidelity verified products
node prisma/seed.js
# Start the server (default: port 5000)
npm start
```

### 3. Frontend Implementation
A reactive UI built with **React (Vite)** and **Tailwind CSS v4**.
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:5173` to start shopping!

---

## Tech Stack

- **Frontend:** React 18 (Vite), TypeScript, Tailwind CSS v4, Zustand (Global State), Lucide React (Icons).
- **Backend:** Node.js, Express, Prisma 6 (ORM).
- **Architecture:** Controller-Service-Repository (Clean Layering).
- **Database:** PostgreSQL.
- **Imagery:** Verified high-resolution Unsplash/Amazon URLs with dynamic error fallbacks.

---

## Key Features & Implementation Details

### Flipkart UI Design
- **Signature Blue Header:** Persistent search bar and category navigation.
- **Optimized Pagination:** Strictly 12 products per batch with IntersectionObserver infinite scroll.
- **Flipkart-Style Product Cards:** Including "Assured" badges, discount pricing, and hover transitions.
- **Breadcrumb Navigation:** Dynamic paths (Home > Category > Product) on detail pages.

### Modular Backend
Instead of a monolithic index.js, the backend is structured as:
- **Controllers:** Handle HTTP requests and response formatting.
- **Services:** Encapsulate business logic (e.g., order processing, cart calculations).
- **Repositories:** Centralized data access using Prisma.
- **Mock Auth:** Automatically identifies as customer@meowkart.com for a seamless "No Login" flow.

---

## Important Notes & Assumptions

- **Authentication:** As per requirements, "No Login" is implemented. A default customer profile is automatically generated and used for all transactions.
- **Pagination Strategy:** Infinite scroll triggers only when the last element of the current batch is 100% visible to ensure a smooth, non-intrusive loading experience.
- **Data Integrity:** The seed script populates 60 unique products across 4 categories (Mobiles, Electronics, Fashion, Home) with verified stable image URLs.
- **Payment:** The checkout process simulates a real payment gateway, moving items from the active Cart to the Order History.

---

## Database Schema
The schema includes:
- User: Base identity.
- Product: Comprehensive catalog with specification JSON.
- Cart/CartItem: Volatile shopping state.
- Wishlist/WishlistItem: Persistent saved items.
- Order/OrderItem: Immutable transaction history and shipping details.

---
*Created as part of the Meowkart Development Challenge.*
