# PLAN.md — SecureRelief USDC stablecoin Relief Distribution

**Purpose:**
Design a production-ready plan for a We ilchain-deployable frontend + smart-contract system that delivers stablecoin-based relief directly to verified beneficiaries with strong transparency, auditability, and optional spend-controls (voucher/allowlist mechanics).

---

## 1. Problem Statement

Disaster relief funds often suffer from delays, leakage, and lack of transparency. Beneficiaries may not receive aid on time, and donors struggle to verify how funds are used.

**Expected solution:** a stablecoin-based relief distribution system that enables rapid, trackable fund transfers directly to verified beneficiaries, with optional controls on how funds can be spent.

---

## 2. Goals & Success Criteria

### ⭐ Unique Selling Proposition (USP): *Instant Aid, Zero Friction*

**SecureRelief’s core USP is speed with simplicity.** The platform is designed so that *from donation to beneficiary access*, every step is optimized to remove friction, delays, and cognitive overload — especially critical during disasters.

**USP Statement:**

> **“Aid that moves at the speed of urgency — verified, delivered, and redeemable in minutes, not days.”**

#### What Makes SecureRelief Fast & Easy

1. **One‑Tap Funding → Instant Allocation**
   Donors fund disaster zones in a single transaction. Funds are immediately available in the on‑chain treasury, eliminating bank delays, intermediaries, and manual approvals.

2. **Verification Once, Benefits Instantly**
   Beneficiaries complete verification only once per disaster zone. Upon oracle approval, aid eligibility is unlocked automatically via smart‑contract events — no follow‑up forms, no queues.

3. **Voucher‑Based Aid = No Learning Curve**
   Beneficiaries do *not* need to understand crypto. They receive:

   * A simple **QR code or voucher code**
   * Clear value (e.g., “Food Voucher – 50 USDC”)
   * No wallet management required (optional custodial / gas‑subsidized flow)

4. **Offline‑First by Design**
   Aid works even when the internet doesn’t.

   * QR vouchers cached locally
   * Redemption possible in low‑connectivity areas
   * Automatic sync when network returns

5. **Vendor Redemption in Seconds**
   Vendors scan → validate → redeem.

   * No paperwork
   * No reimbursement delays
   * Funds settle directly to vendor wallet on Weilchain

6. **Gas‑Subsidized Critical Actions**
   Beneficiaries never worry about gas fees. Claims and redemptions are either subsidized or relayed — removing the biggest UX blocker in Web3.

7. **Live Transparency, Zero Admin Overhead**
   Donors see real‑time impact dashboards powered directly by on‑chain events — no reports to wait for, no trust gap.

#### Why This USP Matters in Disasters

Disasters are time‑critical. The effectiveness of relief is directly proportional to **how fast aid reaches the beneficiary** and **how little friction exists in the process**.

SecureRelief’s USP is best understood when measured **against existing relief systems using concrete metrics**.

---

### 📊 Speed & Ease Metrics — SecureRelief (USDC‑Based) vs Existing Systems

| Metric                                     | Traditional Relief Systems | Existing Digital / NGO Systems | **SecureRelief (Weilchain‑based)**  |
| ------------------------------------------ | -------------------------- | ------------------------------ | ----------------------------------- |
| **Donation → Usable Aid Time**             | 7–30 days                  | 2–7 days                       | **5–30 minutes**                    |
| **Intermediaries Involved**                | 5–8 (banks, NGOs, admins)  | 3–5                            | **0–1 (smart contract)**            |
| **Fund Settlement Time**                   | 3–5 business days          | 1–3 days                       | **1–2 blocks (~seconds)**           |
| **Beneficiary Onboarding Time**            | Days (manual paperwork)    | 1–2 days                       | **< 10 minutes (digital + oracle)** |
| **Aid Claim Process**                      | Physical visits, forms     | App + approval wait            | **One‑tap claim / QR code**         |
| **Vendor Reimbursement Time**              | 7–45 days                  | 3–14 days                      | **Instant on redemption**           |
| **Offline Usability**                      | ❌ None                     | ⚠️ Limited                     | **✅ Full (QR + cache)**             |
| **Gas / Transaction Cost for Beneficiary** | N/A but indirect fees      | Often passed to user           | **0 (gas‑subsidized)**              |
| **Leakage / Misallocation Risk**           | High (10–30%)              | Medium                         | **< 2% (on‑chain enforced)**        |
| **Transparency for Donors**                | Reports after weeks        | Periodic dashboards            | **Real‑time, block‑level**          |

---

### ⏱ End‑to‑End Time Compression (Critical Metric)

**Traditional flow:**

