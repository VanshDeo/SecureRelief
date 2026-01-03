# 🏔️ SecureRelief Next

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Web3](https://img.shields.io/badge/Web3-Ethers.js_v6-F06292?style=for-the-badge&logo=ethereum)](https://ethers.org/)
[![Avalanche](https://img.shields.io/badge/Avalanche-Fuji-E84142?style=for-the-badge&logo=avalanche)](https://avax.network/)

**The premium, high-performance evolution of the SecureRelief frontend.**

*Built with Next.js 15, featuring a state-of-the-art administrative command center and intuitive donor/victim portals.*

[Explore Dashboards](#-core-dashboards) • [Tech Stack](#-technology-stack) • [Quick Start](#-getting-started) • [Architecture](#-architecture)

</div>

---

## 🌟 Overview

**SecureRelief Next** is the modernized frontend layer for the Avalanche Disaster Relief Network. It provides a highly responsive, secure, and visually stunning interface for managing multi-stakeholder humanitarian operations. 

By leveraging **Next.js 15 (App Router)** and **Zustand**, we've achieved sub-second responsiveness and a seamless Web3 integration that makes blockchain complexity invisible to emergency responders.

---

## 🚀 Key Features

### 👑 **Administrative Command Center**
*   **Global Monitoring**: Real-time analytics of funds, vendors, and disaster zones.
*   **Geographic Distribution**: Interactive SVG mapping of relief efforts.
*   **Vendor Governance**: Automated onboarding and verification workflows.
*   **Real-Time Analytics**: Live system metrics with high-impact visual feedback.

### 💝 **Donor Experience**
*   **Transparent Vertical**: Track every cent of your contribution from wallet to victim.
*   **Impact Metrics**: Visual evidence of lives helped and resources deployed.
*   **Direct Web3 Integration**: Seamless Metamask/Core wallet connectivity.

### 🏪 **Vendor & Victim Portals**
*   **Rapid Voucher Redemption**: Simplified interface for local vendors to process aid.
*   **Proof of Distribution**: Encrypted evidence submission for immutable trust.
*   **Emergency Access**: Optimized for low-bandwidth mobile environments in disaster zones.

---

## 🎨 Design Philosophy

SecureRelief Next follows a **"Premium Productivity"** aesthetic:
- **Glassmorphism**: Subtle translucency and blurred backgrounds for depth.
- **High-Contrast Typography**: Bold tracking and specialized weights for critical data.
- **Micro-Animations**: Powered by Framer Motion for a "living" interface feeling.
- **Responsive Grids**: Robust layout system that scales from mobile triage to desktop command centers.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + Framer Motion |
| **State** | Zustand (Web3 & Global UI) |
| **Blockchain** | Ethers.js v6 |
| **Icons** | Lucide React |
| **Visualization** | Chart.js |

---

## 🏗️ Architecture

```
frontend-next/
├── src/
│   ├── app/                # Next.js 15 App Router (Role-based layouts)
│   ├── components/
│   │   ├── Admin/          # Management & Governance components
│   │   ├── Charts/         # High-performance data visualization
│   │   ├── UI/             # Premium Design System (Atomic components)
│   │   └── Web3/           # Wallet & Contract interface layers
│   ├── store/              # Zustand global state (web3Store)
│   ├── services/           # API and Smart Contract service logic
│   ├── contexts/           # Auth and Theme providers
│   └── hooks/              # Custom logic (useContract, useCache, etc.)
└── public/                 # Optimized assets and brand identity
```

---

## 🏁 Getting Started

### 📋 Prerequisites
- Node.js 18.0+ 
- npm / yarn / pnpm

### ⚡ Installation

1. **Clone & Enter**
   ```bash
   cd frontend-next
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
   NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
   ```

4. **Launch Development**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 🗺️ Roadmap
- [x] Next.js 15 Migration
- [x] Premium Admin Dashboard UI
- [x] Web3 Wallet Logic Integration
- [ ] Multi-language Support (i18n)
- [ ] Advanced IPFS Media Dashboard
- [ ] Progressive Web App (PWA) Offline Support

---

<div align="center">

**[SecureRelief](https://github.com/Aashik1701/Disaster_Relief_Microfunding_Network)** - Impact built on Avalanche.

</div>
