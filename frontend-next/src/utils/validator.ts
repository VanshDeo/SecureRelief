/**
 * Comprehensive Validation Utility
 * Provides professional form validation with detailed error messages
 */

// Validation rule types
export const VALIDATION_TYPES = {
  REQUIRED: 'required',
  EMAIL: 'email',
  PHONE: 'phone',
  URL: 'url',
  NUMBER: 'number',
  POSITIVE_NUMBER: 'positiveNumber',
  INTEGER: 'integer',
  DECIMAL: 'decimal',
  MIN_LENGTH: 'minLength',
  MAX_LENGTH: 'maxLength',
  MIN_VALUE: 'minValue',
  MAX_VALUE: 'maxValue',
  PATTERN: 'pattern',
  CUSTOM: 'custom',
  ETHEREUM_ADDRESS: 'ethereumAddress',
  LATITUDE: 'latitude',
  LONGITUDE: 'longitude',
  COORDINATE: 'coordinate',
  DISASTER_NAME: 'disasterName',
  FUNDING_AMOUNT: 'fundingAmount'
}

/**
 * Validation rules and error messages
 */
export const VALIDATION_RULES = {
  [VALIDATION_TYPES.REQUIRED]: {
    test: (value) => value !== null && value !== undefined && value !== '',
    message: 'This field is required'
  },
  
  [VALIDATION_TYPES.EMAIL]: {
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'Please enter a valid email address'
  },
  
  [VALIDATION_TYPES.PHONE]: {
    test: (value) => /^\+?[\d\s-()]+$/.test(value) && value.replace(/\D/g, '').length >= 10,
    message: 'Please enter a valid phone number'
  },
  
  [VALIDATION_TYPES.URL]: {
    test: (value) => {
      try {
        new URL(value)
        return true
      } catch {
        return false
      }
    },
    message: 'Please enter a valid URL'
  },
  
  [VALIDATION_TYPES.NUMBER]: {
    test: (value) => !isNaN(parseFloat(value)) && isFinite(value),
    message: 'Please enter a valid number'
  },
  
  [VALIDATION_TYPES.POSITIVE_NUMBER]: {
    test: (value) => !isNaN(parseFloat(value)) && parseFloat(value) > 0,
    message: 'Please enter a positive number'
  },
  
  [VALIDATION_TYPES.INTEGER]: {
    test: (value) => Number.isInteger(parseFloat(value)),
    message: 'Please enter a whole number'
  },
  
  [VALIDATION_TYPES.ETHEREUM_ADDRESS]: {
    test: (value) => /^0x[a-fA-F0-9]{40}$/.test(value),
    message: 'Please enter a valid Ethereum address'
  },
  
  [VALIDATION_TYPES.LATITUDE]: {
    test: (value) => {
      const num = parseFloat(value)
      return !isNaN(num) && num >= -90 && num <= 90
    },
    message: 'Latitude must be between -90 and 90 degrees'
  },
  
  [VALIDATION_TYPES.LONGITUDE]: {
    test: (value) => {
      const num = parseFloat(value)
      return !isNaN(num) && num >= -180 && num <= 180
    },
    message: 'Longitude must be between -180 and 180 degrees'
  },
  
  [VALIDATION_TYPES.DISASTER_NAME]: {
    test: (value) => {
      return value && 
             value.length >= 3 && 
             value.length <= 100 && 
             /^[a-zA-Z0-9\s\-_.()]+$/.test(value)
    },
    message: 'Disaster name must be 3-100 characters and contain only letters, numbers, spaces, and basic punctuation'
  },
  
  [VALIDATION_TYPES.FUNDING_AMOUNT]: {
    test: (value) => {
      const num = parseFloat(value)
      return !isNaN(num) && num >= 100 && num <= 10000000
    },
    message: 'Funding amount must be between $100 and $10,000,000'
  }
}

/**
 * Field validation schemas
 */