```
Donation → Bank Clearing → NGO Processing → Field Distribution → Manual Verification → Aid
⏱ 7–30 DAYS
```

**SecureRelief flow:**

```
Donation → Smart Contract → Verified Beneficiary → QR Voucher → Vendor Redemption
⏱ 5–30 MINUTES
```

This represents a **~99% reduction in delivery time**.

---

### 🎯 Ease‑of‑Use Metrics (Human‑Centric)

| UX Metric                                | Traditional Systems | SecureRelief              |
| ---------------------------------------- | ------------------- | ------------------------- |
| **Steps for Beneficiary to Receive Aid** | 8–12 steps          | **3 steps**               |
| **Crypto Knowledge Required**            | N/A                 | **None**                  |
| **Wallet Management Required**           | N/A                 | **Optional / Abstracted** |
| **Actions Needed at Vendor**             | Manual paperwork    | **Scan → Confirm**        |
| **Training Required for Vendors**        | High                | **< 5 minutes**           |

---

### 📈 Operational Efficiency Metrics

* **Admin workload reduction:** ~70–80% (automation via smart contracts)
* **Audit preparation time:** Reduced from weeks to **instant on‑chain queries**
* **Dispute resolution time:** Hours instead of days (single source of truth)
* **Scalability:** Thousands of beneficiaries added with **no extra ops cost**

---

### 🧠 Why These Metrics Matter

* **Speed saves lives** during disasters
* **Lower friction increases adoption** among non‑technical users
* **Immediate settlement builds vendor trust**
* **Real‑time transparency increases donor confidence**

SecureRelief does not just digitize relief — it **compresses time, removes friction, and enforces trust by design**.

---

* **Speed:** enable near-instant transfers of aid to beneficiaries.
* **Transparency:** full on-chain traceability of fund flows with user-friendly explorer views.
* **Control:** allow donors/treasury to optionally restrict how funds can be spent (vouchers/allowlists/categories).
* **Resilience:** operate offline-first in low-connectivity zones, with robust RPC fallback and retries for Weilchain.
* **Privacy & Compliance:** protect personally identifiable info (PII) while still providing audit trails for funds.
* **Usability:** low-friction UX for beneficiaries (KYC-lite, QR voucher, offline voucher QR), vendors, and donors.

KPIs: time-to-delivery (donation → beneficiary access), % funds reaching beneficiaries (on-chain reconciliation), redemption latency, error rate for redemptions.

---

## 3. High-Level Architecture

(See `frontend/`, `services/`, `contracts/` and `backend/`.)

1. **Frontend (Next.js + TypeScript)** — PWA installable app with offline caching, wallet connections, role-based portals (Donor, Beneficiary, Vendor, Admin, Treasury, Government, Oracle).
2. **Blockchain Layer (Weilchain)** — stablecoin token contract + voucher / distribution smart contracts (voucher factory, redemption, treasury, oracle hooks). Use multicall, EIP-1559 gas handling, and events for streaming updates.
3. **Backend (Optional off-chain services)** — document storage & verification queuing, webhook processors, analytics, and gas-subsidy relayer.
4. **Oracles & Verification** — off-chain oracle agents validate KYC/document claims; results anchored on-chain.
5. **Payments & Controls** — stablecoin (USDC or a specific stablecoin token), voucher system, merchant allowlists and item-category restrictions.

---

## 4. Data Model & Contracts (Surface)

### Stablecoin Standard

* **USDC (ERC‑20 compatible on Weilchain)** — USD‑pegged stablecoin used for all donations, allocations, vouchers, and redemptions.
* Eliminates volatility risk for beneficiaries and vendors.
* Enables predictable aid value ("$50 food voucher" means $50 everywhere).

### Contracts

* **USDC Token (ERC‑20 / Weilchain compatible)** — canonical stablecoin used across the platform.
* **TreasuryContract** — holds pooled USDC donations, supports batch allocations and gas‑subsidized transfers.
* **VoucherFactory** — mints voucher NFTs / records representing conditional USDC value (amount, expiry, allowed vendor types, disaster zone).
* **VoucherManager** — manages voucher lifecycle (issued → claimed → redeemed → settled).
* **DisasterZoneManager** — zone metadata, USDC budgets, oracles list, vendor allowlists.
* **VendorRegistry** — approved vendors, categories, locations.
* **OracleManager** — verification results anchored on‑chain.

### Key On‑Chain Events

* `DonorDepositUSDC(zoneId, amountUSDC, donor)`
* `TreasuryAllocateUSDC(zoneId, amountUSDC)`
* `BeneficiaryVerified(beneficiaryId, zoneId, proofHash)`
* `VoucherIssued(voucherId, beneficiaryId, amountUSDC)`
* `VoucherRedeemed(voucherId, vendor, amountUSDC)`

