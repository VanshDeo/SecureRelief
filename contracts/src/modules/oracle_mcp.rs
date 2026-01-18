use crate::state::AidDistributorState;
use weil_rs::http::{HttpClient, HttpMethod};

impl AidDistributorState {
    
    pub fn internal_verify_beneficiary(
        &mut self, 
        beneficiary_id: String, 
        proof_url: String
    ) -> Result<bool, String> {
        
        // Check if already verified to save gas/resources
        if let Some(true) = self.verified_beneficiaries.get(&beneficiary_id) {
            return Ok(true);
        }

        // Active MCP Call: The contract "pulls" data
        let response = HttpClient::request(&proof_url, HttpMethod::Get)
            .send()
            .map_err(|e| format!("MCP HTTP Error: {:?}", e))?;

            let body = response.text();
if body.is_empty() {
    return Err("Empty response body".into());
}
        
        // Simple logic: assume server returns literal "true" string for valid proofs
        let is_verified = body.trim().eq_ignore_ascii_case("true");

        if is_verified {
            self.verified_beneficiaries.insert(beneficiary_id, true);
        }

        Ok(is_verified)
    }
}