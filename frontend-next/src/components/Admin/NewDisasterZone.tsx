import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  DollarSign,
  AlertTriangle,
  Save,
  X,
  Map,
  Calendar,
  Globe,
  Info,
  CheckCircle
} from 'lucide-react'
import { useWeb3Store } from '../../store/web3Store'
import { useContract } from '../../hooks/useContract'
import apiService from '../../services/apiService'
import { errorHandler, handleError, showSuccess, showWarning } from '../../utils/errorHandler'
import { validator, validateDisasterZone, validateField } from '../../utils/validator'
import Modal from '../UI/Modal'
import Button from '../UI/Button'
import LoadingSpinner from '../UI/LoadingSpinner'

const NewDisasterZone = ({ isOpen, onClose, onSuccess }) => {
  const { isConnected, account, userRole } = useWeb3Store()
  const { createDisasterZone } = useContract()

  interface FormData {
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    radiusKm: string;
    initialFundingUSDC: string;
    severity: string;
    disasterType: string;
    estimatedAffected: string;
    urgencyLevel: string;
  }

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    latitude: '',
    longitude: '',
    radiusKm: '',
    initialFundingUSDC: '',
    severity: 'moderate',
    disasterType: '',
    estimatedAffected: '',
    urgencyLevel: 'normal'
  })
  const [errors, setErrors] = useState<Record<string, string | null>>({})

  const disasterTypes = [
    'Earthquake',
    'Flood',
    'Hurricane/Typhoon',
    'Wildfire',
    'Tsunami',
    'Volcanic Eruption',
    'Landslide',
    'Drought',
    'Tornado',
    'Other'
  ]

  const severityLevels = [
    { value: 'low', label: 'Low Impact', color: 'green' },
    { value: 'moderate', label: 'Moderate Impact', color: 'yellow' },
    { value: 'high', label: 'High Impact', color: 'orange' },
    { value: 'critical', label: 'Critical Impact', color: 'red' }
  ]

  const urgencyLevels = [
    { value: 'low', label: 'Low Priority', color: 'gray' },
    { value: 'normal', label: 'Normal Priority', color: 'blue' },
    { value: 'high', label: 'High Priority', color: 'orange' },
    { value: 'emergency', label: 'Emergency', color: 'red' }
  ]

  const steps = [
    {
      number: 1,
      title: 'Basic Information',
      description: 'Enter basic details about the disaster'
    },
    {
      number: 2,
      title: 'Location & Scope',
      description: 'Define the geographic area and scope'
    },
    {
      number: 3,
      title: 'Funding & Launch',
      description: 'Set initial funding and create the zone'
    }
  ]

  const validateStep = (step) => {
    let fieldsToValidate = {}

    if (step === 1) {
      fieldsToValidate = {
        name: formData.name,
        description: formData.description,
        disasterType: formData.disasterType
      }
    } else if (step === 2) {
      fieldsToValidate = {
        latitude: formData.latitude,
        longitude: formData.longitude,
        radiusKm: formData.radiusKm,
        estimatedAffected: formData.estimatedAffected
      }
    } else if (step === 3) {
      fieldsToValidate = {
        initialFundingUSDC: formData.initialFundingUSDC
      }
    }

    const validation = validateDisasterZone(fieldsToValidate)
    const errorMessages = validator.getErrorMessages(validation)

    setErrors(errorMessages)
    return validation.isValid
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Real-time validation
    if (errors[field]) {
      const fieldValidation = validateField(value, getFieldRules(field), field)
      if (fieldValidation.isValid) {
        setErrors(prev => ({ ...prev, [field]: null }))
      }
    }
  }

  const getFieldRules = (fieldName) => {
    const rules = {
      name: ['required', 'disasterName'],
      description: ['required', { type: 'minLength', value: 10 }],
      disasterType: ['required'],
      latitude: ['required', 'latitude'],
      longitude: ['required', 'longitude'],
      radiusKm: ['required', 'positiveNumber', { type: 'minValue', value: 0.1 }],
      initialFundingUSDC: ['required', 'fundingAmount']
    }
    return rules[fieldName] || []
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    if (!isConnected) {
      handleError(new Error('WALLET_NOT_CONNECTED'), {
        context: 'Disaster Zone Creation',
        onAction: () => {
          // Trigger wallet connection
          window.dispatchEvent(new CustomEvent('connectWallet'))
        }
      })
      return
    }

    if (userRole !== 'admin') {
      handleError(new Error('ADMIN_REQUIRED'), {
        context: 'Disaster Zone Creation'
      })
      return
    }

    setLoading(true)

    try {
      // Step 1: Create disaster zone on blockchain
      console.log('Creating disaster zone on blockchain...')

      const blockchainResult = await createDisasterZone({
        name: formData.name,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radiusKm: parseFloat(formData.radiusKm),
        initialFundingUSDC: parseFloat(formData.initialFundingUSDC)
      })

      if (!blockchainResult.success) {
        throw new Error(blockchainResult.error || 'Blockchain transaction failed')
      }

      console.log('Blockchain creation successful:', blockchainResult)

      // Step 2: Save to backend database for persistence
      try {
        console.log('Saving to backend database...')
        const backendData = {
          zoneId: blockchainResult.zoneId,
          name: formData.name,
          description: formData.description,
          latitude: parseFloat(formData.latitude),
          longitude: parseFloat(formData.longitude),
          radiusKm: parseFloat(formData.radiusKm),
          initialFundingUSDC: parseFloat(formData.initialFundingUSDC),
          disasterType: formData.disasterType,
          severity: formData.severity,
          urgencyLevel: formData.urgencyLevel,
          estimatedAffected: formData.estimatedAffected ? parseInt(formData.estimatedAffected) : null,
          txHash: blockchainResult.txHash,
          createdBy: account,
          status: 'active'
        }

        const backendResult = await apiService.createDisasterZone(backendData)
        console.log('Backend creation successful:', backendResult)

        showSuccess(`Disaster zone "${formData.name}" created successfully! TX: ${blockchainResult.txHash?.slice(0, 10)}...`)

        // Return combined result with both blockchain and backend data
        const combinedResult = {
          ...blockchainResult,
          backendData: backendResult.data,
          zoneData: {
            id: blockchainResult.zoneId,
            name: formData.name,
            description: formData.description,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            radiusKm: parseFloat(formData.radiusKm),
            initialFundingUSDC: parseFloat(formData.initialFundingUSDC),
            disasterType: formData.disasterType,
            severity: formData.severity,
            urgencyLevel: formData.urgencyLevel,
            estimatedAffected: formData.estimatedAffected ? parseInt(formData.estimatedAffected) : null,
            status: 'active',
            createdAt: new Date(),
            txHash: blockchainResult.txHash
          }
        }

        onSuccess?.(combinedResult)

      } catch (backendError) {
        console.warn('Backend save failed (likely server not running), but blockchain transaction succeeded:', backendError)
        showWarning(`Disaster zone "${formData.name}" created on blockchain! Backend sync will happen when server is available.`)

        // Still call onSuccess with blockchain data even if backend fails
        const blockchainOnlyResult = {
          ...blockchainResult,
          zoneData: {
            id: blockchainResult.zoneId,
            name: formData.name,
            description: formData.description,
            latitude: parseFloat(formData.latitude),
            longitude: parseFloat(formData.longitude),
            radiusKm: parseFloat(formData.radiusKm),
            initialFundingUSDC: parseFloat(formData.initialFundingUSDC),
            disasterType: formData.disasterType,
            severity: formData.severity,
            urgencyLevel: formData.urgencyLevel,
            estimatedAffected: formData.estimatedAffected ? parseInt(formData.estimatedAffected) : null,
            status: 'active',
            createdAt: new Date(),
            txHash: blockchainResult.txHash
          }
        }

        onSuccess?.(blockchainOnlyResult)
      }

      onClose()

      // Reset form
      setFormData({
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        radiusKm: '',
        initialFundingUSDC: '',
        severity: 'moderate',
        disasterType: '',
        estimatedAffected: '',
        urgencyLevel: 'normal'
      })
      setCurrentStep(1)
      setErrors({})

    } catch (error) {
      console.error('Error creating disaster zone:', error)
      handleError(error, {
        context: 'Disaster Zone Creation',
        userAction: 'Creating disaster zone',
        formData: { ...formData, account }
      })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      handleError(new Error('Geolocation is not supported by this browser'), {
        context: 'Location Detection'
      })
      return
    }

    showWarning('Requesting location access...')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)

        handleInputChange('latitude', lat)
        handleInputChange('longitude', lng)

        showSuccess(`Location detected: ${lat}, ${lng}`)
      },
      (error) => {
        let errorMessage = 'Could not get current location'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }

        handleError(new Error(errorMessage), {
          context: 'Location Detection',
          originalError: error
        })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className={`
            flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
            ${currentStep >= step.number
              ? 'bg-avalanche-500 border-avalanche-500 text-white'
              : 'border-gray-300 text-gray-400'
            }
          `}>
            {currentStep > step.number ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <span className="text-sm font-medium">{step.number}</span>
            )}
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-16 h-1 mx-3 rounded transition-all duration-200
              ${currentStep > step.number ? 'bg-avalanche-500' : 'bg-gray-200'}
            `} />
          )}
        </div>
      ))}
    </div>
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Disaster Zone" size="lg">
      <div className="space-y-6">
        <StepIndicator />

        {/* Step Content */}
        <div className="min-h-96">
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {steps[0].title}
                </h3>
                <p className="text-gray-600">{steps[0].description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Disaster Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Turkey Earthquake 2024"
                    className={`input-field ${errors.name ? 'border-red-300' : ''}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Disaster Type *
                  </label>
                  <select
                    value={formData.disasterType}
                    onChange={(e) => handleInputChange('disasterType', e.target.value)}
                    className={`input-field ${errors.disasterType ? 'border-red-300' : ''}`}
                  >
                    <option value="">Select disaster type</option>
                    {disasterTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.disasterType && <p className="mt-1 text-sm text-red-600">{errors.disasterType}</p>}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the disaster situation and relief needs..."
                    rows={4}
                    className={`input-field resize-none ${errors.description ? 'border-red-300' : ''}`}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Severity Level
                    </label>
                    <select
                      value={formData.severity}
                      onChange={(e) => handleInputChange('severity', e.target.value)}
                      className="input-field"
                    >
                      {severityLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Urgency Level
                    </label>
                    <select
                      value={formData.urgencyLevel}
                      onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                      className="input-field"
                    >
                      {urgencyLevels.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {steps[1].title}
                </h3>
                <p className="text-gray-600">{steps[1].description}</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                  <div className="flex items-start space-x-3">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900">Location Instructions</h4>
                      <p className="mt-1 text-sm text-blue-700">
                        Enter the center coordinates of the affected area. You can use the "Get Current Location"
                        button if you're at the disaster site, or use mapping tools to find precise coordinates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Latitude * <span className="text-gray-500">(-90 to 90)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      placeholder="e.g., 39.9208"
                      className={`input-field ${errors.latitude ? 'border-red-300' : ''}`}
                    />
                    {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Longitude * <span className="text-gray-500">(-180 to 180)</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      placeholder="e.g., 32.8543"
                      className={`input-field ${errors.longitude ? 'border-red-300' : ''}`}
                    />
                    {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
                  </div>
                </div>

                <Button
                  variant="outline"
                  icon={Globe}
                  onClick={getCurrentLocation}
                  className="w-full"
                >
                  Get Current Location
                </Button>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Affected Radius (km) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.radiusKm}
                    onChange={(e) => handleInputChange('radiusKm', e.target.value)}
                    placeholder="e.g., 50"
                    className={`input-field ${errors.radiusKm ? 'border-red-300' : ''}`}
                  />
                  {errors.radiusKm && <p className="mt-1 text-sm text-red-600">{errors.radiusKm}</p>}
                  <p className="mt-1 text-sm text-gray-500">
                    This defines the circular area around the coordinates where relief operations will be active.
                  </p>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Estimated Affected Population
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimatedAffected}
                    onChange={(e) => handleInputChange('estimatedAffected', e.target.value)}
                    placeholder="e.g., 10000"
                    className="input-field"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Approximate number of people affected by this disaster.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="mb-6 text-center">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {steps[2].title}
                </h3>
                <p className="text-gray-600">{steps[2].description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Initial Funding (USDC) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.initialFundingUSDC}
                    onChange={(e) => handleInputChange('initialFundingUSDC', e.target.value)}
                    placeholder="e.g., 10000"
                    className={`input-field ${errors.initialFundingUSDC ? 'border-red-300' : ''}`}
                  />
                  {errors.initialFundingUSDC && <p className="mt-1 text-sm text-red-600">{errors.initialFundingUSDC}</p>}
                  <p className="mt-1 text-sm text-gray-500">
                    Initial funding amount to kickstart relief operations. More funding can be added later.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <h4 className="mb-4 font-medium text-gray-900">Disaster Zone Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{formData.name || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{formData.disasterType || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {formData.latitude && formData.longitude
                          ? `${parseFloat(formData.latitude).toFixed(4)}, ${parseFloat(formData.longitude).toFixed(4)}`
                          : 'Not specified'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Radius:</span>
                      <span className="font-medium">{formData.radiusKm ? `${formData.radiusKm} km` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Initial Funding:</span>
                      <span className="font-medium">{formData.initialFundingUSDC ? `$${formData.initialFundingUSDC} USDC` : 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Severity:</span>
                      <span className="font-medium capitalize">{formData.severity}</span>
                    </div>
                  </div>
                </div>

                {!isConnected && (
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-900">Wallet Required</h4>
                        <p className="mt-1 text-sm text-yellow-700">
                          Please connect your wallet to create the disaster zone.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isConnected && userRole !== 'admin' && (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-red-900">Admin Access Required</h4>
                        <p className="mt-1 text-sm text-red-700">
                          Only administrators can create new disaster zones.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {currentStep < 3 ? (
              <Button variant="primary" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                icon={Save}
                loading={loading}
                disabled={!isConnected || userRole !== 'admin'}
                onClick={handleSubmit}
              >
                Create Disaster Zone
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default NewDisasterZone