---

## 5. User Flows (mapped to existing conversation flows)

The conversation already provides detailed flows for Donor, Beneficiary (Victim), Vendor, Admin — incorporate these with the following stablecoin-specific additions:

* **Donor:** deposit stablecoin to TreasuryContract or directly fund a zone. Optionally enable spend-controls; donor sees on-chain trace and can generate restricted vouchers.
* **Beneficiary:** after oracle verification, beneficiary receives ability to claim voucher(s) or a direct stablecoin allocation to a custodial wallet or proxy wallet (with spend restrictions enforced via smart contract or merchant allowlists).
* **Vendor:** scans voucher QR or receives on-chain notification; redeems by calling `redeemVoucher` which transfers stablecoin to vendor wallet.
* **Treasury/Admin:** allocate funds to zones, create voucher batches (e.g., 10k food vouchers), set expiry, and do reconciliations.

---

## 6. Spend-Control Patterns (Mandatory Voucher Flow)

1. **Voucher-based (Standard):** All aid is issued as digital vouchers (QR codes) encoding allowed categories, max value, and authorized disaster zones. This is the primary mechanism to ensure zero leakage and spend accountability.
2. **Merchant Allowlist:** Vendors must be registered in the `VendorRegistry` to redeem vouchers.
3. **Redemption settled in USDC:** When a vendor scans a voucher, the contract verifies the voucher and instantly settles the denominated USDC amount to the vendor's wallet.


---

## 7. Offline & Low-Connectivity Support

* PWA with service-worker caching of key assets & offline UI flows.
* IndexedDB queue for offline voucher claims and redemption attempts. Use background sync to push transactions when reconnected.
* QR-based voucher redemption allows completely offline handover (voucher code generated on-chain earlier or cached then finalized when online).
* Receipts and proofs stored locally until sync.

---

## 8. Weilchain-Specific Engineering

* **chains.ts** includes mainnet/testnet configs (RPC primary/backup). Provide `switchToWeilchain` helper.
* **Gas optimization:** EIP-1559 with heuristics, subsidize gas for beneficiaries via relayer contracts.
* **RPC resilience:** multi-RPC fallback, circuit-breaker, exponential backoff.
* **Batch operations:** use multicall for reads and batch voucher issuance.
* **Event streaming:** WebSocket listener for real-time updates.

---

## 9. Security, Privacy & Compliance

* **PII:** store off-chain encrypted (e.g., S3 with KMS), only hash on-chain. Minimal PII on client / cookie.
* **CSP, XSS, Rate-limiting:** strict headers, DOMPurify for uploads, upstash or redis-based rate-limiting.
* **Role-based access:** wallet-based roles with contract-level admin checks.
* **Auditability:** transaction and action logs anchored on-chain; periodic merkle-root anchoring for backend logs.
* **Fraud controls:** double-spend prevention via nonce on voucher, duplicate claim detection in Oracle workflow.
* **Financial compliance:** KYC for vendors and bigger donors; configurable by jurisdiction.

---

## 10. Monitoring, Analytics & Transparency

* Real-time dashboards (admin + public transparency page) that render on-chain events and reconciled off-chain records.
* Sentry for errors; custom transaction logging for each critical smart contract call.
* Donor-facing transparency reports: trace donations → allocations → redemptions with block hashes and receipts.

---

## 11. Testing & QA

* Unit tests for contracts (Hardhat/Foundry) and frontend (Jest/RTL).
* Integration tests on Weilchain testnet for contract flows.
* E2E Playwright tests for critical UX (wallet connect, voucher claim, redemption).
* Load testing for RPC endpoints and multicall stress tests (k6).

---

## 12. Deployment & CI/CD

* **Docker multi-stage builds** for frontend (Next.js standalone). Environment secrets via vault or provider secrets.
* **CI pipeline**: build → test → docker image → staging deploy → smoke tests → production deploy.
* **Scripts**: `deploy.sh` for Weilchain contract verification and front-end rollout.

---

## 13. MVP Scope (Minimum to ship)

1. USDC stablecoin support + Treasury deposit flow
2. Disaster zone creation & allocation (admin)
3. Beneficiary verification workflow (document upload + oracle approval off-chain)
4. Voucher issuing, claiming, and redemption flows on-chain
5. Donor transparency dashboard
6. Wallet connect (MetaMask, WalletConnect) and Weilchain switch
7. PWA offline voucher claim queue and basic IndexedDB caching

---

## 14. Deliverables & To‑dos (Actionable list)

