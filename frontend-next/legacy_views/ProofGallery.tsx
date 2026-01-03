import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Image, 
  FileText, 
  MapPin,
  Clock,
  CheckCircle,
  X,
  Filter,
  Eye,
  Grid3X3,
  List,
  Download,
  Share2,
  Heart,
  Star
} from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const ProofGallery = () => {
  const [proofItems, setProofItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [sortBy, setSortBy] = useState('timestamp'); // timestamp, beneficiaries, title

  // Mock data for demonstration
  const mockProofData = [
    {
      id: '1',
      title: 'Cyclone Fani Relief',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1564412458052-005f63484a94?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3ljbG9uZXxlbnwwfHwwfHx8MA%3D%3D',
      description: 'Food packages distributed to 150 families in Central Relief Camp', 
      location: 'Central Relief Camp, District A',
      timestamp: '2024-01-15T10:30:00Z',
      verificationStatus: 'verified',
      disasterId: 'FLOOD-2024-001',
      uploadedBy: '0x742d35Cc6634C0532925a3b8D',
      beneficiaries: 150,
      ipfsHash: 'QmXoYoY8xgU9QzYV7k8LHZjKvN2M1aP4Qr5TtUwV',
      tags: ['food', 'distribution', 'relief'],
      likes: 24,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Kerala Landslide Relief',
      type: 'document',
      url: 'https://media.istockphoto.com/id/186876633/photo/rock-slide-with-damage-on-the-road-during-a-storm.jpg?s=612x612&w=0&k=20&c=_ZMhXeW0hKxEIZI9WBA1WhduYWGUkeSXZd68LJRwPII=',
      description: 'Emergency medical supplies delivered to field hospital',
      location: 'Field Hospital, Sector B',
      timestamp: '2024-01-14T15:45:00Z',
      verificationStatus: 'pending',
      disasterId: 'FLOOD-2024-001',
      uploadedBy: '0x8fa3bF96E654Ab26f8e9A2B7C',
      beneficiaries: 75,
      ipfsHash: 'QmYzWx9vUr8QtZA6b5LMjPv3N2B8cR',
      tags: ['medical', 'supplies', 'healthcare'],
      likes: 18,
      rating: 4.6
    },
    {
      id: '3',
      title: 'Cyclone Aila',
      type: 'image',
      url: 'https://static01.nyt.com/images/2009/05/27/world/27cyclone-600.jpg?quality=75&auto=webp&disable=upscale',
      description: 'Temporary shelters being constructed for displaced families',
      location: 'Relocation Site C',
      timestamp: '2024-01-13T08:20:00Z',
      verificationStatus: 'verified',
      disasterId: 'EARTHQUAKE-2024-002',
      uploadedBy: '0x9ab4eF78D123Cd45E6F7A890B',
      beneficiaries: 200,
      ipfsHash: 'QmZaB1cD2eF3gH4iJ5kL6mN7oP',
      tags: ['shelter', 'construction', 'housing'],
      likes: 32,
      rating: 4.9
    },
    {
      id: '4',
      title: ' Tangshan Earthquake – China',
      type: 'video',
      url: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Tangshan_earthquake.jpg',
      description: 'Installing water purification systems in affected areas',
      location: 'Village D Water Point',
      timestamp: '2024-01-12T12:10:00Z',
      verificationStatus: 'verified',
      disasterId: 'FLOOD-2024-001',
      uploadedBy: '0xbc5fG890H234Ij56K7L8M901N',
      beneficiaries: 500,
      ipfsHash: 'QmAbC2dE3fG4hI5jK6lM7nO8pQ',
      tags: ['water', 'purification', 'infrastructure'],
      likes: 45,
      rating: 5.0
    },
    {
      id: '5',
      title: '2004 Indian Ocean Earthquake',
      type: 'image',
      url: 'https://recovery.preventionweb.net/sites/default/files/styles/ultrawide_16_6/public/Indian-ocean-tsunami-2004-min.jpg?h=347c2229&itok=XrWXvgzh',
      description: 'School supplies and educational materials for children',
      location: 'Temporary School, Zone E',
      timestamp: '2024-01-11T14:30:00Z',
      verificationStatus: 'rejected',
      disasterId: 'CYCLONE-2024-003',
      uploadedBy: '0xdef7G123H456I789J012K345L',
      beneficiaries: 120,
      ipfsHash: 'QmDeFg3Hi4Jk5Lm6Nn7Oo8Pp9Q',
      tags: ['education', 'children', 'supplies'],
      likes: 12,
      rating: 3.8
    }
  ];

  useEffect(() => {
    // Initialize with mock data
    setProofItems(mockProofData);
    setFilteredItems(mockProofData);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Apply filters and sorting
    let filtered = proofItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || item.type === filterType;
      const matchesStatus = filterStatus === 'all' || item.verificationStatus === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'beneficiaries':
          return b.beneficiaries - a.beneficiaries;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
    
    setFilteredItems(filtered);
  }, [searchTerm, filterType, filterStatus, sortBy, proofItems]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'video': return <Eye className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ProofCard = ({ proof, onClick }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => onClick(proof)}
      className="cursor-pointer group"
    >
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 bg-white">
        <div className="relative overflow-hidden">
          <img
            src={proof.url}
            alt={proof.title}
            className="object-cover w-full h-48 transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(proof.verificationStatus)}`}>
              {proof.verificationStatus === 'verified' && <CheckCircle className="w-3 h-3 mr-1.5" />}
              {proof.verificationStatus.charAt(0).toUpperCase() + proof.verificationStatus.slice(1)}
            </span>
          </div>
          
          {/* Type Badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-gray-700 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
              {getTypeIcon(proof.type)}
              <span className="ml-1.5 capitalize">{proof.type}</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
              <Heart className="w-4 h-4 text-red-500" />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
              <Share2 className="w-4 h-4 text-blue-500" />
            </button>
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
              <Download className="w-4 h-4 text-green-500" />
            </button>
          </div>
        </div>
        
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-gray-900 line-clamp-2 text-lg leading-tight group-hover:text-blue-600 transition-colors duration-200">
              {proof.title}
            </h3>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm font-medium text-gray-700">{proof.rating}</span>
            </div>
          </div>
          
          <p className="mb-4 text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {proof.description}
          </p>
          
          <div className="space-y-2.5 mb-4">
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm truncate">{proof.location}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">{formatTimestamp(proof.timestamp)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-200">
                {proof.beneficiaries} beneficiaries
              </span>
              <span className="text-sm text-gray-500">
                ❤️ {proof.likes}
              </span>
            </div>
            
            <div className="flex space-x-1">
              {proof.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-md font-medium border border-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const ProofModal = ({ proof, onClose }) => (
    <Modal isOpen={!!proof} onClose={onClose} size="max">
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{proof?.title}</h2>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium border ${getStatusColor(proof?.verificationStatus)}`}>
                {proof?.verificationStatus === 'verified' && <CheckCircle className="w-4 h-4 mr-1.5" />}
                {proof?.verificationStatus?.charAt(0).toUpperCase() + proof?.verificationStatus?.slice(1)}
              </span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="text-sm font-medium text-gray-700">{proof?.rating}</span>
              </div>
              <span className="text-sm text-gray-500">❤️ {proof?.likes} likes</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClose} className="p-2">
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <img
              src={proof?.url}
              alt={proof?.title}
              className="object-cover w-full h-80 rounded-lg shadow-md"
            />
            <div className="flex space-x-3">
              <Button variant="primary" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Description</h3>
              <p className="text-gray-600 leading-relaxed">{proof?.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600">{proof?.location}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Timestamp</h4>
                <p className="text-gray-600">{formatTimestamp(proof?.timestamp)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Beneficiaries</h4>
                <p className="text-gray-600">{proof?.beneficiaries} people</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Disaster ID</h4>
                <p className="text-gray-600 font-mono text-sm">{proof?.disasterId}</p>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 font-medium text-gray-900">IPFS Details</h4>
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <p className="font-mono text-sm text-gray-600 break-all">
                  {proof?.ipfsHash}
                </p>
              </div>
            </div>
            
            <div>
              <h4 className="mb-3 font-medium text-gray-900">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {proof?.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 text-sm text-blue-800 bg-blue-100 rounded-full font-medium border border-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold text-gray-900">
                Proof of Aid Gallery
              </h1>
              <p className="text-gray-600">
                Browse and verify aid distribution evidence stored on IPFS. Discover transparent, 
                blockchain-verified proof of humanitarian efforts worldwide.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Blockchain Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <span>IPFS Stored</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="p-6">
            <div className="space-y-6">
              {/* Enhanced Search Bar */}
              <div className="relative">
                <Search className="absolute w-6 h-6 text-gray-400 transform -translate-y-1/2 left-4 top-1/2" />
                <input
                  type="text"
                  placeholder="Search proofs by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 text-lg border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 transition-all duration-200"
                />
              </div>
              
              {/* Enhanced Filters Row */}
              <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">Filters:</span>
                  </div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="all">All Types</option>
                    <option value="image">Images</option>
                    <option value="document">Documents</option>
                    <option value="video">Videos</option>
                  </select>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="all">All Status</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
                  >
                    <option value="timestamp">Sort by Date</option>
                    <option value="beneficiaries">Sort by Impact</option>
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                  </select>
                </div>

                {/* Enhanced View Mode Toggle */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Enhanced Results Count */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-medium text-gray-700">
              Showing <span className="text-blue-600 font-bold">{filteredItems.length}</span> of{' '}
              <span className="text-gray-900 font-bold">{proofItems.length}</span> proof items
            </p>
            {filteredItems.length > 0 && (
              <div className="text-sm text-gray-500">
                {sortBy === 'timestamp' && 'Sorted by Date'}
                {sortBy === 'beneficiaries' && 'Sorted by Impact'}
                {sortBy === 'title' && 'Sorted by Title'}
                {sortBy === 'rating' && 'Sorted by Rating'}
              </div>
            )}
          </div>
        </motion.div>

        {/* Enhanced Content Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Loading proof items...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              layout
              className={viewMode === 'grid' 
                ? "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
              }
            >
              {filteredItems.map((proof, index) => (
                <motion.div
                  key={proof.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                >
                  <ProofCard
                    proof={proof}
                    onClick={setSelectedProof}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Enhanced Empty State */}
        {!loading && filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="py-20 text-center"
          >
            <div className="w-24 h-24 mx-auto mb-6 p-4 bg-gray-100 rounded-full">
              <Image className="w-full h-full text-gray-400" />
            </div>
            <h3 className="mb-3 text-2xl font-bold text-gray-900">
              No proof items found
            </h3>
            <p className="mb-6 text-gray-600 max-w-md mx-auto">
              Try adjusting your search terms or filters. You can also browse all items by clearing your current filters.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterStatus('all');
              }}
            >
              Clear All Filters
            </Button>
          </motion.div>
        )}
      </div>

      {/* Proof Modal */}
      <ProofModal
        proof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />
    </div>
  );
};

export default ProofGallery;
