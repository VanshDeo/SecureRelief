'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    CheckCircle,
    Clock,
    XCircle,
    UserCheck,
    Search,
    Filter,
    MoreVertical,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import Card from '@/components/UI/Card';
import Button from '@/components/UI/Button';
import { toast } from 'react-hot-toast';

interface Vendor {
    id: string;
    name: string;
    address: string;
    type: string;
    status: 'verified' | 'pending' | 'rejected';
    totalAidDistributed: number;
    joinedDate: string;
}

const VendorManagement = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'pending' | 'rejected'>('all');

    useEffect(() => {
        // Mock data for initial implementation
        const mockVendors: Vendor[] = [
            {
                id: '1',
                name: 'Relief Supply Co.',
                address: '0x1234...5678',
                type: 'Food & Water',
                status: 'verified',
                totalAidDistributed: 15750,
                joinedDate: '2024-01-15'
            },
            {
                id: '2',
                name: 'Emergency Medical Partners',
                address: '0x8765...4321',
                type: 'Medical Supplies',
                status: 'pending',
                totalAidDistributed: 0,
                joinedDate: '2024-02-10'
            },
            {
                id: '3',
                name: 'Shelter Solutions Ltd',
                address: '0xabcd...efgh',
                type: 'Logistics',
                status: 'verified',
                totalAidDistributed: 8420,
                joinedDate: '2023-11-20'
            }
        ];

        setTimeout(() => {
            setVendors(mockVendors);
            setLoading(false);
        }, 1000);
    }, []);

    const handleVerify = (vendorId: string) => {
        setVendors(prev => prev.map(v =>
            v.id === vendorId ? { ...v, status: 'verified' } : v
        ));
        toast.success('Vendor verified successfully');
    };

    const handleReject = (vendorId: string) => {
        setVendors(prev => prev.map(v =>
            v.id === vendorId ? { ...v, status: 'rejected' } : v
        ));
        toast.error('Vendor application rejected');
    };

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || vendor.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        verified: vendors.filter(v => v.status === 'verified').length,
        pending: vendors.filter(v => v.status === 'pending').length,
        rejected: vendors.filter(v => v.status === 'rejected').length,
        total: vendors.length
    };

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Vendors</div>
                        <div className="text-3xl font-black text-gray-900">{stats.total}</div>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Verified</div>
                        <div className="text-3xl font-black text-green-600">{stats.verified}</div>
                    </div>
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending</div>
                        <div className="text-3xl font-black text-yellow-600">{stats.pending}</div>
                    </div>
                    <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl group-hover:bg-yellow-600 group-hover:text-white transition-colors">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between group">
                    <div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Rejected</div>
                        <div className="text-3xl font-black text-red-600">{stats.rejected}</div>
                    </div>
                    <div className="p-3 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                        <XCircle className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search vendors by name or address..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-avalanche-500 transition-all font-medium text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2 bg-gray-50 px-3 rounded-xl">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            className="bg-transparent border-none py-3 focus:ring-0 font-bold text-[10px] uppercase tracking-widest text-gray-600"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                        >
                            <option value="all">All Vendors</option>
                            <option value="verified">Verified Only</option>
                            <option value="pending">Pending Review</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Vendor List */}
            <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Vendor Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Trust Status</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Sector</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Aid Value</th>
                                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredVendors.map((vendor) => (
                                <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-xl bg-avalanche-50 flex items-center justify-center text-avalanche-600 font-black shadow-sm">
                                                {vendor.name.charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <p className="font-bold text-gray-900 leading-tight">{vendor.name}</p>
                                                <p className="text-[10px] text-gray-400 font-mono mt-0.5">{vendor.address}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${vendor.status === 'verified' ? 'bg-green-50 text-green-600 shadow-sm border border-green-100' :
                                            vendor.status === 'pending' ? 'bg-yellow-50 text-yellow-600 shadow-sm border border-yellow-100' :
                                                'bg-red-50 text-red-600 shadow-sm border border-red-100'
                                            }`}>
                                            {vendor.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md uppercase tracking-wider">
                                            {vendor.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-black text-gray-900">
                                            ${vendor.totalAidDistributed.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end space-x-2">
                                            {vendor.status === 'pending' && (
                                                <>
                                                    <Button size="sm" onClick={() => handleVerify(vendor.id)}>
                                                        Verify
                                                    </Button>
                                                    <Button size="sm" variant="outline" onClick={() => handleReject(vendor.id)}>
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                            <button className="p-1 hover:bg-gray-200 rounded">
                                                <MoreVertical className="w-4 h-4 text-gray-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredVendors.length === 0 && (
                    <div className="p-12 text-center">
                        <Users className="w-12 h-12 mx-auto text-gray-400 mb-2 opacity-20" />
                        <p className="text-gray-500">No vendors found matching your criteria.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default VendorManagement;
