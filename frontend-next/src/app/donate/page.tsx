'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Heart,
    MapPin,
    Users,
    Clock,
    TrendingUp,
    DollarSign,
    Search,
    Filter,
    CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import { useWeb3Store } from '@/store/web3Store';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Modal from '@/components/UI/Modal';
import { toast } from 'react-hot-toast';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import RoleGuard from '@/components/Auth/RoleGuard';
import DashboardLayout from '@/components/Layout/DashboardLayout';

interface Disaster {
    id: number;
    name: string;
    location: string;
    description: string;
    raised: number;
    target: number;
    distributed: number;
    beneficiaries: number;
    status: string;
    urgency: string;
    image: string;
    createdAt: Date;
    categories: string[];
    address?: string; // For contract interaction
}

const mockDonations = [
    { id: 'DON-2024-001', date: '2024-08-10', amount: 100, disaster: 'Hurricane Delta Relief', status: 'Completed' },
    { id: 'DON-2024-002', date: '2024-08-05', amount: 50, disaster: 'Wildfire Recovery', status: 'Completed' },
    { id: 'DON-2024-003', date: '2024-08-01', amount: 75, disaster: 'General Relief Fund', status: 'Completed' }
];

const impactStats = {
    totalPeopleHelped: 127,
    communitiesSupported: 8,
    disastersSupported: 5,
    impactScore: 'Gold'
};

interface DetailedImpact {
    id: string;
    disasterName: string;
    location: string;
    amount: number;
    peopleHelped: number;
    reliefType: string;
    outcome: string;
}

const mockDetailedImpacts: DetailedImpact[] = [
    {
        id: '1',
        disasterName: 'Hurricane Delta Relief',
        location: 'Florida Gulf Coast',
        amount: 250,
        peopleHelped: 45,
        reliefType: 'Immediate relief',
        outcome: 'Emergency shelter and food provided to 45 families'
    },
    {
        id: '2',
        disasterName: 'Wildfire Recovery',
        location: 'California Central Valley',
        amount: 150,
        peopleHelped: 32,
        reliefType: 'Immediate relief',
        outcome: 'Temporary housing and medical supplies for 32 individuals'
    },
    {
        id: '3',
        disasterName: 'Flood Relief 2024',
        location: 'Texas Panhandle',
        amount: 200,
        peopleHelped: 28,
        reliefType: 'Reconstruction',
        outcome: 'Supplied building materials for 12 damaged homes'
    }
];

const mockDisasters: Disaster[] = [
    {
        id: 1,
        name: 'Turkey Earthquake Relief',
        location: 'Kahramanmaraş, Turkey',
        description: 'Emergency aid for earthquake victims in southern Turkey',
        raised: 125000,
        target: 200000,
        distributed: 98000,
        beneficiaries: 2500,
        status: 'active',
        urgency: 'high',
        image: 'https://forward.com/wp-content/uploads/2023/02/GettyImages-1246848248.jpeg',
        createdAt: new Date('2024-01-15'),
        categories: ['Medical', 'Food', 'Shelter', 'Water']
    },
    {
        id: 2,
        name: 'Flood Recovery Fund',
        location: 'Kerala, India',
        description: 'Supporting families affected by monsoon flooding',
        raised: 87500,
        target: 150000,
        distributed: 75200,
        beneficiaries: 1800,
        status: 'active',
        urgency: 'medium',
        image: 'https://imagesvs.oneindia.com/img/2023/12/chennai-floods-small-1701933535.jpg',
        createdAt: new Date('2024-01-20'),
        categories: ['Food', 'Shelter', 'Clothing', 'Medical']
    },
    {
        id: 3,
        name: 'Wildfire Support',
        location: 'California, USA',
        description: 'Recovery assistance for wildfire-affected communities',
        raised: 156000,
        target: 156000,
        distributed: 156000,
        beneficiaries: 3200,
        status: 'completed',
        urgency: 'low',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97yLCkYtLMx3pMfG4KAOd6luNbIk-YYQejg&s',
        createdAt: new Date('2024-01-10'),
        categories: ['Shelter', 'Food', 'Medical', 'Transportation']
    }
];

