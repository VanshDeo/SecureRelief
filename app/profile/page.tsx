'use client';

import React, { useState } from 'react';
import { useAccount } from 'wagmi';
import { useAuth } from '@/context/MockAuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { User, Mail, Wallet, Shield, Save, Camera, MapPin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { address, isConnected } = useAccount();
    const { role } = useAuth();

    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "Alex Doe",
        email: "alex.doe@example.com",
        bio: "Passionate about decentralized humanitarian aid.",
        location: "New York, USA",
        website: "https://alexdoe.eth",
    });

    const handleSave = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            alert("Profile updated successfully!"); // In a real app, use a Toast here
        }, 1500);
    };

    if (!isConnected) {
        return (
            <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="bg-muted p-4 rounded-full">
                    <Wallet className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Wallet Not Connected</h1>
                <p className="text-muted-foreground">Please connect your wallet to view and edit your profile.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row gap-8"
            >
                {/* Sidebar: Identity */}
                <div className="w-full md:w-1/3 space-y-6">
                    <Card className="text-center overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/10"></div>
                        <div className="relative -mt-12 px-6 pb-6">
                            <div className="relative inline-block">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${address}`} />
                                    <AvatarFallback>AD</AvatarFallback>
                                </Avatar>
                                <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity shadow-sm border border-background">
                                    <Camera className="h-3 w-3" />
                                </button>
                            </div>
                            <h2 className="mt-4 text-xl font-bold">{formData.name}</h2>
                            <p className="text-sm text-muted-foreground truncate font-mono bg-muted/50 py-1 px-3 rounded-full inline-block mt-2">
                                {address}
                            </p>

                            <div className="mt-6 flex flex-wrap justify-center gap-2">
                                <Badge variant="secondary" className="capitalize">
                                    <Shield className="h-3 w-3 mr-1" /> {role}
                                </Badge>
                                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    Verified User
                                </Badge>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Wallet Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Reputation Score</span>
                                <span className="font-bold text-primary">750/1000</span>
                            </div>
                            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-3/4" />
                            </div>
                            <div className="pt-4 border-t flex justify-between">
                                <div>
                                    <p className="text-xs text-muted-foreground">Total Donated</p>
                                    <p className="font-bold">$1,250.00</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">Campaigns Supported</p>
                                    <p className="font-bold">12</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content: Edit Form */}
                <div className="flex-1 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>
                                Manage your personal information and public profile settings.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="pl-9"
                                            type="email"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                                <p className="text-[10px] text-muted-foreground">Brief description for your public profile.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Website</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="justify-end border-t pt-6">
                            <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                                <Save className="h-4 w-4" />
                                {isLoading ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                "Email me about new campaigns in my region",
                                "Notify me when my donation is utilized",
                                "Send monthly impact reports"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <input type="checkbox" id={`notif-${i}`} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                                    <label htmlFor={`notif-${i}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                                        {item}
                                    </label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
}
