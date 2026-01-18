use crate::state::AidDistributorState;

impl AidDistributorState {
    /// Internal helper to check balance
    pub fn get_usdc_balance(&self, addr: String) -> u64 {
        self.usdc.balance_for(addr).unwrap_or(0)
    }

    /// Internal helper to execute transfers
    /// We keep this separate to easily add checks (e.g., pausing transfers) later.
    pub fn execute_usdc_transfer(&mut self, to: String, amount: u64) -> Result<(), String> {
        self.usdc.transfer(to, amount).map_err(|e| e.to_string())
    }
}