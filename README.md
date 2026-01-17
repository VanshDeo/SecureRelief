# SecureRelief

> **Aid that moves at the speed of urgency — verified, delivered, and redeemable in minutes.**

---

## Project Overview

**SecureRelief** is a blockchain-powered disaster relief platform designed to solve the critical "last-mile" problem in aid distribution. Traditional relief funds often suffer from leakage, delays, and lack of transparency. SecureRelief utilizes stablecoins (USDC) and smart contracts to deliver aid directly to verified beneficiaries.

**Why it matters:**
In disaster zones, speed saves lives. By removing intermediaries and using automated verification, we reduce aid delivery time from days to minutes while ensuring 100% auditability.

**Who it is for:**
- **Donors:** Who want to track their impact in real-time.
- **Beneficiaries:** Who need instant access to life-saving supplies without complex banking.
- **Vendors:** Who provide goods and get settled instantly.
- **Agencies & Oracles:** Who provide oversight and verification.

---

<!-- ## 3. Live Links

| Resource | Link |
| :--- | :--- |
| 🌐 **Live Website** | [securerelief.vercel.app](https://securerelief.vercel.app) _(Placeholder)_ |
| 🧪 **Demo Video** | [Watch Demo](https://youtube.com) _(Placeholder)_ |
| 📦 **Smart Contracts** | [Etherscan / BlockExplorer](https://etherscan.io) _(Placeholder)_ |
| 📄 **Documentation** | [Project Wiki](./PLAN.md) |
| 📁 **GitHub Repo** | [github.com/Soujanya-Mctrl/SecureRelief](https://github.com/Soujanya-Mctrl/SecureRelief) | -->

---

## Tech Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **UI Components:** Radix UI, Lucide React
- **Maps:** Leaflet / React-Leaflet

### **Backend**
- **Runtime:** Node.js (Next.js API Routes)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Auth:** Custom JWT + SIWE (Sign-In with Ethereum)

### **Blockchain**
- **Network:** Weilchain (EVM Compatible) / Hardhat Dev Node
- **Interaction:** Wagmi, Viem
- **Smart Contracts:** Rust

### **Tools**
- **Package Manager:** npm
- **Linting:** ESLint

---

## System Architecture

The system operates on a hybrid architecture:

1.  **Web3 Layer:** Handles all value transfer. Donations, Voucher Issuance, and Vendor Settlement happen on-chain for immutability.
2.  **Web2 Layer:** Handles PII (Personally Identifiable Information), document storage, and fast indexing for the frontend dashboards.
3.  **Oracle Network:** Bridges the two worlds by verifying off-chain documents (IDs) and anchoring the approval on-chain to unlock funds.

```mermaid
graph TD
    User[User] -->|Connect Wallet| Client[Next.js Client]
    Client -->|API Requests| API[Next.js API]
    Client -->|RPC Calls| Blockchain[Weilchain / Ethereum]
    API -->|Read/Write| DB[(PostgreSQL)]
    
    subgraph "Smart Contract Logic"
        Treasury -->|Allocate| Zone[Disaster Zone]
        Zone -->|Mint| Voucher[Voucher NFT]
        Voucher -->|Redeem| Vendor[Vendor Wallet]
    end
```

---

## User Flow

1.  **Mobilization:** Admin creates a "Disaster Zone". Government approves it.
2.  **Funding:** Donors deposit USDC into the specific Disaster Zone Contract.
3.  **Verification:** Impacted individuals (Beneficiaries) upload ID proof. Oracles verify documents.
4.  **Issuance:** Verified beneficiaries receive a digital **Voucher (QR Code)**.
5.  **Redemption:** Beneficiary visits a local Vendor. Vendor scans QR code.
6.  **Settlement:** Smart contract validates the voucher and instantly transfers USDC to the Vendor.

---

## Key Features

-   **Role-Based Portals:** Dedicated dashboards for Donors, Beneficiaries, Vendors, Admins, Agencies, and Oracles.
-   **Offline-First Design:** Beneficiaries can download/print vouchers to redeem aid even without internet access.
-   **Live Impact Map:** Real-time geospatial visualization of where funds are being allocated.
-   **Instant Settlement:** Vendors receive stablecoin payment immediately upon scanning—no waiting for reimbursement.
-   **Traceability:** Every dollar donated can be traced to a specific redemption event.

---

## Project Structure

```bash
secure-relief/
├── app/                    # Next.js App Router Pages
│   ├── api/                # Backend API Routes (Auth, etc.)
│   ├── dashboard/          # Role-based Dashboard Views
│   ├── login/              # Auth Pages
│   └── page.tsx            # Landing Page
├── components/             # Reusable UI Components
│   ├── auth/               # Role Guards & Auth Components
│   ├── map/                # Interactive Map Components
│   └── ui/                 # Atomic Design Elements (Buttons, Cards)
├── context/                # React Context (Auth, Global State)
├── lib/                    # Utilities & Config
│   ├── auth/               # Role Logic & JWT Helpers
│   ├── services/           # Database Services
│   ├── web3/               # Wagmi Hooks & Contract Config
│   └── utils/              # Helper Functions
├── prisma/                 # Database Schema & Migrations
├── public/                 # Static Assets
└── contracts/              # Rust Smart Contracts (Future)
```

---

## Installation & Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (Local or Cloud)
- MetaMask or Web3 Wallet

### Steps

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Soujanya-Mctrl/SecureRelief.git
    cd secure-relief
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Database**
    ```bash
    # Update .env with your credentials first
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    ```

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/securerelief"

# Authentication (JWT)
JWT_ACCESS_SECRET="super-secret-access-key"
JWT_REFRESH_SECRET="super-secret-refresh-key"
JWT_ACCESS_EXPIRY="15m"
JWT_REFRESH_EXPIRY="7d"

# Blockchain (Optional for local dev)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project-id"
```

---

<!-- ## 11. Screenshots

*(Placeholder for future screenshots)*

| **Donor Dashboard** | **Impact Map** |
|:---:|:---:|
| ![Donor Dashboard](/public/screenshots/donor_dash.png) | ![Impact Map](/public/screenshots/map_view.png) |

| **Beneficiary Voucher** | **Vendor Scanner** |
|:---:|:---:|
| ![Beneficiary View](/public/screenshots/voucher_view.png) | ![Vendor View](/public/screenshots/vendor_scan.png) |

--- -->

## Roadmap

- [x] **Core Platform:** Role-based dashboards & Auth.
- [x] **Voucher System:** QR generation and mock scanning logic.
- [x] **Impact Map:** Live visualization of disaster zones.
- [ ] **Smart Contract Integration:** Connect UI to deployed Solidity contracts.
- [ ] **IPFS Storage:** Decentralized storage for verification documents.
- [ ] **PWA Support:** Full manifest for "Add to Home Screen" capability.

---

## Security & Best Practices

-   **Role-Based Access Control (RBAC):** Middleware checks to prevent unauthorized access to specific portals.
-   **SIWE (Sign-In with Ethereum):** Cryptographic proof of ownership for login.
-   **Data Minimalization:** Only essential data is stored on-chain; PII remains off-chain and encrypted.

---

<!-- ## 14. Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

--- -->

## License

Distributed under the **MIT License**. See `LICENSE` for more information.
