# Lead Automater

Lead Automater is a high-performance, scalable e-commerce solution designed for businesses to automate lead generation based on user engagement. By tracking product views and likes, the system identifies high-interest users and automatically triggers targeted email engagement, converting browsing habits into actionable sales leads.

## Architecture Impact
The architecture is built for extreme scalability and speed:
- **High-Throughput Backend:** Built with **NestJS**, leveraging a modular architecture and **BullMQ** for asynchronous task processing.
- **Optimized Data Layer:** Utilizes **PostgreSQL** with **Prisma** for robust relational data management, combined with **Redis** for efficient job queuing and performance caching.
- **High-Performance Frontend:** A **Next.js 15+** application using the **App Router**, **React Server Components (RSC)**, and **Streaming** to ensure near-instant page loads and optimal SEO.
- **Strategic Caching:** Employs **Incremental Static Regeneration (ISR)** to support high traffic volumes (>100,000 requests/s), ensuring the store remains responsive regardless of load.
- **Role-Based Access Control:** Implements secure authentication via **Auth.js** and role-based guards, separating customer experiences from administrative controls.

## SaaS Viability
Yes, this project is a robust foundation for a **SaaS (Software as a Service)** product. Its capability to automatically identify and nurture leads, combined with its ability to scale horizontally, makes it an ideal platform for e-commerce store owners looking to optimize their conversion funnel.

## Extensibility
This repository is built with a modular design specifically to facilitate future experimentation:
- **Service-Oriented Design:** The email processing, analytics tracking, and product management services are loosely coupled.
- **Infrastructure Abstraction:** While currently using Redis for queuing and Postgres for storage, the system is designed to allow swapping in different services (e.g., alternative messaging brokers or document databases) with minimal disruption to the business logic.

## Installation Instructions

### Prerequisites
- Node.js (v22+)
- PostgreSQL
- Redis

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd lead_automater_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env` file (see `.env.example`).
4. Generate the Prisma client and sync the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```
6. Start the backend:
   ```bash
   npm run start:dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../lead_automater_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your `.env.local` (ensure `NEXT_PUBLIC_API_URL` points to your backend).
4. Start the frontend:
   ```bash
   npm run dev -- -p 3001
   ```