export const VALIDATION_SCHEMAS = {
  // Disaster Zone Creation
  disasterZone: {
    name: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.DISASTER_NAME
    ],
    description: [
      VALIDATION_TYPES.REQUIRED,
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 10, message: 'Description must be at least 10 characters' },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 1000, message: 'Description must be less than 1000 characters' }
    ],
    disasterType: [
      VALIDATION_TYPES.REQUIRED
    ],
    latitude: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.LATITUDE
    ],
    longitude: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.LONGITUDE
    ],
    radiusKm: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.POSITIVE_NUMBER,
      { type: VALIDATION_TYPES.MIN_VALUE, value: 0.1, message: 'Radius must be at least 0.1 km' },
      { type: VALIDATION_TYPES.MAX_VALUE, value: 1000, message: 'Radius cannot exceed 1000 km' }
    ],
    initialFundingUSDC: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.FUNDING_AMOUNT
    ],
    estimatedAffected: [
      { type: VALIDATION_TYPES.INTEGER, required: false },
      { type: VALIDATION_TYPES.MIN_VALUE, value: 1, required: false, message: 'Must be at least 1 person' }
    ]
  },

  // Vendor Registration
  vendor: {
    name: [
      VALIDATION_TYPES.REQUIRED,
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 2, message: 'Vendor name must be at least 2 characters' },
      { type: VALIDATION_TYPES.MAX_LENGTH, value: 100, message: 'Vendor name must be less than 100 characters' }
    ],
    vendorAddress: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.ETHEREUM_ADDRESS
    ],
    location: [
      VALIDATION_TYPES.REQUIRED,
      { type: VALIDATION_TYPES.MIN_LENGTH, value: 5, message: 'Location must be at least 5 characters' }
    ],
    email: [
      VALIDATION_TYPES.EMAIL
    ],
    phone: [
      VALIDATION_TYPES.PHONE
    ]
  },

  // Voucher Issuance
  voucher: {
    beneficiaryAddress: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.ETHEREUM_ADDRESS
    ],
    amount: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.POSITIVE_NUMBER,
      { type: VALIDATION_TYPES.MIN_VALUE, value: 1, message: 'Voucher amount must be at least $1' },
      { type: VALIDATION_TYPES.MAX_VALUE, value: 10000, message: 'Voucher amount cannot exceed $10,000' }
    ],
    categories: [
      { type: VALIDATION_TYPES.CUSTOM, test: (value) => Array.isArray(value) && value.length > 0, message: 'At least one category must be selected' }
    ],
    expiryDays: [
      VALIDATION_TYPES.REQUIRED,
      VALIDATION_TYPES.INTEGER,
      { type: VALIDATION_TYPES.MIN_VALUE, value: 1, message: 'Expiry must be at least 1 day' },
      { type: VALIDATION_TYPES.MAX_VALUE, value: 365, message: 'Expiry cannot exceed 365 days' }
    ]
  }
}

/**
 * Enhanced Validator class
 */
export class Validator {
  constructor() {
    this.customRules = new Map()
  }

  /**
   * Add custom validation rule
   */
  addCustomRule(name, rule) {
    this.customRules.set(name, rule)
  }

