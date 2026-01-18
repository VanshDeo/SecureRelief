// src/lib.rs
mod state;
mod types;
pub mod modules; // <--- NEW: Exposes your business logic modules

use serde::{Deserialize, Serialize};
use weil_macros::{constructor, mutate, query, smart_contract, WeilType};
use weil_rs::collections::map::WeilMap;
use weil_rs::collections::WeilId;
use weil_rs::runtime::Runtime;
// We don't need HttpClient here anymore, it's hidden inside modules/oracle_mcp.rs!
use weil_contracts::fungible::FungibleToken;

use crate::state::AidDistributorState;
use crate::types::{Voucher, DisasterZone, Vendor};

// The WIDL Interface Definition remains the same
pub trait AidDistributor {
    fn new() -> Result<Self, String> where Self: Sized;

    // --- USDC Standard Wrappers ---
    async fn name(&self) -> String;
    async fn symbol(&self) -> String;
    async fn balance_for(&self, addr: String) -> u64;
    async fn transfer(&mut self, to: String, amount: u64) -> Result<(), String>;

    // --- Disaster Logic ---
    async fn add_disaster_zone(&mut self, zone_id: String, name: String, initial_budget: u64) -> Result<(), String>;
    async fn allocate_budget(&mut self, zone_id: String, amount: u64) -> Result<(), String>;

    // --- Vendor Logic ---
    async fn register_vendor(&mut self, vendor_addr: String, category: String) -> Result<(), String>;

    // --- Voucher Logic ---
    async fn issue_voucher(&mut self, beneficiary_id: String, zone_id: String, amount: u64, expiry_days: u64) -> Result<String, String>;
    async fn redeem_voucher(&mut self, voucher_id: String) -> Result<(), String>;

    // --- MCP / Oracle Logic ---
    async fn verify_beneficiary_external(&mut self, beneficiary_id: String, proof_url: String) -> Result<bool, String>;
}

#[smart_contract]
impl AidDistributor for AidDistributorState {
    
    // The Constructor sets up the database.
    // We keep this here because it defines the "Genesis" state of your Applet.
    #[constructor]
    fn new() -> Result<Self, String> where Self: Sized {
        let mut token = FungibleToken::new("AidUSDC".to_string(), "USDC".to_string());
        token.mint(1_000_000_000_000).map_err(|e| e.to_string())?; 

        Ok(AidDistributorState {
            usdc: token,
            vouchers: WeilMap::new(WeilId(1)), 
            disaster_zones: WeilMap::new(WeilId(2)),
            vendors: WeilMap::new(WeilId(3)),
            verified_beneficiaries: WeilMap::new(WeilId(4)),
        })
    }

    // --- USDC Standard Wrappers ---
    #[query]
    async fn name(&self) -> String { self.usdc.name() }

    #[query]
    async fn symbol(&self) -> String { self.usdc.symbol() }

    #[query]
    async fn balance_for(&self, addr: String) -> u64 { self.usdc.balance_for(addr).unwrap_or(0) }

    #[mutate]
    async fn transfer(&mut self, to: String, amount: u64) -> Result<(), String> {
        // Delegate to modules/token.rs
        self.execute_usdc_transfer(to, amount)
    }

    // --- Disaster Logic ---
    #[mutate]
    async fn add_disaster_zone(&mut self, zone_id: String, name: String, initial_budget: u64) -> Result<(), String> {
        // Delegate to modules/registries.rs
        self.internal_add_zone(zone_id, name, initial_budget)
    }

    #[mutate]
    async fn allocate_budget(&mut self, zone_id: String, amount: u64) -> Result<(), String> {
        // Delegate to modules/registries.rs
        self.internal_allocate_budget(zone_id, amount)
    }

    // --- Vendor Logic ---
    #[mutate]
    async fn register_vendor(&mut self, vendor_addr: String, category: String) -> Result<(), String> {
        // Delegate to modules/registries.rs
        self.internal_register_vendor(vendor_addr, category)
    }

    // --- Voucher Logic ---
    #[mutate]
    async fn issue_voucher(&mut self, beneficiary_id: String, zone_id: String, amount: u64, expiry_days: u64) -> Result<String, String> {
        // Delegate to modules/voucher.rs
        // Notice how clean this is? The complex math and checks are hidden.
        self.internal_issue_voucher(beneficiary_id, zone_id, amount, expiry_days)
    }

    #[mutate]
    async fn redeem_voucher(&mut self, voucher_id: String) -> Result<(), String> {
        // Delegate to modules/voucher.rs
        self.internal_redeem_voucher(voucher_id)
    }

    // --- MCP / Oracle Logic ---
    #[mutate]
    async fn verify_beneficiary_external(&mut self, beneficiary_id: String, proof_url: String) -> Result<bool, String> {
        // Delegate to modules/oracle_mcp.rs
        self.internal_verify_beneficiary(beneficiary_id, proof_url)
    }
}
// ... existing code ...

// Add this at the end of the file
mod tests;