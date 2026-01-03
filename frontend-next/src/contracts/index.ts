// Contract ABIs for frontend integration
// Generated from compiled Solidity contracts

export const DISASTER_RELIEF_ABI = [
  // View functions
  "function owner() external view returns (address)",
  "function admins(address) external view returns (bool)",
  "function vendors(address) external view returns (bool)",
  "function disasterZoneCounter() external view returns (uint256)",
  "function voucherCounter() external view returns (uint256)",
  "function proofCounter() external view returns (uint256)",
  
  // Disaster zone functions
  "function getDisasterZone(uint256 _zoneId) external view returns (tuple(uint256 id, string name, int256 latitude, int256 longitude, uint256 radius, uint256 initialFunding, uint256 currentFunding, uint256 totalSpent, bool active, uint256 createdAt, address createdBy))",
  "function createDisasterZone(string memory _name, int256 _latitude, int256 _longitude, uint256 _radius, uint256 _initialFunding) external returns (uint256)",
  "function updateDisasterZoneStatus(uint256 _zoneId, bool _active) external",
  "function addFunding(uint256 _zoneId, uint256 _amount) external",
  "function getDisasterZoneStats(uint256 _zoneId) external view returns (string memory name, bool active, uint256 initialFunding, uint256 currentFunding, uint256 totalSpent, uint256 vendorCount)",
  
  // Vendor functions
  "function getVendor(address _vendorAddress) external view returns (tuple(address vendorAddress, string name, string location, uint256 disasterZoneId, string ipfsKycHash, bool verified, uint256 totalRedeemed, uint256 transactionCount, uint256 reputationScore, uint256 registeredAt))",
  "function registerVendor(address _vendorAddress, string memory _name, string memory _location, uint256 _disasterZoneId, string memory _ipfsKycHash) external",
  "function verifyVendor(address _vendorAddress, uint256 _disasterZoneId) external",
  "function getZoneVendors(uint256 _zoneId) external view returns (address[] memory)",
  
  // Voucher functions
  "function getVoucher(uint256 _voucherId) external view returns (tuple(uint256 id, address beneficiary, uint256 amount, uint256 disasterZoneId, string[] allowedCategories, uint256 createdAt, uint256 expiryTime, bool used, address usedBy, uint256 usedAt))",
  "function issueVoucher(address _beneficiary, uint256 _amount, uint256 _disasterZoneId, string[] memory _allowedCategories, uint256 _expiryDays) external returns (uint256)",
  "function redeemVoucher(uint256 _voucherId, uint256 _amount, string memory _category, string memory _ipfsHash) external",
  "function getUserVouchers(address _user) external view returns (uint256[] memory)",
  
  // Proof functions
  "function getProofOfAid(uint256 _proofId) external view returns (tuple(uint256 id, uint256 voucherId, uint256 amount, address vendor, address beneficiary, string ipfsHash, string category, uint256 timestamp, bool verified))",
  "function verifyProofOfAid(uint256 _proofId) external",
  "function getVendorTransactions(address _vendor) external view returns (uint256[] memory)",
  
  // Admin functions
  "function addAdmin(address _admin) external",
  "function removeAdmin(address _admin) external",
  "function emergencyPause(uint256 _zoneId) external",
  "function emergencyWithdraw(uint256 _zoneId, uint256 _amount) external",
  
  // Events
  "event DisasterZoneCreated(uint256 indexed zoneId, string name, int256 latitude, int256 longitude, uint256 radius, uint256 funding, address indexed creator)",
  "event VendorRegistered(address indexed vendor, uint256 indexed zoneId, string name, string ipfsKycHash)",
  "event VendorVerified(address indexed vendor, uint256 indexed zoneId, address indexed verifier)",
  "event VoucherIssued(uint256 indexed voucherId, address indexed beneficiary, uint256 amount, uint256 indexed disasterZoneId, string[] allowedCategories)",
  "event VoucherRedeemed(uint256 indexed voucherId, address indexed vendor, address indexed beneficiary, uint256 amount, string category)",
  "event ProofOfAidSubmitted(uint256 indexed proofId, uint256 indexed voucherId, address indexed vendor, string ipfsHash, string category, uint256 amount)",
  "event FundsDeposited(uint256 indexed zoneId, uint256 amount, address indexed depositor)"
];

export const MOCK_USDC_ABI = [
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)",
  "function totalSupply() external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function faucet() external",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Contract addresses - Updated after deployment to Avalanche Fuji testnet
export const CONTRACT_ADDRESSES = {
  DISASTER_RELIEF_SYSTEM: "0x6a66fE30D16eceF92752A6C005f474b6125f847D",
  MOCK_USDC: "0xcB238E70da4Bf99b0c0e77c7f871c22b46e0980A",
  FUJI_USDC: "0x5425890298aed601595a70AB815c96711a31Bc65" // Official Fuji USDC (backup)
};

// Network configuration
export const AVALANCHE_CONFIG = {
  chainId: 43113,
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'AVAX',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
};

// Helper functions for contract interaction
export const CONTRACT_HELPERS = {
  // Format latitude/longitude for contract (multiply by 1e6 for precision)
  formatCoordinates: (lat, lng) => ({
    latitude: Math.round(lat * 1e6),
    longitude: Math.round(lng * 1e6)
  }),
  
  // Convert contract coordinates back to decimal
  parseCoordinates: (lat, lng) => ({
    latitude: lat / 1e6,
    longitude: lng / 1e6
  }),
  
  // Format USDC amount (6 decimals)
  formatUSDCAmount: (amount) => {
    return (amount * 1e6).toString();
  },
  
  // Parse USDC amount from contract
  parseUSDCAmount: (amount) => {
    return Number(amount) / 1e6;
  },
  
  // Calculate distance between two points (Haversine formula)
  calculateDistance: (lat1, lng1, lat2, lng2) => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  },
  
  // Check if coordinates are within disaster zone
  isWithinDisasterZone: (userLat, userLng, zoneLat, zoneLng, radius) => {
    const distance = CONTRACT_HELPERS.calculateDistance(
      userLat, userLng, 
      CONTRACT_HELPERS.parseCoordinates(zoneLat, zoneLng).latitude,
      CONTRACT_HELPERS.parseCoordinates(zoneLat, zoneLng).longitude
    );
    return distance <= radius;
  },

  // Utility: parse BigInt or BigNumber to number safely
  toNumber: (v) => {
    try {
      if (typeof v === 'bigint') return Number(v);
      if (typeof v === 'string') return Number(v);
      if (v && typeof v.toString === 'function') return Number(v.toString());
      return Number(v);
    } catch {
      return 0;
    }
  }
};