  /**
   * Validate a single field
   */
  validateField(value, rules, fieldName = 'Field') {
    const errors = []

    for (const rule of rules) {
      let ruleType, ruleValue, ruleMessage, required = true

      if (typeof rule === 'string') {
        ruleType = rule
      } else if (typeof rule === 'object') {
        ruleType = rule.type
        ruleValue = rule.value
        ruleMessage = rule.message
        required = rule.required !== false
      }

      // Skip validation if field is empty and not required
      if (!required && (value === null || value === undefined || value === '')) {
        continue
      }

      const validationRule = VALIDATION_RULES[ruleType] || this.customRules.get(ruleType)
      
      if (!validationRule) {
        console.warn(`Unknown validation rule: ${ruleType}`)
        continue
      }

      let isValid
      if (ruleType === VALIDATION_TYPES.MIN_LENGTH) {
        isValid = value && value.length >= ruleValue
      } else if (ruleType === VALIDATION_TYPES.MAX_LENGTH) {
        isValid = !value || value.length <= ruleValue
      } else if (ruleType === VALIDATION_TYPES.MIN_VALUE) {
        isValid = parseFloat(value) >= ruleValue
      } else if (ruleType === VALIDATION_TYPES.MAX_VALUE) {
        isValid = parseFloat(value) <= ruleValue
      } else if (ruleType === VALIDATION_TYPES.PATTERN) {
        isValid = new RegExp(ruleValue).test(value)
      } else if (ruleType === VALIDATION_TYPES.CUSTOM) {
        isValid = rule.test(value)
      } else {
        isValid = validationRule.test(value)
      }

      if (!isValid) {
        errors.push({
          field: fieldName,
          rule: ruleType,
          message: ruleMessage || validationRule.message || `Invalid ${fieldName.toLowerCase()}`
        })
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Validate an entire form using a schema
   */
  validateForm(formData, schema) {
    const results = {}
    const allErrors = []

    for (const [fieldName, rules] of Object.entries(schema)) {
      const fieldValue = formData[fieldName]
      const fieldResult = this.validateField(fieldValue, rules, fieldName)
      
      results[fieldName] = fieldResult
      if (!fieldResult.isValid) {
        allErrors.push(...fieldResult.errors)
      }
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      fieldResults: results
    }
  }

  /**
   * Get formatted error messages for display
   */
  getErrorMessages(validationResult) {
    const errorMessages = {}
    
    if (validationResult.fieldResults) {
      for (const [fieldName, result] of Object.entries(validationResult.fieldResults)) {
        if (!result.isValid && result.errors.length > 0) {
          errorMessages[fieldName] = result.errors[0].message
        }
      }
    }
    
    return errorMessages
  }

  /**
   * Real-time field validation
   */
  validateFieldRealTime(value, rules, fieldName) {
    const result = this.validateField(value, rules, fieldName)
    return {
      isValid: result.isValid,
      error: result.errors.length > 0 ? result.errors[0].message : null
    }
  }

  /**
   * Validate coordinates (latitude, longitude)
   */
  validateCoordinates(latitude, longitude) {
    const latResult = this.validateField(latitude, [VALIDATION_TYPES.LATITUDE], 'Latitude')
    const lngResult = this.validateField(longitude, [VALIDATION_TYPES.LONGITUDE], 'Longitude')
    
    return {
      isValid: latResult.isValid && lngResult.isValid,
      errors: [...latResult.errors, ...lngResult.errors]
    }
  }

  /**
   * Validate Ethereum address with checksum
   */
  validateEthereumAddress(address, requireChecksum = false) {
    if (!address || typeof address !== 'string') {
      return { isValid: false, error: 'Address is required' }
    }

    // Basic format check
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return { isValid: false, error: 'Invalid Ethereum address format' }
    }

    // Checksum validation if required
    if (requireChecksum) {
      // This would require ethers.js or web3.js for proper checksum validation
      // For now, we'll just check if it's mixed case (indicating checksum)
      const hasUpperCase = /[A-F]/.test(address.slice(2))
      const hasLowerCase = /[a-f]/.test(address.slice(2))
      
      if (hasUpperCase && hasLowerCase) {
        // TODO: Implement proper checksum validation
        return { isValid: true }
      } else if (address === address.toLowerCase() || address === address.toUpperCase()) {
        return { isValid: true } // All lowercase or uppercase is acceptable
      } else {
        return { isValid: false, error: 'Invalid address checksum' }
      }
    }

    return { isValid: true }
  }

  /**
   * Sanitize input data
   */
  sanitizeInput(value, type = 'string') {
    if (value === null || value === undefined) {
      return ''
    }

    switch (type) {
      case 'string':
        return String(value).trim()
      case 'number':
        const num = parseFloat(value)
        return isNaN(num) ? 0 : num
      case 'integer':
        const int = parseInt(value)
        return isNaN(int) ? 0 : int
      case 'boolean':
        return Boolean(value)
      case 'address':
        return String(value).trim().toLowerCase()
      default:
        return value
    }
  }

  /**
   * Format validation errors for API response
   */
  formatApiErrors(errors) {
    return errors.map(error => ({
      field: error.field,
      message: error.message,
      code: error.rule
    }))
  }
}

// Create singleton instance
export const validator = new Validator()

// Pre-configured validation functions
export const validateDisasterZone = (data) => 
  validator.validateForm(data, VALIDATION_SCHEMAS.disasterZone)

export const validateVendor = (data) => 
  validator.validateForm(data, VALIDATION_SCHEMAS.vendor)

export const validateVoucher = (data) => 
  validator.validateForm(data, VALIDATION_SCHEMAS.voucher)

export const validateField = (value, rules, fieldName) => 
  validator.validateField(value, rules, fieldName)

export const validateCoordinates = (lat, lng) => 
  validator.validateCoordinates(lat, lng)

export const validateEthereumAddress = (address, requireChecksum) => 
  validator.validateEthereumAddress(address, requireChecksum)

export default validator
