import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Heart,
  MapPin,
  CreditCard,
  QrCode,
  User,
  Phone,
  Home,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Camera,
  Upload,
  Download,
  Star,
  Shield,
  Navigation,
  Calendar,
  DollarSign,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  XCircle,
  MapPinIcon,
  ImageIcon,
  PaperclipIcon,
  Send,
  RefreshCw,
  ExternalLink,
  Building2,
  TrendingUp,
  Activity
} from 'lucide-react'
import { useWeb3Store } from '../store/web3Store'
import Card from '../components/UI/Card'
import Button from '../components/UI/Button'
import Modal from '../components/UI/Modal'
import LoadingSpinner from '../components/UI/LoadingSpinner'

const VictimPortal = () => {
  const { isConnected, account, userRole } = useWeb3Store()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [showAidRequestModal, setShowAidRequestModal] = useState(false)
  const [showEmergencyModal, setShowEmergencyModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const [vouchers, setVouchers] = useState([])
  const [applications, setApplications] = useState([])
  const [nearbyVendors, setNearbyVendors] = useState([])
  const [emergencyContacts, setEmergencyContacts] = useState([])
  const [requestHistory, setRequestHistory] = useState([])
  
  // Enhanced registration form state
  const [registrationData, setRegistrationData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    familySize: '',
    disasterType: '',
    urgency: 'medium',
    description: '',
    documents: [],
    emergencyContact: '',
    medicalConditions: '',
    specialNeeds: '',
    currentLocation: null
  })
  
  // Comprehensive aid request state
  const [aidRequest, setAidRequest] = useState({
    requestType: 'immediate', // immediate, scheduled, recurring
    category: 'food',
    subCategory: '',
    amount: '',
    description: '',
    urgency: 'medium',
    preferredVendor: '',
    deliveryMethod: 'pickup', // pickup, delivery, mobile_unit
    deliveryAddress: '',
    requestDate: '',
    recurringSchedule: '',
    documents: [],
    photos: [],
    location: null,
    familyMembers: [],
    medicalNeeds: '',
    accessibilityNeeds: '',
    alternateContact: '',
    previousRequestId: ''
  })

  // Emergency request state
  const [emergencyRequest, setEmergencyRequest] = useState({
    type: 'medical', // medical, shelter, food, safety
    severity: 'high',
    description: '',
    location: null,
    contactNumber: '',
    immediateNeeds: [],
    victimCount: 1,
    injuredCount: 0,
    childrenCount: 0,
    elderlyCount: 0,
    accessibilityInfo: '',
    photos: []
  })

  // Location state
  const [currentLocation, setCurrentLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  // Enhanced mock victim profile and data
  useEffect(() => {
    if (isConnected) {
      // Check if user is registered
      const isRegistered = localStorage.getItem(`victim_${account}`)
      
      if (isRegistered) {
        setProfile({
          fullName: 'Sarah Johnson',
          phone: '+1 (555) 123-4567',
          email: 'sarah.johnson@email.com',
          address: '123 Relief Street, Austin, TX 78701',
          familySize: 4,
          registrationDate: '2024-08-01',
          verificationStatus: 'verified',
          totalAidReceived: 1250.50,
          applications: 5,
          activeVouchers: 2,
          emergencyContact: '+1 (555) 987-6543',
          medicalConditions: 'Diabetes, Hypertension',
          specialNeeds: 'Wheelchair accessible',
          riskLevel: 'medium',
          currentLocation: { lat: 30.2672, lng: -97.7431 }
        })
        
        // Enhanced mock vouchers
        setVouchers([
          {
            id: 'VCH-2024-001',
            type: 'food',
            amount: 150.00,
            status: 'active',
            expiresAt: '2024-08-20',
            issuedAt: '2024-08-10',
            description: 'Emergency food assistance for family of 4',
            requestId: 'REQ-2024-015',
            approvedBy: 'Government Relief Center',
            qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0Y3RjhGQSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=',
            vendorRestrictions: ['HEB', 'Walmart', 'Local Food Bank'],
            usageInstructions: 'Present QR code at checkout. Valid for food and water only.'
          },
          {
            id: 'VCH-2024-002',
            type: 'medical',
            amount: 100.00,
            status: 'active',
            expiresAt: '2024-08-25',
            issuedAt: '2024-08-08',
            description: 'Medical supplies voucher - prescription medications',
            requestId: 'REQ-2024-012',
            approvedBy: 'Healthcare Relief Division',
            qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0Y3RjhGQSIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UVIgQ29kZTwvdGV4dD48L3N2Zz4=',
            vendorRestrictions: ['CVS Pharmacy', 'Walgreens', 'Relief Medical Center'],
            usageInstructions: 'Present with prescription. May require ID verification.'
          },
          {
            id: 'VCH-2024-003',
            type: 'shelter',
            amount: 200.00,
            status: 'used',
            expiresAt: '2024-08-15',
            issuedAt: '2024-08-05',
            description: 'Emergency shelter assistance - hotel accommodation',
            requestId: 'REQ-2024-008',
            usedAt: '2024-08-12',
            vendor: 'Relief Supply Co.',
            approvedBy: 'Housing Relief Department'
          }
        ])
        
        // Enhanced mock applications
        setApplications([
          {
            id: 'REQ-2024-015',
            type: 'Emergency Food Assistance',
            status: 'approved',
            submittedAt: '2024-08-08',
            processedAt: '2024-08-09',
            amount: 150.00,
            description: 'Family of 4 affected by flood damage - immediate food needs',
            urgency: 'high',
            category: 'food',
            deliveryMethod: 'pickup',
            assignedWorker: 'Maria Garcia',
            notes: 'Approved for 7-day food supply. Additional assistance may be available.',
            voucherId: 'VCH-2024-001',
            documents: ['flood_damage_photos.jpg', 'family_photo.jpg']
          },
          {
            id: 'REQ-2024-012',
            type: 'Medical Support',
            status: 'approved',
            submittedAt: '2024-08-06',
            processedAt: '2024-08-07',
            amount: 100.00,
            description: 'Prescription medications for diabetic family member',
            urgency: 'high',
            category: 'medical',
            deliveryMethod: 'pickup',
            assignedWorker: 'Dr. James Wilson',
            notes: 'Approved for insulin and related supplies. 30-day supply authorized.',
            voucherId: 'VCH-2024-002',
            documents: ['prescription.pdf', 'medical_history.pdf']
          },
          {
            id: 'REQ-2024-018',
            type: 'Housing Assistance',
            status: 'under_review',
            submittedAt: '2024-08-10',
            amount: 500.00,
            description: 'Temporary housing due to severe home damage from flood',
            urgency: 'high',
            category: 'shelter',
            deliveryMethod: 'direct_placement',
            assignedWorker: 'Susan Davis',
            notes: 'Housing assessment scheduled for 08/12. Temporary hotel placement approved.',
            estimatedProcessing: '2-3 business days',
            documents: ['home_damage_assessment.pdf', 'insurance_claim.pdf']
          },
          {
            id: 'REQ-2024-019',
            type: 'Transportation Assistance',
            status: 'pending',
            submittedAt: '2024-08-11',
            amount: 75.00,
            description: 'Transportation to medical appointments and essential services',
            urgency: 'medium',
            category: 'transportation',
            deliveryMethod: 'voucher',
            estimatedProcessing: '1-2 business days',
            documents: ['medical_appointment_schedule.pdf']
          }
        ])

        // Mock nearby vendors
        setNearbyVendors([
          {
            id: 'VND-001',
            name: 'Austin Community Food Bank',
            type: 'food',
            distance: 0.8,
            address: '2516 S Pleasant Valley Rd, Austin, TX',
            phone: '(512) 282-2111',
            hours: 'Mon-Fri 8AM-5PM',
            acceptsVouchers: true,
            rating: 4.8,
            services: ['Food Distribution', 'Mobile Pantry', 'Hot Meals']
          },
          {
            id: 'VND-002', 
            name: 'Relief Medical Center',
            type: 'medical',
            distance: 1.2,
            address: '1500 Red River St, Austin, TX',
            phone: '(512) 555-0123',
            hours: '24/7 Emergency Services',
            acceptsVouchers: true,
            rating: 4.6,
            services: ['Emergency Care', 'Prescription Assistance', 'Mental Health']
          },
          {
            id: 'VND-003',
            name: 'Emergency Shelter Network',
            type: 'shelter',
            distance: 2.1,
            address: '500 E 7th St, Austin, TX',
            phone: '(512) 555-0456',
            hours: '24/7',
            acceptsVouchers: true,
            rating: 4.4,
            services: ['Emergency Housing', 'Case Management', 'Support Services']
          }
        ])

        // Mock emergency contacts
        setEmergencyContacts([
          { name: 'Emergency Services', number: '911', type: 'emergency' },
          { name: 'Red Cross Austin', number: '(512) 928-4271', type: 'relief' },
          { name: 'Salvation Army', number: '(512) 476-1111', type: 'relief' },
          { name: 'Austin Disaster Relief', number: '(512) 974-6700', type: 'relief' },
          { name: 'FEMA Helpline', number: '1-800-621-3362', type: 'federal' },
          { name: 'Crisis Text Line', number: 'Text HOME to 741741', type: 'mental_health' }
        ])

        // Mock request history
        setRequestHistory([
          { id: 'REQ-2024-015', date: '2024-08-08', type: 'Food', status: 'completed', amount: 150 },
          { id: 'REQ-2024-012', date: '2024-08-06', type: 'Medical', status: 'completed', amount: 100 },
          { id: 'REQ-2024-008', date: '2024-08-04', type: 'Shelter', status: 'completed', amount: 200 },
          { id: 'REQ-2024-005', date: '2024-08-01', type: 'Emergency', status: 'completed', amount: 50 },
          { id: 'REQ-2024-002', date: '2024-07-28', type: 'Food', status: 'completed', amount: 125 }
        ])
      }
    }
  }, [isConnected, account])

  // Location services
  const getCurrentLocation = async () => {
    setLocationLoading(true)
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser')
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        })
      })

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      }

      setCurrentLocation(location)
      setAidRequest(prev => ({ ...prev, location }))
      toast.success('Location obtained successfully')
      return location
    } catch (error) {
      toast.error('Unable to get location: ' + error.message)
      return null
    } finally {
      setLocationLoading(false)
    }
  }

  // Enhanced aid request submission
  const handleAidRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate required fields
      if (!aidRequest.category || !aidRequest.description || !aidRequest.amount) {
        throw new Error('Please fill in all required fields')
      }

      // Get location if not provided
      let requestLocation = aidRequest.location
      if (!requestLocation && aidRequest.deliveryMethod === 'delivery') {
        requestLocation = await getCurrentLocation()
        if (!requestLocation) {
          throw new Error('Location is required for delivery requests')
        }
      }

      // Simulate aid request submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate unique request ID
      const requestId = `REQ-${Date.now()}`
      
      const newApplication = {
        id: requestId,
        type: `${aidRequest.category} assistance`,
        status: aidRequest.urgency === 'critical' ? 'priority_review' : 'pending',
        submittedAt: new Date().toISOString().split('T')[0],
        amount: parseFloat(aidRequest.amount),
        description: aidRequest.description,
        urgency: aidRequest.urgency,
        category: aidRequest.category,
        subCategory: aidRequest.subCategory,
        deliveryMethod: aidRequest.deliveryMethod,
        deliveryAddress: aidRequest.deliveryAddress,
        requestDate: aidRequest.requestDate,
        recurringSchedule: aidRequest.recurringSchedule,
        medicalNeeds: aidRequest.medicalNeeds,
        accessibilityNeeds: aidRequest.accessibilityNeeds,
        alternateContact: aidRequest.alternateContact,
        location: requestLocation,
        estimatedProcessing: aidRequest.urgency === 'critical' ? '2-4 hours' : 
                           aidRequest.urgency === 'high' ? '1-2 business days' : '3-5 business days',
        documents: aidRequest.documents,
        photos: aidRequest.photos
      }
      
      setApplications(prev => [newApplication, ...prev])
      
      // Update profile statistics
      setProfile(prev => ({
        ...prev,
        applications: prev.applications + 1
      }))

      // Add to request history
      setRequestHistory(prev => [
        {
          id: requestId,
          date: new Date().toISOString().split('T')[0],
          type: aidRequest.category,
          status: 'submitted',
          amount: parseFloat(aidRequest.amount)
        },
        ...prev
      ])
      
      // Reset form
      setAidRequest({
        requestType: 'immediate',
        category: 'food',
        subCategory: '',
        amount: '',
        description: '',
        urgency: 'medium',
        preferredVendor: '',
        deliveryMethod: 'pickup',
        deliveryAddress: '',
        requestDate: '',
        recurringSchedule: '',
        documents: [],
        photos: [],
        location: null,
        familyMembers: [],
        medicalNeeds: '',
        accessibilityNeeds: '',
        alternateContact: '',
        previousRequestId: ''
      })
      
      setShowAidRequestModal(false)
      
      // Show success message with estimated processing time
      toast.success(`Aid request submitted successfully! Estimated processing: ${newApplication.estimatedProcessing}`)
      
      // For critical requests, show additional guidance
      if (aidRequest.urgency === 'critical') {
        setTimeout(() => {
          toast.success('Priority review initiated. You will be contacted within 2-4 hours.', {
            duration: 8000
          })
        }, 2000)
      }
      
    } catch (error) {
      toast.error('Request submission failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Emergency request submission
  const handleEmergencyRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Validate emergency fields
      if (!emergencyRequest.type || !emergencyRequest.description) {
        throw new Error('Please provide emergency type and description')
      }

      // Get current location for emergency
      const location = await getCurrentLocation()
      
      // Simulate emergency request
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const emergencyId = `EMG-${Date.now()}`
      
      const emergencyApplication = {
        id: emergencyId,
        type: 'Emergency Response',
        status: 'emergency_dispatched',
        submittedAt: new Date().toISOString(),
        urgency: 'critical',
        description: `EMERGENCY: ${emergencyRequest.type} - ${emergencyRequest.description}`,
        category: 'emergency',
        emergencyType: emergencyRequest.type,
        severity: emergencyRequest.severity,
        location: location || emergencyRequest.location,
        contactNumber: emergencyRequest.contactNumber || profile.phone,
        victimCount: emergencyRequest.victimCount,
        injuredCount: emergencyRequest.injuredCount,
        childrenCount: emergencyRequest.childrenCount,
        elderlyCount: emergencyRequest.elderlyCount,
        accessibilityInfo: emergencyRequest.accessibilityInfo,
        estimatedResponse: '15-30 minutes',
        dispatchedUnits: ['Emergency Response Team Alpha', 'Medical Unit 2'],
        responderContact: '+1 (512) 555-EMRG'
      }
      
      setApplications(prev => [emergencyApplication, ...prev])
      
      // Reset emergency form
      setEmergencyRequest({
        type: 'medical',
        severity: 'high',
        description: '',
        location: null,
        contactNumber: '',
        immediateNeeds: [],
        victimCount: 1,
        injuredCount: 0,
        childrenCount: 0,
        elderlyCount: 0,
        accessibilityInfo: '',
        photos: []
      })
      
      setShowEmergencyModal(false)
      
      toast.success('🚨 Emergency request dispatched! Response teams notified.', {
        duration: 10000
      })
      
      setTimeout(() => {
        toast.success(`Response ETA: 15-30 minutes. Contact: +1 (512) 555-EMRG`, {
          duration: 15000
        })
      }, 3000)
      
    } catch (error) {
      toast.error('Emergency request failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegistration = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Save registration
      localStorage.setItem(`victim_${account}`, JSON.stringify(registrationData))
      
      // Create profile
      setProfile({
        ...registrationData,
        registrationDate: new Date().toISOString().split('T')[0],
        verificationStatus: 'pending',
        totalAidReceived: 0,
        applications: 0,
        activeVouchers: 0
      })
      
      setRegistrationData({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        familySize: '',
        disasterType: '',
        urgency: 'medium',
        description: '',
        documents: [],
        emergencyContact: '',
        medicalConditions: '',
        specialNeeds: '',
        currentLocation: null
      })
      
      setShowRegistrationModal(false)
      toast.success('Registration submitted successfully!')
      
    } catch (error) {
      toast.error('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // File upload handlers
  const handleFileUpload = (files, type = 'documents') => {
    const fileArray = Array.from(files)
    const validFiles = fileArray.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
      const maxSize = 5 * 1024 * 1024 // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize
    })
    
    if (validFiles.length !== fileArray.length) {
      toast.error('Some files were rejected. Please use JPG, PNG, GIF, or PDF files under 5MB.')
    }
    
    if (type === 'documents') {
      setAidRequest(prev => ({
        ...prev,
        documents: [...prev.documents, ...validFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }))]
      }))
    } else if (type === 'photos') {
      setAidRequest(prev => ({
        ...prev,
        photos: [...prev.photos, ...validFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }))]
      }))
    }
  }

  // Category configurations
  const getCategoryConfig = (category) => {
    const configs = {
      food: {
        subCategories: ['Fresh Produce', 'Canned Goods', 'Baby Food', 'Special Dietary', 'Ready Meals', 'Water'],
        suggestedAmounts: [50, 100, 150, 200, 300],
        deliveryMethods: ['pickup', 'delivery', 'mobile_unit'],
        maxAmount: 500
      },
      medical: {
        subCategories: ['Prescription Medication', 'Over-the-Counter', 'Medical Supplies', 'First Aid', 'Mobility Aids', 'Emergency Care'],
        suggestedAmounts: [25, 50, 100, 200, 500],
        deliveryMethods: ['pickup', 'delivery', 'mobile_clinic'],
        maxAmount: 1000
      },
      shelter: {
        subCategories: ['Temporary Housing', 'Hotel Voucher', 'Clothing', 'Bedding', 'Personal Hygiene', 'Emergency Shelter'],
        suggestedAmounts: [100, 200, 500, 1000],
        deliveryMethods: ['direct_placement', 'voucher', 'pickup'],
        maxAmount: 2000
      },
      transportation: {
        subCategories: ['Medical Appointments', 'Work Commute', 'School Transport', 'Emergency Travel', 'Relocation'],
        suggestedAmounts: [25, 50, 100, 150],
        deliveryMethods: ['voucher', 'direct_service'],
        maxAmount: 300
      },
      utilities: {
        subCategories: ['Electricity', 'Gas', 'Water', 'Internet', 'Phone Service'],
        suggestedAmounts: [50, 100, 200, 400],
        deliveryMethods: ['direct_payment', 'voucher'],
        maxAmount: 800
      }
    }
    return configs[category] || configs.food
  }

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Connect Your Wallet</h2>
          <p className="mb-4 text-gray-600">Please connect your wallet to access the victim portal.</p>
        </Card>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-blue-400" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Registration Required</h2>
          <p className="mb-6 text-gray-600">You need to register to access assistance services.</p>
          <Button onClick={() => setShowRegistrationModal(true)} className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Register Now
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Victim Portal</h1>
              <p className="text-gray-600">Access disaster relief assistance and manage your aid</p>
            </div>
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowEmergencyModal(true)}
                className="bg-red-600 hover:bg-red-700"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Emergency
              </Button>
              <Button
                onClick={() => setShowAidRequestModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Heart className="w-4 h-4 mr-2" />
                Request Aid
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Profile Summary */}
        <div className="p-6 mb-8 bg-white border rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-full">
                <User className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="flex items-center text-xl font-semibold text-gray-900">
                  {profile.fullName}
                  {profile.verificationStatus === 'verified' && (
                    <CheckCircle className="w-5 h-5 ml-2 text-green-500" />
                  )}
                  {profile.verificationStatus === 'pending' && (
                    <Clock className="w-5 h-5 ml-2 text-yellow-500" />
                  )}
                </h2>
                <p className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {profile.address}
                </p>
                <p className="text-sm text-gray-500">
                  Registered: {profile.registrationDate} | Family size: {profile.familySize}
                  {profile.riskLevel && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      profile.riskLevel === 'high' ? 'bg-red-100 text-red-700' :
                      profile.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {profile.riskLevel} risk
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{profile.applications}</p>
                <p className="text-sm text-gray-600">Applications</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">${profile.totalAidReceived.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Aid Received</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{profile.activeVouchers}</p>
                <p className="text-sm text-gray-600">Active Vouchers</p>
              </div>
            </div>
          </div>
          
          {/* Emergency Contact & Quick Actions Bar */}
          <div className="pt-6 mt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Emergency Contact:</span> {profile.emergencyContact}
                {profile.medicalConditions && (
                  <span className="ml-4"><span className="font-medium">Medical:</span> {profile.medicalConditions}</span>
                )}
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={getCurrentLocation}>
                  <Navigation className="w-4 h-4 mr-1" />
                  {locationLoading ? 'Getting...' : 'Get Location'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setActiveTab('nearby')}>
                  <Building2 className="w-4 h-4 mr-1" />
                  Find Vendors
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Heart },
              { id: 'vouchers', label: 'My Vouchers', icon: CreditCard },
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'nearby', label: 'Nearby Help', icon: MapPin },
              { id: 'emergency', label: 'Emergency Info', icon: AlertTriangle },
              { id: 'profile', label: 'Profile', icon: User }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Enhanced Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Enhanced Quick Actions */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6 text-center border-l-4 border-red-500">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Emergency Request</h3>
                  <p className="mb-4 text-gray-600">Immediate emergency assistance</p>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700"
                    onClick={() => setShowEmergencyModal(true)}
                  >
                    Call for Help
                  </Button>
                </Card>
                
                <Card className="p-6 text-center border-l-4 border-blue-500">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Request Aid</h3>
                  <p className="mb-4 text-gray-600">Submit assistance application</p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowAidRequestModal(true)}
                  >
                    Request Now
                  </Button>
                </Card>
                
                <Card className="p-6 text-center border-l-4 border-green-500">
                  <QrCode className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Active Vouchers</h3>
                  <p className="mb-4 text-gray-600">View and use your vouchers</p>
                  <Button 
                    variant="outline" 
                    className="w-full text-green-700 border-green-500 hover:bg-green-50"
                    onClick={() => setActiveTab('vouchers')}
                  >
                    View Vouchers
                  </Button>
                </Card>
                
                <Card className="p-6 text-center border-l-4 border-purple-500">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Find Help Nearby</h3>
                  <p className="mb-4 text-gray-600">Locate vendors and services</p>
                  <Button 
                    variant="outline" 
                    className="w-full text-purple-700 border-purple-500 hover:bg-purple-50"
                    onClick={() => setActiveTab('nearby')}
                  >
                    Find Locations
                  </Button>
                </Card>
              </div>

              {/* Application Status Overview */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="p-6">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                    <Activity className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4 overflow-y-auto max-h-64">
                    {applications.slice(0, 5).map(app => (
                      <div key={app.id} className={`flex items-center space-x-4 p-3 rounded-lg ${
                        app.status === 'approved' || app.status === 'emergency_dispatched' ? 'bg-green-50' :
                        app.status === 'under_review' || app.status === 'priority_review' ? 'bg-blue-50' :
                        app.status === 'pending' ? 'bg-yellow-50' : 'bg-gray-50'
                      }`}>
                        {app.status === 'approved' || app.status === 'emergency_dispatched' ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : app.status === 'under_review' || app.status === 'priority_review' ? (
                          <RefreshCw className="w-6 h-6 text-blue-500" />
                        ) : app.status === 'pending' ? (
                          <Clock className="w-6 h-6 text-yellow-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{app.type}</p>
                          <p className="text-sm text-gray-600">{app.id} • ${app.amount || 'N/A'}</p>
                          <p className="text-xs text-gray-500">
                            {app.submittedAt} • {app.status.replace('_', ' ')}
                          </p>
                        </div>
                        {app.estimatedProcessing && (
                          <div className="text-right">
                            <p className="text-xs text-gray-500">ETA:</p>
                            <p className="text-xs font-medium text-gray-700">{app.estimatedProcessing}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setActiveTab('applications')}
                  >
                    View All Applications
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Aid History & Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 text-center rounded-lg bg-gray-50">
                        <p className="text-2xl font-bold text-gray-900">{requestHistory.length}</p>
                        <p className="text-sm text-gray-600">Total Requests</p>
                      </div>
                      <div className="p-3 text-center rounded-lg bg-green-50">
                        <p className="text-2xl font-bold text-green-600">
                          {requestHistory.filter(r => r.status === 'completed').length}
                        </p>
                        <p className="text-sm text-gray-600">Completed</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Recent Request History</h4>
                      {requestHistory.slice(0, 4).map(request => (
                        <div key={request.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{request.type}</p>
                            <p className="text-xs text-gray-500">{request.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">${request.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              request.status === 'completed' ? 'bg-green-100 text-green-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </div>

              {/* Emergency Contacts Quick Access */}
              <Card className="p-6 border-red-200 bg-red-50">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-red-900">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Resources
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {emergencyContacts.slice(0, 3).map((contact, index) => (
                    <div key={index} className="p-3 bg-white border border-red-200 rounded-lg">
                      <p className="font-medium text-gray-900">{contact.name}</p>
                      <p className="text-sm text-gray-600">{contact.number}</p>
                      <Button size="sm" className="w-full mt-2 bg-red-600 hover:bg-red-700">
                        <Phone className="w-3 h-3 mr-1" />
                        Call Now
                      </Button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4 text-red-700 border-red-300 hover:bg-red-50"
                  onClick={() => setActiveTab('emergency')}
                >
                  View All Emergency Contacts
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Enhanced Applications Tab */}
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Assistance Applications</h3>
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => setShowEmergencyModal(true)}
                      className="bg-red-600 hover:bg-red-700"
                      size="sm"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Emergency
                    </Button>
                    <Button onClick={() => setShowAidRequestModal(true)}>
                      <FileText className="w-4 h-4 mr-2" />
                      New Request
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {applications.map(application => (
                    <div key={application.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2 space-x-2">
                            <h4 className="font-medium text-gray-900">{application.id}</h4>
                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                              application.status === 'approved' || application.status === 'emergency_dispatched' ? 'bg-green-100 text-green-700' :
                              application.status === 'under_review' || application.status === 'priority_review' ? 'bg-blue-100 text-blue-700' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {application.status.replace('_', ' ')}
                            </span>
                            {application.urgency && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                application.urgency === 'critical' ? 'bg-red-100 text-red-700' :
                                application.urgency === 'high' ? 'bg-orange-100 text-orange-700' :
                                application.urgency === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {application.urgency} priority
                              </span>
                            )}
                          </div>
                          <p className="mb-2 text-sm text-gray-600">{application.type}</p>
                          <p className="mb-3 text-sm text-gray-500">{application.description}</p>
                          
                          {application.assignedWorker && (
                            <p className="mb-2 text-sm text-gray-600">
                              <span className="font-medium">Assigned to:</span> {application.assignedWorker}
                            </p>
                          )}
                          
                          {application.notes && (
                            <p className="p-2 mb-2 text-sm text-blue-600 rounded bg-blue-50">
                              <span className="font-medium">Notes:</span> {application.notes}
                            </p>
                          )}
                          
                          {application.documents && application.documents.length > 0 && (
                            <div className="flex items-center mb-2 space-x-2 text-sm text-gray-600">
                              <PaperclipIcon className="w-4 h-4" />
                              <span>{application.documents.length} document(s) attached</span>
                            </div>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          {application.amount && (
                            <p className="text-lg font-semibold text-gray-900">${application.amount}</p>
                          )}
                          <p className="text-sm text-gray-600">Submitted: {application.submittedAt}</p>
                          {application.processedAt && (
                            <p className="text-sm text-gray-600">Processed: {application.processedAt}</p>
                          )}
                          {application.estimatedProcessing && (
                            <p className="text-sm font-medium text-blue-600">ETA: {application.estimatedProcessing}</p>
                          )}
                          
                          {application.voucherId && (
                            <Button size="sm" variant="outline" className="mt-2">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Voucher
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Nearby Vendors Tab */}
          {activeTab === 'nearby' && (
            <motion.div
              key="nearby"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Nearby Assistance Providers</h3>
                <Button onClick={getCurrentLocation} disabled={locationLoading}>
                  <Navigation className="w-4 h-4 mr-2" />
                  {locationLoading ? 'Updating...' : 'Update Location'}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {nearbyVendors.map(vendor => (
                  <Card key={vendor.id} className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-full ${
                          vendor.type === 'food' ? 'bg-green-100' :
                          vendor.type === 'medical' ? 'bg-blue-100' :
                          vendor.type === 'shelter' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          {vendor.type === 'food' ? <Heart className="w-5 h-5 text-green-600" /> :
                           vendor.type === 'medical' ? <Shield className="w-5 h-5 text-blue-600" /> :
                           vendor.type === 'shelter' ? <Home className="w-5 h-5 text-purple-600" /> :
                           <Building2 className="w-5 h-5 text-gray-600" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{vendor.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{vendor.distance} mi</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-600">{vendor.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {vendor.acceptsVouchers && (
                        <span className="px-2 py-1 text-xs text-green-700 bg-green-100 rounded-full">
                          Accepts Vouchers
                        </span>
                      )}
                    </div>
                    
                    <div className="mb-4 space-y-2">
                      <p className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        {vendor.address}
                      </p>
                      <p className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-1" />
                        {vendor.phone}
                      </p>
                      <p className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {vendor.hours}
                      </p>
                    </div>
                    
                    <div className="mb-4">
                      <p className="mb-1 text-sm font-medium text-gray-900">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {vendor.services.map((service, index) => (
                          <span key={index} className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Navigation className="w-3 h-3 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Emergency Contacts Tab */}
          {activeTab === 'emergency' && (
            <motion.div
              key="emergency"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                <h3 className="flex items-center mb-4 text-lg font-semibold text-red-900">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Emergency Information & Contacts
                </h3>
                <p className="mb-4 text-red-700">
                  In case of immediate danger or life-threatening emergency, call 911 immediately.
                </p>
                <Button 
                  onClick={() => setShowEmergencyModal(true)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Report Emergency
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {emergencyContacts.map((contact, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{contact.name}</h4>
                        <p className="text-sm text-gray-600">{contact.number}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                          contact.type === 'emergency' ? 'bg-red-100 text-red-700' :
                          contact.type === 'relief' ? 'bg-blue-100 text-blue-700' :
                          contact.type === 'federal' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {contact.type.replace('_', ' ')}
                        </span>
                      </div>
                      <Button size="sm">
                        <Phone className="w-4 h-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Emergency Preparedness Tips</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>Keep important documents in a waterproof container</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>Maintain a 3-day supply of water and non-perishable food</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>Keep a battery-powered radio and extra batteries</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                    <p>Have a family communication plan with out-of-area contact</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Enhanced Vouchers Tab */}
          {activeTab === 'vouchers' && (
            <motion.div
              key="vouchers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vouchers.map(voucher => (
                  <Card key={voucher.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{voucher.id}</h3>
                        <p className="text-sm text-gray-600 capitalize">{voucher.type} assistance</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        voucher.status === 'active' ? 'bg-green-100 text-green-700' :
                        voucher.status === 'used' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {voucher.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">${voucher.amount}</p>
                      <p className="text-sm text-gray-600">{voucher.description}</p>
                    </div>
                    
                    {voucher.status === 'active' && voucher.qrCode && (
                      <div className="mb-4 text-center">
                        <img 
                          src={voucher.qrCode} 
                          alt="QR Code"
                          className="w-24 h-24 mx-auto border rounded"
                        />
                        <p className="mt-2 text-xs text-gray-500">Show to vendor</p>
                      </div>
                    )}
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Issued: {voucher.issuedAt}</p>
                      {voucher.status === 'active' && (
                        <p>Expires: {voucher.expiresAt}</p>
                      )}
                      {voucher.status === 'used' && (
                        <>
                          <p>Used: {voucher.usedAt}</p>
                          <p>Vendor: {voucher.vendor}</p>
                        </>
                      )}
                    </div>
                    
                    {voucher.status === 'active' && (
                      <div className="mt-4 space-y-2">
                        <Button size="sm" className="w-full">
                          <QrCode className="w-4 h-4 mr-2" />
                          Show QR Code
                        </Button>
                        <Button size="sm" variant="outline" className="w-full">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Enhanced Vouchers Tab */}
          {activeTab === 'vouchers' && (
            <motion.div
              key="vouchers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vouchers.map(voucher => (
                  <Card key={voucher.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">{voucher.id}</h3>
                        <p className="text-sm text-gray-600 capitalize">{voucher.type} assistance</p>
                        {voucher.requestId && (
                          <p className="text-xs text-gray-500">Request: {voucher.requestId}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        voucher.status === 'active' ? 'bg-green-100 text-green-700' :
                        voucher.status === 'used' ? 'bg-gray-100 text-gray-700' :
                        voucher.status === 'expired' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {voucher.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-2xl font-bold text-gray-900">${voucher.amount}</p>
                      <p className="text-sm text-gray-600">{voucher.description}</p>
                      {voucher.approvedBy && (
                        <p className="mt-1 text-xs text-gray-500">Approved by: {voucher.approvedBy}</p>
                      )}
                    </div>
                    
                    {voucher.status === 'active' && voucher.qrCode && (
                      <div className="mb-4 text-center">
                        <img 
                          src={voucher.qrCode} 
                          alt="QR Code"
                          className="w-24 h-24 mx-auto border rounded"
                        />
                        <p className="mt-2 text-xs text-gray-500">Show to vendor</p>
                      </div>
                    )}
                    
                    <div className="mb-4 space-y-1 text-sm text-gray-600">
                      <p>Issued: {voucher.issuedAt}</p>
                      {voucher.status === 'active' && (
                        <p className="text-orange-600">Expires: {voucher.expiresAt}</p>
                      )}
                      {voucher.status === 'used' && (
                        <>
                          <p>Used: {voucher.usedAt}</p>
                          <p>Vendor: {voucher.vendor}</p>
                        </>
                      )}
                    </div>
                    
                    {voucher.vendorRestrictions && (
                      <div className="mb-4">
                        <p className="mb-1 text-xs font-medium text-gray-700">Accepted at:</p>
                        <div className="flex flex-wrap gap-1">
                          {voucher.vendorRestrictions.map((vendor, index) => (
                            <span key={index} className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
                              {vendor}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {voucher.usageInstructions && (
                      <div className="p-2 mb-4 border border-yellow-200 rounded bg-yellow-50">
                        <p className="text-xs text-yellow-800">{voucher.usageInstructions}</p>
                      </div>
                    )}
                    
                    {voucher.status === 'active' && (
                      <div className="space-y-2">
                        <Button size="sm" className="w-full">
                          <QrCode className="w-4 h-4 mr-2" />
                          Show QR Code
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setActiveTab('nearby')}>
                            <MapPin className="w-4 h-4 mr-1" />
                            Find Vendors
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
              
              {vouchers.length === 0 && (
                <Card className="p-8 text-center">
                  <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">No Vouchers Available</h3>
                  <p className="mb-4 text-gray-600">You don't have any active vouchers at the moment.</p>
                  <Button onClick={() => setShowAidRequestModal(true)}>
                    <Heart className="w-4 h-4 mr-2" />
                    Request Assistance
                  </Button>
                </Card>
              )}
            </motion.div>
          )}

          {/* Enhanced Applications Tab */}
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Assistance Applications</h3>
                  <Button onClick={() => setShowVoucherModal(true)}>
                    <FileText className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {applications.map(application => (
                    <div key={application.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900">{application.id}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              application.status === 'approved' ? 'bg-green-100 text-green-700' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{application.type}</p>
                          <p className="mt-1 text-sm text-gray-500">{application.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">${application.amount}</p>
                          <p className="text-sm text-gray-600">Submitted: {application.submittedAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="p-6">
                <h3 className="mb-6 text-lg font-semibold text-gray-900">Profile Information</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{profile.fullName}</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{profile.phone}</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{profile.email}</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Family Size</label>
                    <p className="text-gray-900">{profile.familySize} members</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                    <p className="text-gray-900">{profile.address}</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Registration Date</label>
                    <p className="text-gray-900">{profile.registrationDate}</p>
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Verification Status</label>
                    <div className="flex items-center">
                      <p className="text-gray-900 capitalize">{profile.verificationStatus}</p>
                      {profile.verificationStatus === 'verified' && (
                        <CheckCircle className="w-4 h-4 ml-2 text-green-500" />
                      )}
                      {profile.verificationStatus === 'pending' && (
                        <Clock className="w-4 h-4 ml-2 text-yellow-500" />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Registration Modal */}
        <Modal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          title="Victim Registration"
          size="lg"
        >
          <form onSubmit={handleRegistration} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={registrationData.fullName}
                  onChange={(e) => setRegistrationData({ ...registrationData, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={registrationData.phone}
                  onChange={(e) => setRegistrationData({ ...registrationData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={registrationData.email}
                  onChange={(e) => setRegistrationData({ ...registrationData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Family Size *
                </label>
                <input
                  type="number"
                  min="1"
                  value={registrationData.familySize}
                  onChange={(e) => setRegistrationData({ ...registrationData, familySize: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Current Address *
              </label>
              <textarea
                value={registrationData.address}
                onChange={(e) => setRegistrationData({ ...registrationData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Disaster Type *
                </label>
                <select
                  value={registrationData.disasterType}
                  onChange={(e) => setRegistrationData({ ...registrationData, disasterType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select disaster type</option>
                  <option value="flood">Flood</option>
                  <option value="hurricane">Hurricane</option>
                  <option value="earthquake">Earthquake</option>
                  <option value="fire">Fire</option>
                  <option value="tornado">Tornado</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Urgency Level
                </label>
                <select
                  value={registrationData.urgency}
                  onChange={(e) => setRegistrationData({ ...registrationData, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Situation Description *
              </label>
              <textarea
                value={registrationData.description}
                onChange={(e) => setRegistrationData({ ...registrationData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Please describe your current situation and immediate needs..."
                required
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Supporting Documents
              </label>
              <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Upload ID, proof of address, or damage photos</p>
                <input type="file" multiple accept="image/*,.pdf" className="hidden" />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Registration'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Comprehensive Aid Request Modal */}
        <Modal
          isOpen={showAidRequestModal}
          onClose={() => setShowAidRequestModal(false)}
          title="Request Assistance"
          size="lg"
        >
          <form onSubmit={handleAidRequest} className="space-y-6">
            {/* Request Type Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Request Type</label>
              <div className="grid grid-cols-3 gap-3">
                {['immediate', 'scheduled', 'recurring'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAidRequest({ ...aidRequest, requestType: type })}
                    className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                      aidRequest.requestType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">{type}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {type === 'immediate' ? 'Urgent need' :
                       type === 'scheduled' ? 'Future date' : 'Regular support'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Category Selection */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Category *</label>
                <select
                  value={aidRequest.category}
                  onChange={(e) => {
                    const category = e.target.value
                    setAidRequest({ 
                      ...aidRequest, 
                      category,
                      subCategory: '',
                      amount: ''
                    })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select category</option>
                  <option value="food">Food & Water</option>
                  <option value="medical">Medical Supplies</option>
                  <option value="shelter">Shelter & Housing</option>
                  <option value="transportation">Transportation</option>
                  <option value="utilities">Utilities</option>
                  <option value="childcare">Childcare</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Sub-category */}
              {aidRequest.category && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Specific Need</label>
                  <select
                    value={aidRequest.subCategory}
                    onChange={(e) => setAidRequest({ ...aidRequest, subCategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select specific need</option>
                    {getCategoryConfig(aidRequest.category).subCategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Amount */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Requested Amount ($) *</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    max={aidRequest.category ? getCategoryConfig(aidRequest.category).maxAmount : 1000}
                    value={aidRequest.amount}
                    onChange={(e) => setAidRequest({ ...aidRequest, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    required
                  />
                  {aidRequest.category && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getCategoryConfig(aidRequest.category).suggestedAmounts.map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => setAidRequest({ ...aidRequest, amount: amount.toString() })}
                          className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Urgency Level */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Urgency Level *</label>
                <select
                  value={aidRequest.urgency}
                  onChange={(e) => setAidRequest({ ...aidRequest, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="low">Low - Can wait 1+ weeks</option>
                  <option value="medium">Medium - Needed within few days</option>
                  <option value="high">High - Needed within 24-48 hours</option>
                  <option value="critical">Critical - Needed immediately</option>
                </select>
              </div>
            </div>

            {/* Delivery Method */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Delivery Method</label>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {aidRequest.category && getCategoryConfig(aidRequest.category).deliveryMethods.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setAidRequest({ ...aidRequest, deliveryMethod: method })}
                    className={`p-3 text-sm rounded-lg border-2 transition-colors ${
                      aidRequest.deliveryMethod === method
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium capitalize">{method.replace('_', ' ')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Description of Need *</label>
              <textarea
                value={aidRequest.description}
                onChange={(e) => setAidRequest({ ...aidRequest, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder="Please provide details about your situation and specific needs..."
                required
              />
            </div>

            {/* Special Needs */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Medical/Accessibility Needs</label>
                <textarea
                  value={aidRequest.accessibilityNeeds}
                  onChange={(e) => setAidRequest({ ...aidRequest, accessibilityNeeds: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Any special requirements, disabilities, or medical needs..."
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Alternate Contact</label>
                <input
                  type="tel"
                  value={aidRequest.alternateContact}
                  onChange={(e) => setAidRequest({ ...aidRequest, alternateContact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Emergency contact number"
                />
              </div>
            </div>

            {/* Location & Address */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Location Information</label>
                <Button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={locationLoading}
                  size="sm"
                  variant="outline"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {locationLoading ? 'Getting...' : 'Use Current Location'}
                </Button>
              </div>
              
              {aidRequest.deliveryMethod === 'delivery' && (
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Delivery Address</label>
                  <textarea
                    value={aidRequest.deliveryAddress}
                    onChange={(e) => setAidRequest({ ...aidRequest, deliveryAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    rows={2}
                    placeholder="Full delivery address with any special instructions..."
                  />
                </div>
              )}
            </div>

            {/* Document Upload */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Supporting Documents</label>
              <div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-center space-x-4">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                    <PaperclipIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-600">Upload photos or documents that support your request</p>
                  <p className="text-xs text-gray-500">Images, PDFs up to 5MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => handleFileUpload(e.target.files, 'documents')}
                    className="hidden"
                    id="documents-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('documents-upload').click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </Button>
                </div>
                
                {aidRequest.documents.length > 0 && (
                  <div className="mt-4 space-y-1">
                    {aidRequest.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between text-sm text-gray-600">
                        <span>{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => setAidRequest({
                            ...aidRequest,
                            documents: aidRequest.documents.filter((_, i) => i !== index)
                          })}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex pt-4 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAidRequestModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Submit Request'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Emergency Request Modal */}
        <Modal
          isOpen={showEmergencyModal}
          onClose={() => setShowEmergencyModal(false)}
          title="🚨 Emergency Request"
          size="lg"
        >
          <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              <p className="font-medium text-red-800">For life-threatening emergencies, call 911 immediately!</p>
            </div>
            <p className="mt-2 text-sm text-red-700">
              Use this form for urgent assistance requests that require immediate attention but are not life-threatening.
            </p>
          </div>

          <form onSubmit={handleEmergencyRequest} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Emergency Type *</label>
                <select
                  value={emergencyRequest.type}
                  onChange={(e) => setEmergencyRequest({ ...emergencyRequest, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="medical">Medical Emergency</option>
                  <option value="shelter">Immediate Shelter Needed</option>
                  <option value="food">Critical Food Shortage</option>
                  <option value="safety">Safety Concern</option>
                  <option value="evacuation">Evacuation Assistance</option>
                  <option value="other">Other Emergency</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Severity Level *</label>
                <select
                  value={emergencyRequest.severity}
                  onChange={(e) => setEmergencyRequest({ ...emergencyRequest, severity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="high">High - Urgent response needed</option>
                  <option value="critical">Critical - Immediate response required</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Emergency Description *</label>
              <textarea
                value={emergencyRequest.description}
                onChange={(e) => setEmergencyRequest({ ...emergencyRequest, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={4}
                placeholder="Describe the emergency situation and what assistance you need..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Total Victims</label>
                <input
                  type="number"
                  min="1"
                  value={emergencyRequest.victimCount}
                  onChange={(e) => setEmergencyRequest({ ...emergencyRequest, victimCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Injured</label>
                <input
                  type="number"
                  min="0"
                  value={emergencyRequest.injuredCount}
                  onChange={(e) => setEmergencyRequest({ ...emergencyRequest, injuredCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Children</label>
                <input
                  type="number"
                  min="0"
                  value={emergencyRequest.childrenCount}
                  onChange={(e) => setEmergencyRequest({ ...emergencyRequest, childrenCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Elderly</label>
                <input
                  type="number"
                  min="0"
                  value={emergencyRequest.elderlyCount}
                  onChange={(e) => setEmergencyRequest({ ...emergencyRequest, elderlyCount: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Contact Number</label>
              <input
                type="tel"
                value={emergencyRequest.contactNumber}
                onChange={(e) => setEmergencyRequest({ ...emergencyRequest, contactNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                placeholder={profile.phone}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Accessibility Information</label>
              <textarea
                value={emergencyRequest.accessibilityInfo}
                onChange={(e) => setEmergencyRequest({ ...emergencyRequest, accessibilityInfo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                rows={2}
                placeholder="Any mobility restrictions, medical equipment, or special needs..."
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                size="sm"
                variant="outline"
              >
                <Navigation className="w-4 h-4 mr-2" />
                {locationLoading ? 'Getting Location...' : 'Share Current Location'}
              </Button>
              <p className="text-sm text-gray-600">
                Location helps emergency responders find you quickly
              </p>
            </div>

            <div className="flex pt-4 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmergencyModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {loading ? <LoadingSpinner size="sm" /> : '🚨 Send Emergency Request'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  )
}

export default VictimPortal
