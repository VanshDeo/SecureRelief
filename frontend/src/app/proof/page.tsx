'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    MapPin,
    Download,
    Share2,
    Users
} from 'lucide-react';
import Image from 'next/image';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import Modal from '@/components/UI/Modal';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { useWeb3Store } from '@/store/web3Store';
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface ProofItem {
    id: string;
    title: string;
    type: string;
    url: string;
    description: string;
    location: string;
    timestamp: string;
    verificationStatus: string;
    disasterId: string;
    uploadedBy: string;
    beneficiaries: number;
    ipfsHash: string;
    tags: string[];
    likes: number;
    rating: number;
}

const ProofGallery = () => {
    const { isConnected } = useWeb3Store();
    const [proofItems, setProofItems] = useState<ProofItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProof, setSelectedProof] = useState<ProofItem | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus] = useState('all');
    const [sortBy, setSortBy] = useState('timestamp');

    // Mock data
    const mockProofData = [
        {
            id: '1',
            title: 'Cyclone Helene Relief',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1564412458052-005f63484a94?w=900&auto=format&fit=crop&q=60',
            description: 'Food packages distributed to 150 families in Central Relief Camp',
            location: 'Central Relief Camp, District A',
            timestamp: '2024-08-15T10:30:00Z',
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
            title: 'Flood Medical Supplies',
            type: 'document',
            url: 'https://media.istockphoto.com/id/186876633/photo/rock-slide-with-damage-on-the-road-during-a-storm.jpg?s=612x612&w=0',
            description: 'Emergency medical supplies delivered to field hospital',
            location: 'Field Hospital, Sector B',
            timestamp: '2024-08-14T15:45:00Z',
            verificationStatus: 'pending',
            disasterId: 'FLOOD-2024-001',
            uploadedBy: '0x8fa3bF96E654Ab26f8e9A2B7C',
            beneficiaries: 75,
            ipfsHash: 'QmYzWx9vUr8QtZA6b5LMjPv3N2B8cR',
            tags: ['medical', 'supplies', 'healthcare'],
            likes: 18,
            rating: 4.6
        }
    ];

    useEffect(() => {
        // Simulate initial fetch
        setProofItems(mockProofData);
        setLoading(false);
    }, []);

    const filteredItems = React.useMemo(() => {
        const filtered = proofItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || item.type === filterType;
            const matchesStatus = filterStatus === 'all' || item.verificationStatus === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'timestamp': return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                case 'beneficiaries': return b.beneficiaries - a.beneficiaries;
                case 'title': return a.title.localeCompare(b.title);
                case 'rating': return b.rating - a.rating;
                default: return 0;
            }
        });
    }, [searchTerm, filterType, filterStatus, sortBy, proofItems]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return 'text-green-600 bg-green-50 border-green-200';
            case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <RoleGuard title="Aid Proof Gallery" subtitle="Connect your wallet to browse verified proof of aid delivery from around the world.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Proof of Aid Gallery</h1>
                            <p className="text-gray-600">Browse and verify aid distribution evidence stored on IPFS</p>
                        </div>

                        <Card className="p-6 mb-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search proofs..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white text-gray-900"
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <select
                                        className="px-4 py-2 border rounded-lg bg-white text-gray-900"
                                        value={filterType}
                                        onChange={e => setFilterType(e.target.value)}
                                    >
                                        <option value="all">All Types</option>
                                        <option value="image">Images</option>
                                        <option value="document">Documents</option>
                                    </select>
                                    <select
                                        className="px-4 py-2 border rounded-lg bg-white text-gray-900"
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value)}
                                    >
                                        <option value="timestamp">Latest</option>
                                        <option value="beneficiaries">Impact</option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        {loading ? (
                            <div className="flex justify-center py-20"><LoadingSpinner size="lg" aria-label="Loading proofs" /></div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredItems.map(proof => (
                                    <Card key={proof.id} className="overflow-hidden group cursor-pointer" onClick={() => setSelectedProof(proof)}>
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={proof.url}
                                                alt={proof.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                            <div className="absolute top-2 left-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(proof.verificationStatus)}`}>
                                                    {proof.verificationStatus.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="font-bold text-lg text-gray-900 mb-2 truncate">{proof.title}</h3>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-4">{proof.description}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {proof.location}</span>
                                                <span className="flex items-center"><Users className="w-3 h-3 mr-1" /> {proof.beneficiaries}</span>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <Modal isOpen={!!selectedProof} onClose={() => setSelectedProof(null)} title={selectedProof?.title}>
                        {selectedProof && (
                            <div className="space-y-6">
                                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedProof.url}
                                        alt={selectedProof.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-2">Description</h4>
                                    <p className="text-gray-600">{selectedProof.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">Beneficiaries</p>
                                        <p className="font-bold">{selectedProof.beneficiaries} people</p>
                                    </div>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-500">IPFS Hash</p>
                                        <p className="font-mono text-xs truncate">{selectedProof.ipfsHash}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button className="flex-1" icon={Download}>Download Proof</Button>
                                    <Button variant="outline" className="flex-1" icon={Share2}>Share</Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default ProofGallery;