* Contracts: `USDC`, `Treasury`, `VoucherFactory`, `VoucherManager`, `DisasterZoneManager`, `VendorRegistry`, `OracleManager`.
* Frontend: Next.js app scaffold with role portals (Donor, Beneficiary, Vendor, **Government**, **Oracle**) and Weilchain hooks (`useWeilchain.ts`).
* Backend: verification API, encrypted storage, webhook for on‑chain event processing.
* Monitoring: Sentry, analytics endpoints, public transparency page.
* Testing: contract unit tests, integration scripts, Playwright scenarios.
* Docs: `PLAN.md`, API spec, contract ABI docs, deployment README.

---

## 15. 🏛️ GOVERNMENT USER FLOW

### Role Purpose

Government users provide **official oversight and legitimacy** without slowing execution. They approve disaster zones, monitor fund usage, and audit compliance — but never custody funds.

---

### Journey: Oversight, Approval & Transparency

#### Step 1: Government Authentication

```
Route: /government
Component: RoleGuard (requires 'government' role)
```

* Wallet-based login
* Role verified via `GovernmentRegistry` contract
* Permissions scoped per disaster zone

---

#### Step 2: Government Dashboard Overview

```
🏛️ Government Oversight Portal
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Active Disaster Zones: 6
Beneficiaries Verified: 4,210
Vendors Approved: 132
Total USDC Allocated: $1.2M
Total USDC Redeemed: $820K

[Review Zones] [Audit Funds] [Compliance Reports]
```

All metrics are sourced directly from on-chain USDC events.

---

#### Step 3: Disaster Zone Approval

```
Route: /government/zones/[zoneId]
```

Government officials can:

* Validate disaster legitimacy
* Approve or flag zones
* Request clarifications from admins

**On approval:**

* `ZoneApprovedByGovernment` event emitted
* Donations and beneficiary verification unlocked automatically

---

#### Step 4: Fund Utilization Monitoring

Government users can:

* Track USDC inflow → allocation → redemption
* Drill down to vendor-wise and category-wise spending
* Detect anomalies (velocity spikes, concentration)

---

#### Step 5: Compliance & Reporting

* Download audit-ready reports (CSV/PDF)
* View anonymized beneficiary statistics
* Export transaction hashes for external audits

---

## 16. 🧠 ORACLE USER FLOW & DASHBOARD

### Role Purpose

Oracles are independent **verification agents** who enable speed without sacrificing trust. They validate beneficiary claims and anchor decisions on-chain.

---

### Journey: Verification & Trust Anchoring

#### Step 1: Oracle Authentication

```
Route: /oracle
Component: RoleGuard (requires 'oracle' role)
```

* Wallet-based login
* Role verified via `OracleManager` contract

---

#### Step 2: Oracle Dashboard Overview

```
🧠 Oracle Verification Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pending Verifications: 48
Approved Today: 132
Rejected Today: 7
Average Review Time: 6 minutes

[Review Queue] [Fraud Alerts] [Performance Stats]
```

---

#### Step 3: Verification Queue

Each request includes:

* Beneficiary ID (hashed)
* Disaster zone
* Documents & location proof
* Duplicate-claim status

Actions:

* Approve
* Reject (with reason)
* Escalate to Admin/Government

---

#### Step 4: Decision Anchoring

**Approve:** emits `BeneficiaryVerified` → vouchers unlocked instantly.

**Reject:** reason logged, beneficiary notified.

**Escalate:** pauses flow pending review.

All decisions are logged off-chain and cryptographically anchored on-chain.

---

#### Step 5: Oracle Accountability

* Reputation score
* Average review time
* False-positive rate

Poor performance can trigger oracle removal via governance.

---

## 17. Why Government + Oracle Flows Strengthen the USP

### 📏 Governance & Verification Speed Metrics

| Metric                              | Traditional Systems | SecureRelief (USDC‑based)  |
| ----------------------------------- | ------------------- | -------------------------- |
| **Disaster Zone Approval Time**     | 3–14 days           | **< 30 minutes**           |
| **Beneficiary Verification Time**   | 2–7 days            | **5–15 minutes**           |
| **Verification → Aid Unlock Delay** | Manual follow‑ups   | **Instant (event‑driven)** |
| **Audit Report Generation**         | Days / weeks        | **Instant export**         |
| **Decision Traceability**           | Fragmented records  | **100% on‑chain anchored** |

### Why This Matters

* **Government retains oversight without custody** — no fund handling, no bottlenecks.
* **Oracles compress verification time** while remaining accountable via reputation metrics.
* **Event‑driven approvals** remove human latency from the aid pipeline.
* **Institutions gain trust** without slowing execution.

Together, government oversight + oracle verification ensure **USDC‑based aid remains fast, compliant, and abuse‑resistant** — a critical requirement for large‑scale disaster response.
