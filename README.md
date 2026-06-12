# Varasat - AI-Powered Inheritance Recovery Platform

Varasat is a premium, secure, and AI-powered financial asset recovery and heir apportionment system built to assist Indian families in reclaiming dormant or unclaimed deposits, insurance policies (LIC), and mutual fund shares. 

Complying with the **RBI Unclaimed Deposits Circulars**, the platform streamlines the tedious legal retrieval process into a few clicks using AI, multilingual natural language voice assistance, automated mathematical apportionment engines, and digital security standards.

---

## 🌟 Key Features

### 1. Varasat Mitra (Conversational AI Assistant)
- **WhatsApp-Style Chat & Speech Interface**: A highly accessible chat flow featuring speech input options tailored for rural and vernacular users.
- **Multilingual Support**: Supports vocal inputs in **English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), and Telugu (తెలుగు)**.
- **Glowing Voice waveform badge**: Styled with a pulsing micro-indicator highlighting speech-to-text integration.

### 2. Claimant Analytics Dashboard
- **Succession Apportionment**: Automated heir asset splitting calculated dynamically under **Hindu Succession Act (HSA) Class I** guidelines.
- **Financial Analytics**: Tracks compounding accrued interest vs. principal balances over time.
- **Family Tree Visualizations**: Generates self-drawing SVG diagram maps charting the legal succession path on-mount.

### 3. Bank Partner Portal (B2G SaaS Node)
- **Active Claims Queue**: High-contrast, sleek white dashboard allowing bank officers to audit active claims.
- **3-Layer Security Audit Checklist**: Highlights biometric checks, death registry API matches, and legal document locks.
- **Succession Trace Auditor**: Integrates a Wolfram Language execution console display proving the mathematical legitimacy of apportioned inheritances.
- **Awaiting Affidavit Lock**: Prevents bank approval of funds until the claimant generates their legal affidavit from the dashboard.

### 4. 3-Layer Security Pipeline
- **L1 Biometric verification**: Aadhaar biometric eKYC match authenticated securely via OTP tokens.
- **L2 Document link**: Verified death certificates fetched directly from DigiLocker API gateways.
- **L3 Legal PDF generator**: Automated, font-supported bilingual (Hindi Devanagari & English) legal affidavits and indemnity bonds generated on-the-fly via PDFKit streams.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    A[Next.js + Tailwind CSS Client] -->|API Request| B[Express.js backend]
    B -->|Query / Mutate| C[(PostgreSQL Database via Prisma)]
    B -->|Audit Verification| D[Wolfram Alpha Computation Engine]
    B -->|Affidavit PDF Stream| E[PDFKit + Devanagari TTF Font Registry]
    B -->|Drafting Contexts| F[Anthropic Claude Messages API]
```

- **Frontend**: Next.js, React, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Prisma ORM) with a robust in-memory mock fallback mode
- **Math/Audit Engine**: Wolfram Language integrations
- **Font Rendering**: Local Devanagari (`NotoSansDevanagari`) TTF font loader

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Server Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create your local environmental values `.env` (a `.env.example` template is provided):
   ```env
   PORT=5000
   DATABASE_URL="postgresql://user:password@localhost:5432/varasat"
   JWT_SECRET="generate-a-secure-64-character-jwt-key-for-auth"
   ENCRYPTION_KEY="32-byte-hexadecimal-key-for-pii-encryption"
   ```
   *Note: If no `DATABASE_URL` is provided, the server automatically falls back to a mock In-Memory Database for local sandbox testing.*
3. Install dependencies:
   ```bash
   npm install
   ```
4. Sync database schema (if utilizing PostgreSQL):
   ```bash
   npx prisma db push
   ```
5. Run the developer hot-reloading server:
   ```bash
   npm run dev
   ```
   *The backend will boot up on **http://localhost:5000**.*

---

### 2. Frontend App Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd ../frontend
   ```
2. Configure your API base URL (a `.env.example` template is provided):
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:5000"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   *Open **http://localhost:3000** to view the application in your browser.*

---

## 🔒 Sandbox Testing Credentials

Use the following sandbox mock values to test the 3-Layer Security flow:

| Security Layer | Checkpoint | Input / Value | Status |
| :--- | :--- | :--- | :--- |
| **L1 (Aadhaar)** | Biometric OTP Token | `123456` | PASS |
| **L2 (DigiLocker)** | Death Certificate ID | `DEATH-2026-9081` | Ramesh Kumar Sr |
| **L2 (DigiLocker)** | Death Certificate ID | `DEATH-2026-1122` | Suresh Chandra |
| **L3 (Affidavit)** | Download PDF | Click in Claimant Dashboard | Auto-registers as Verified |

---

## 💎 Design Tokens & Keyframes

The Varasat user experience is styled with the following design tokens:
- **Navy Primary**: `#0A2540`
- **Gold Accent**: `#D4AF37`
- **Warm White**: `#F8F9FA`
- **WhatsApp Green**: `#075E54`
- **Animations**: Ambient background drift keyframes, self-morphing layout blobs, self-drawing family tree SVGs, and staggered text revealing animations.
