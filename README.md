# IndiaStack SaaS Boilerplate

A Next.js 14 starter optimized for Indian SaaS products.

## Features
- **Payment**: Razorpay integration (UPI, Card, Netbanking) with mock test mode support.
- **Invoicing**: Automatic GST-compliant Invoice generation (PDF) using `jspdf`.
- **Authentication**: NextAuth.js v5 with Prisma Adapter.
- **Database**: Prisma via sqlite (dev) / PostgreSQL (prod).
- **Email**: Transactional emails via Resend.
- **Design**: Tailwind CSS (Salient UI inspired).

## Tech Stack
- **Framework**: Next.js 14
- **Language**: TypeScript / JavaScript
- **Database**: SQLite (Development)
- **ORM**: Prisma
- **Auth**: NextAuth.js
- **Payments**: Razorpay
- **Email**: Resend

## Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd india-saas-kit
npm install
```

### 2. Environment Variables
Copy the example environment file:
```bash
cp .env.example .env
```
Fill in the following keys in `.env`:
```env
# Auth (Generate with `openssl rand -base64 32`)
AUTH_SECRET="your-secret-key"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# Database
DATABASE_URL="file:./dev.db"

# Razorpay (From Dashboard -> Settings -> API Keys)
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."

# Resend (From Resend Dashboard)
RESEND_API_KEY="re_..."
```

### 3. Setup Database
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Project Structure
- `app/api/payment`: Routes for Razorpay Order Creation & Verification.
- `app/api/invoice`: Route for generating GST Invoices.
- `components/`: UI Components (`PaymentButton`, `InvoiceGenerator`, etc).
- `lib/`: Utilities for Razorpay, Email, Auth, and GST logic.
- `prisma/`: Database schema.

## License
MIT
