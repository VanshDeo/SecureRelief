use weil_rs::runtime::Runtime;

pub fn generate_voucher_id(zone_id: &str, beneficiary_id: &str) -> String {
    // In production, you might want to hash this or add a nonce/timestamp
    // to allow issuing multiple vouchers to the same person over time.
    format!("{}_{}_{}", zone_id, beneficiary_id, Runtime::block_timestamp())
}

pub fn current_timestamp() -> u64 {
    Runtime::block_timestamp()
        .parse::<u64>()
        .unwrap_or(0)
}
