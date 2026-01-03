import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'

class PinataService {
  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_PINATA_API_KEY
    this.secretKey = process.env.NEXT_PUBLIC_PINATA_SECRET_KEY
    this.gatewayUrl = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud'

    this.client = axios.create({
      baseURL: 'https://api.pinata.cloud',
      headers: {
        'pinata_api_key': this.apiKey,
        'pinata_secret_api_key': this.secretKey,
      }
    })
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(file, metadata = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name,
        keyvalues: {
          app: 'disaster-relief',
          timestamp: Date.now().toString(),
          ...metadata.keyvalues
        }
      })
      formData.append('pinataMetadata', pinataMetadata)

      const pinataOptions = JSON.stringify({
        cidVersion: 0,
      })
      formData.append('pinataOptions', pinataOptions)

      const response = await this.client.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      })

      return {
        success: true,
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        url: `${this.gatewayUrl}/ipfs/${response.data.IpfsHash}`
      }
    } catch (error) {
      console.error('Pinata upload error:', error)
      throw new Error('Failed to upload file to IPFS')
    }
  }

  /**
   * Upload JSON data to IPFS
   */
  async uploadJSON(data, metadata = {}) {
    try {
      const body = {
        pinataContent: data,
        pinataMetadata: {
          name: metadata.name || 'json-data',
          keyvalues: {
            app: 'disaster-relief',
            timestamp: Date.now().toString(),
            ...metadata.keyvalues
          }
        },
        pinataOptions: {
          cidVersion: 0,
        }
      }

      const response = await this.client.post('/pinning/pinJSONToIPFS', body)

      return {
        success: true,
        hash: response.data.IpfsHash,
        size: response.data.PinSize,
        url: `${this.gatewayUrl}/ipfs/${response.data.IpfsHash}`
      }
    } catch (error) {
      console.error('Pinata JSON upload error:', error)
      throw new Error('Failed to upload JSON to IPFS')
    }
  }

  /**
   * Get file from IPFS
   */
  async getFile(hash) {
    try {
      const response = await axios.get(`${this.gatewayUrl}/ipfs/${hash}`)
      return response.data
    } catch (error) {
      console.error('IPFS retrieval error:', error)
      throw new Error('Failed to retrieve file from IPFS')
    }
  }

  /**
   * List pinned files
   */
  async listPinned(filters = {}) {
    try {
      const params = {
        status: 'pinned',
        pageLimit: 10,
        ...filters
      }

      const response = await this.client.get('/data/pinList', { params })

      return {
        success: true,
        files: response.data.rows || [],
        count: response.data.count || 0
      }
    } catch (error) {
      console.error('Pinata list error:', error)
      throw new Error('Failed to list pinned files')
    }
  }

  /**
   * Unpin file from IPFS
   */
  async unpinFile(hash) {
    try {
      await this.client.delete(`/pinning/unpin/${hash}`)
      return { success: true }
    } catch (error) {
      console.error('Pinata unpin error:', error)
      throw new Error('Failed to unpin file')
    }
  }

  /**
   * Test Pinata connection
   */
  async testConnection() {
    try {
      const response = await this.client.get('/data/testAuthentication')
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!'
    } catch (error) {
      console.error('Pinata connection test failed:', error)
      return false
    }
  }

  /**
   * Upload proof of aid with structured metadata
   */
  async uploadProofOfAid(file, aidData) {
    const metadata = {
      name: `proof-of-aid-${aidData.voucherId}-${Date.now()}`,
      keyvalues: {
        type: 'proof-of-aid',
        voucherId: aidData.voucherId.toString(),
        vendorAddress: aidData.vendorAddress,
        beneficiaryAddress: aidData.beneficiaryAddress,
        category: aidData.category,
        amount: aidData.amount.toString(),
        disasterZoneId: aidData.disasterZoneId.toString(),
        timestamp: Date.now().toString(),
        location: aidData.location || '',
      }
    }

    return this.uploadFile(file, metadata)
  }

  /**
   * Get proof of aid files for a specific voucher
   */
  async getProofOfAidByVoucher(voucherId) {
    try {
      const filters = {
        keyvalues: {
          type: {
            value: 'proof-of-aid',
            op: 'eq'
          },
          voucherId: {
            value: voucherId.toString(),
            op: 'eq'
          }
        }
      }

      return this.listPinned(filters)
    } catch (error) {
      console.error('Error getting proof of aid:', error)
      throw new Error('Failed to retrieve proof of aid')
    }
  }
}

export default new PinataService()
