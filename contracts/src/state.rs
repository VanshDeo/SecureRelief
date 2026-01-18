// src/state.rs
use serde::{Deserialize, Serialize};
use weil_macros::WeilType;
use weil_rs::collections::map::WeilMap;
use weil_contracts::fungible::FungibleToken;
use crate::types::{Voucher, DisasterZone, Vendor};

#[derive(Serialize, Deserialize, WeilType)]
pub struct AidDistributorState {
    // 1. Core Asset: The simulated USDC State
    // We delegate standard token storage to this verified library struct.
    pub usdc: FungibleToken,

    // 2. Storage Maps (Lazy Loaded)
    // Key: VoucherID -> Value: Voucher
    pub vouchers: WeilMap<String, Voucher>, 
    
    // Key: ZoneID -> Value: Zone Data
    pub disaster_zones: WeilMap<String, DisasterZone>,
    
    // Key: Vendor Address -> Value: Vendor Profile
    pub vendors: WeilMap<String, Vendor>,

    // 3. Oracle/MCP State
    // Key: Beneficiary ID -> Value: Is Verified?
    pub verified_beneficiaries: WeilMap<String, bool>,
}