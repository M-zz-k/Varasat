# Varasat - AI-Powered Inheritance Recovery Platform

Varasat is an AI-powered financial asset recovery and heir apportionment system built to assist Indian families in reclaiming dormant or unclaimed deposits, LIC policies, and mutual fund shares.

---

## 🏗️ Tech Stack

* **Frontend**: Next.js, React, Tailwind CSS (v4), Lucide Icons
* **Backend**: Node.js, Express.js
* **Database**: PostgreSQL (Prisma ORM) / In-Memory Mock Fallback
* **Computation Engine**: Wolfram Language (Succession Graphs, Accruals, Routing circulars)
* **AI & Security**: Aadhaar Biometric eKYC (L1), DigiLocker Vault APIs (L2), PDFKit Legal bonds (L3), Bhashini translation, Claude Sonnet drafts

---

## 🚀 Getting Started

To run the full-stack system locally, execute the frontend and backend servers concurrently.

### 1. Start the Express Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create or verify your local `.env` values (configured automatically with defaults):
   ```env
   PORT=5000
   JWT_SECRET=varasat_secret_key_12345
   ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
3. Run the backend developer server:
   ```bash
   npm run dev
   ```
   The backend server will bootstrap on [http://localhost:5000](http://localhost:5000).

---

### 2. Start the Next.js Frontend
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Launch the Next.js developer hot reloading server:
   ```bash
   npm run dev
   ```
   The application dashboard and conversational Mitra interface will load on [http://localhost:3000](http://localhost:3000).

---

## 🔒 3-Layer Security Simulation Credentials
When filling claims in the conversational interface or bank portals, use the following sandbox credentials:
* **Aadhaar L1 eKYC OTP Code**: `123456`
* **DigiLocker L2 Death Certificate IDs**: `DEATH-2026-9081` (Deceased: Ramesh Kumar Sr) or `DEATH-2026-1122` (Deceased: Suresh Chandra)
* **L3 Legal PDF Documents**: Generated on-the-fly and automatically stored in database records when downloaded from the dashboard.