const DonorDashboard = () => {
    const { isConnected, contractService, usdcBalance: storeUsdcBalance, updateBalance } = useWeb3Store();
    const [disasters, setDisasters] = useState<Disaster[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [donating, setDonating] = useState(false);
    const [activeTab, setActiveTab] = useState('donate');

    const loadDisasters = React.useCallback(async () => {
        try {
            setLoading(true);
            // In a real app, this would fetch from the smart contract
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
            setDisasters(mockDisasters);
        } catch (error) {
            console.error('Error loading disasters:', error);
            toast.error('Failed to load disasters');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDisasters();
        if (isConnected) {
            updateBalance();
        }
    }, [isConnected, updateBalance, loadDisasters]);

    const handleDonate = async () => {
        if (!isConnected) {
            toast.error('Please connect your wallet first');
            return;
        }

        if (!donationAmount || parseFloat(donationAmount) <= 0) {
            toast.error('Please enter a valid donation amount');
            return;
        }

        if (parseFloat(donationAmount) > parseFloat(storeUsdcBalance)) {
            toast.error('Insufficient USDC balance');
            return;
        }

        try {
            setDonating(true);

            if (!contractService) {
                throw new Error('Contract service not initialized');
            }

            if (!selectedDisaster) {
                throw new Error('No disaster selected');
            }


            // Call donation function on contract service
            // Note: Assuming transferUSDC is for donation here, or update with specific donation function
            const result = await contractService.transferUSDC(selectedDisaster.address || '0x0000000000000000000000000000000000000000', donationAmount);

            if (result.success) {
                toast.success('Donation successful! Thank you for your contribution.');
                setShowDonationModal(false);
                setDonationAmount('');
                setSelectedDisaster(null);

                // Refresh data
                loadDisasters();
                updateBalance();
            } else {
                toast.error((result as { error?: string }).error || 'Donation failed');
            }

        } catch (error: unknown) {
            console.error('Donation error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Donation failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setDonating(false);
        }
    };

    const filteredDisasters = disasters.filter(disaster => {
        const matchesSearch = disaster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            disaster.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || disaster.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getProgressPercentage = (raised: number, target: number) => {
        return Math.min((raised / target) * 100, 100);
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-orange-600 bg-orange-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <RoleGuard title="Donor Portal" subtitle="Connect your wallet to start making transparent donations and tracking your impact.">
            <DashboardLayout fullWidth={true}>
                <div className="min-h-screen">
                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                        Donation Dashboard
                                    </h1>
                                    <p className="text-gray-600">
                                        Support disaster relief efforts with transparent, blockchain-verified donations
                                    </p>
                                </div>

                                <div className="mt-6 lg:mt-0">
                                    <div className="bg-red-50 rounded-lg p-4">
                                        <div className="text-sm text-red-700 mb-1">
                                            Your USDC Balance
                                        </div>
                                        <div className="text-2xl font-bold text-red-900">
                                            ${parseFloat(storeUsdcBalance).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border-b border-gray-200">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <nav className="-mb-px flex space-x-8">
                                {[
                                    { id: 'donate', label: 'Donate', icon: Heart },
                                    { id: 'history', label: 'History', icon: Clock },
                                    { id: 'impact', label: 'Impact', icon: TrendingUp }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${activeTab === tab.id
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
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {activeTab === 'donate' && (
                            <>
                                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search disasters by name or location..."
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Filter className="h-5 w-5 text-gray-400" />
                                        <select
                                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value)}
                                        >
                                            <option value="all">All Disasters</option>
                                            <option value="active">Active</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                {loading ? (
                                    <div className="flex justify-center items-center h-64">
                                        <LoadingSpinner size="lg" aria-label="Loading disasters..." />
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-blue-100 rounded-lg">
                                                        <TrendingUp className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            {filteredDisasters.filter(d => d.status === 'active').length}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Active Disasters</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <DollarSign className="h-6 w-6 text-green-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            ${filteredDisasters.reduce((sum, d) => sum + d.raised, 0).toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Total Raised</div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <Users className="h-6 w-6 text-purple-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-2xl font-bold text-gray-900">
                                                            {filteredDisasters.reduce((sum, d) => sum + d.beneficiaries, 0).toLocaleString()}
                                                        </div>
                                                        <div className="text-sm text-gray-600">Lives Impacted</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {filteredDisasters.map((disaster, index) => (
                                                <motion.div
                                                    key={disaster.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 overflow-hidden"
                                                >
                                                    <div className="h-48 bg-gray-200 relative">
                                                        <Image
                                                            src={disaster.image}
                                                            alt={disaster.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-600 hidden items-center justify-center">
                                                            <MapPin className="h-12 w-12 text-white" />
                                                        </div>

                                                        <div className="absolute top-4 left-4 right-4 flex justify-between">
                                                            <span className={`
                                                                px-2 py-1 rounded-full text-xs font-medium
                                                                ${disaster.status === 'active'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-blue-100 text-blue-800'
                                                                }
                                                            `}>
                                                                {disaster.status === 'active' ? 'Active' : 'Completed'}
                                                            </span>

                                                            <span className={`
                                                                px-2 py-1 rounded-full text-xs font-medium capitalize
                                                                ${getUrgencyColor(disaster.urgency)}
                                                            `}>
                                                                {disaster.urgency} Priority
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="p-6">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                            {disaster.name}
                                                        </h3>

                                                        <p className="text-gray-600 mb-3 flex items-center">
                                                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                                                            {disaster.location}
                                                        </p>

                                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                            {disaster.description}
                                                        </p>

                                                        <div className="mb-4">
                                                            <div className="flex justify-between text-sm mb-2">
                                                                <span className="text-gray-600">Progress</span>
                                                                <span className="font-medium">
                                                                    ${disaster.raised.toLocaleString()} / ${disaster.target.toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                                                                    style={{ width: `${getProgressPercentage(disaster.raised, disaster.target)}%` }}
                                                                />
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {getProgressPercentage(disaster.raised, disaster.target).toFixed(1)}% funded
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                                            <div>
                                                                <div className="text-gray-600">Distributed</div>
                                                                <div className="font-medium">${disaster.distributed.toLocaleString()}</div>
                                                            </div>
                                                            <div>
                                                                <div className="text-gray-600">Beneficiaries</div>
                                                                <div className="font-medium">{disaster.beneficiaries.toLocaleString()}</div>
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="text-xs text-gray-600 mb-2">Aid Categories</div>
                                                            <div className="flex flex-wrap gap-1">
                                                                {disaster.categories.slice(0, 3).map((category: string) => (
                                                                    <span
                                                                        key={category}
                                                                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                                                                    >
                                                                        {category}
                                                                    </span>
                                                                ))}
                                                                {disaster.categories.length > 3 && (
                                                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                                                                        +{disaster.categories.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2">
                                                            {disaster.status === 'active' ? (
                                                                <Button
                                                                    onClick={() => {
                                                                        setSelectedDisaster(disaster);
                                                                        setShowDonationModal(true);
                                                                    }}
                                                                    className="flex-1"
                                                                    icon={Heart}
                                                                >
                                                                    Donate
                                                                </Button>
                                                            ) : (
                                                                <div className="flex-1 flex items-center justify-center py-2 px-4 bg-gray-100 text-gray-600 rounded-lg">
                                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                                    Completed
                                                                </div>
                                                            )}

                                                            <Button variant="outline" className="flex-1">
                                                                Details
                                                            </Button>
                                                        </div>

                                                        <div className="mt-3 pt-3 border-t border-gray-200 flex items-center text-xs text-gray-500">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            Created {disaster.createdAt.toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {filteredDisasters.length === 0 && !loading && (
                                            <div className="text-center py-16">
                                                <div className="text-gray-400 mb-4">
                                                    <Search className="h-16 w-16 mx-auto mb-4" />
                                                </div>
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                    No disasters found
                                                </h3>
                                                <p className="text-gray-600">
                                                    Try adjusting your search or filter criteria.
                                                </p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'history' && (
                            <Card className="p-0 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-xl font-semibold text-gray-900">Donation History</h2>
                                    <p className="text-sm text-gray-500">View and manage your past blockchain contributions</p>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donation ID</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disaster</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {mockDonations.map(donation => (
                                                <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 font-mono">{donation.id}</td>
                                                    <td className="px-6 py-4 text-sm font-bold text-green-600">${donation.amount} USDC</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{donation.disaster}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{donation.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full">
                                                            {donation.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        )}

                        {activeTab === 'impact' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card className="p-6 text-center shadow-sm">
                                        <Users className="w-10 h-10 mx-auto mb-4 text-blue-500" />
                                        <h3 className="text-3xl font-bold text-gray-900">{impactStats.totalPeopleHelped}</h3>
                                        <p className="text-sm text-gray-500">People Helped</p>
                                    </Card>
                                    <Card className="p-6 text-center shadow-sm">
                                        <MapPin className="w-10 h-10 mx-auto mb-4 text-green-500" />
                                        <h3 className="text-3xl font-bold text-gray-900">{impactStats.communitiesSupported}</h3>
                                        <p className="text-sm text-gray-500">Communities Supported</p>
                                    </Card>
                                    <Card className="p-6 text-center shadow-sm">
                                        <TrendingUp className="w-10 h-10 mx-auto mb-4 text-purple-500" />
                                        <h3 className="text-3xl font-bold text-gray-900">{impactStats.disastersSupported}</h3>
                                        <p className="text-sm text-gray-500">Disasters Supported</p>
                                    </Card>
                                    <Card className="p-6 text-center shadow-sm bg-yellow-50 border-yellow-100">
                                        <Heart className="w-10 h-10 mx-auto mb-4 text-yellow-600 fill-current" />
                                        <h3 className="text-3xl font-bold text-gray-900">{impactStats.impactScore}</h3>
                                        <p className="text-sm text-gray-500">Impact Level</p>
                                    </Card>
                                </div>

                                <Card className="p-8 bg-gradient-to-br from-red-500 to-red-700 text-white border-0 overflow-hidden relative">
                                    <div className="relative z-10 max-w-3xl">
                                        <h2 className="text-2xl font-bold mb-4 flex items-center">
                                            <Heart className="w-6 h-6 mr-2 fill-current" />
                                            Your Giving Legacy
                                        </h2>
                                        <p className="text-red-50 mb-6 text-lg">
                                            Your contributions have directly supported families in 8 communities across 5 different disaster zones.
                                            Every donation is recorded on-chain, ensuring that 100% of your impact is transparent and verifiable.
                                        </p>
                                        <Button variant="outline" className="bg-white text-red-600 hover:bg-red-50 border-0 px-8">
                                            Download Impact Report
                                        </Button>
                                    </div>
                                    <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10">
                                        <Heart className="w-64 h-64" />
                                    </div>
                                </Card>

                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Impact by Disaster</h3>
                                    <div className="space-y-6">
                                        {mockDetailedImpacts.map((impact) => (
                                            <Card key={impact.id} className="p-6">
                                                <div className="flex justify-between items-start mb-6">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">{impact.disasterName}</h4>
                                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                                            <MapPin className="w-4 h-4 mr-1" />
                                                            {impact.location}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-green-600">${impact.amount}</div>
                                                        <div className="text-xs text-gray-500">donated</div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                                    <div className="flex items-start">
                                                        <div className="p-2 bg-blue-50 rounded-lg mr-4">
                                                            <Users className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{impact.peopleHelped} people helped</div>
                                                            <div className="text-sm text-gray-500">Direct beneficiaries</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start">
                                                        <div className="p-2 bg-red-50 rounded-lg mr-4">
                                                            <Heart className="w-5 h-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{impact.reliefType}</div>
                                                            <div className="text-sm text-gray-500">Emergency response</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-gray-50 rounded-xl p-4">
                                                    <div className="text-sm font-bold text-gray-900 mb-1">Outcome:</div>
                                                    <div className="text-sm text-gray-600">{impact.outcome}</div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <Modal
                        isOpen={showDonationModal}
                        onClose={() => {
                            setShowDonationModal(false);
                            setSelectedDisaster(null);
                            setDonationAmount('');
                        }}
                        title="Make a Donation"
                    >
                        {selectedDisaster && (
                            <div>
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-900 mb-2">
                                        {selectedDisaster.name}
                                    </h4>
                                    <p className="text-sm text-gray-600 flex items-center">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {selectedDisaster.location}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Donation Amount (USDC)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            value={donationAmount}
                                            onChange={(e) => setDonationAmount(e.target.value)}
                                            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900"
                                            placeholder="0.00"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 text-sm">USDC</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        Available balance: ${parseFloat(storeUsdcBalance).toLocaleString()} USDC
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <h5 className="font-medium text-gray-900 mb-2">Transaction Details</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Donation Amount:</span>
                                            <span className="font-medium">${donationAmount || '0.00'} USDC</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Network Fee:</span>
                                            <span className="font-medium">~$0.02 AVAX</span>
                                        </div>
                                        <div className="flex justify-between text-gray-900 font-medium border-t border-gray-200 pt-2">
                                            <span>Total Cost:</span>
                                            <span>${donationAmount || '0.00'} USDC + gas</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <h5 className="font-medium text-blue-900 mb-2">Impact Preview</h5>
                                    <p className="text-sm text-blue-800">
                                        Your ${donationAmount || '0'} donation will be geo-locked to {selectedDisaster.location} and
                                        can only be spent by verified vendors for essential supplies like food, water, medical aid, and shelter.
                                    </p>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => {
                                            setShowDonationModal(false);
                                            setSelectedDisaster(null);
                                            setDonationAmount('');
                                        }}
                                        variant="outline"
                                        className="flex-1"
                                        disabled={donating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleDonate}
                                        loading={donating}
                                        disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                                        className="flex-1"
                                        icon={Heart}
                                    >
                                        Confirm Donation
                                    </Button>
                                </div>
                            </div>
                        )}
                    </Modal>
                </div>
            </DashboardLayout>
        </RoleGuard>
    );
};

export default DonorDashboard;
