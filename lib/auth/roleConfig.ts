import { UserRole } from "@/context/AuthContext";

// In a real app, these would be fetched from smart contracts or a backend
// For this MVP/Demo, we map hardcoded addresses to roles for testing.

export const ROLE_REGISTRY: Record<string, UserRole> = {
    // Admin
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266": "admin", // Hardhat Account #0

    // Government
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8": "agency", // Hardhat Account #1

    // Oracle
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC": "oracle", // Hardhat Account #2

    // Vendor
    "0x90F79bf6EB2c4f870365E785982E1f101E93b906": "vendor", // Hardhat Account #3

    // Beneficiary (Verified)
    "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65": "beneficiary", // Hardhat Account #4
};

export const getRoleByAddress = (address: string | undefined): UserRole => {
    if (!address) return "guest";

    // Normalize address
    const normalizedAddr = address; // In real app, checksum logic might be needed

    // Check direct match
    if (ROLE_REGISTRY[normalizedAddr]) {
        return ROLE_REGISTRY[normalizedAddr];
    }

    // Default for any other connected wallet is Donor (Permissionless)
    return "donor";
};
