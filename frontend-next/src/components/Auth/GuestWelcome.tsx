'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Heart, ShieldCheck, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from '../UI/Card';
import Button from '../UI/Button';

interface GuestWelcomeProps {
    title?: string;
    subtitle?: string;
    roleSpecific?: string | null;
}

const GuestWelcome: React.FC<GuestWelcomeProps> = ({
    title = "Welcome to Disaster Relief Network",
    subtitle = "Join our community to access enhanced features and local relief support",
    roleSpecific = null
}) => {
    const features = [
        {
            icon: Heart,
            title: "Secure Donations",
            description: "Support disaster relief efforts with transparent blockchain-verified donations.",
            available: true,
            color: "text-red-600",
            bgColor: "bg-red-100"
        },
        {
            icon: Users,
            title: "Community Impact",
            description: "Track how your contributions directly help families and communities in need.",
            available: false,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
        },
        {
            icon: ShieldCheck,
            title: "Verified Aid",
            description: "All aid distribution is transparently recorded and cryptographically verified.",
            available: true,
            color: "text-green-600",
            bgColor: "bg-green-100"
        },
        {
            icon: TrendingUp,
            title: "Real-time Metrics",
            description: "Monitor relief progress and funding allocation through live dashboards.",
            available: false,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16 text-center"
                >
                    <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                        <span className="relative flex h-2 w-2 mr-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Platform Live on Avalanche Network
                    </div>
                    <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                        {title}
                    </h1>
                    <p className="max-w-2xl mx-auto mb-10 text-xl text-gray-600">
                        {subtitle}
                    </p>

                    {roleSpecific && (
                        <div className="p-4 mb-10 border border-blue-200 rounded-xl bg-blue-50 max-w-lg mx-auto shadow-sm">
                            <p className="text-blue-700 font-medium">{roleSpecific}</p>
                        </div>
                    )}

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/login" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:px-8 shadow-lg shadow-green-200">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/register" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:px-8 bg-white">
                                Create Account
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 gap-8 mb-16 md:grid-cols-2"
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={itemVariants}>
                            <Card className="h-full p-8 transition-all hover:shadow-xl hover:-translate-y-1">
                                <div className="flex items-start space-x-5">
                                    <div className={`flex-shrink-0 p-4 rounded-2xl ${feature.bgColor} ${feature.color}`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {feature.title}
                                            </h3>
                                            {feature.available ? (
                                                <span className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full uppercase tracking-wider">
                                                    Ready
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full uppercase tracking-wider">
                                                    Reserved
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 leading-relaxed font-normal">
                                            {feature.description}
                                        </p>
                                        <div className="mt-4">
                                            <Link href="/login" className="text-sm font-semibold text-green-600 hover:text-green-700 inline-flex items-center group">
                                                Learn more <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="p-10 relative overflow-hidden text-center bg-gray-900 border-none shadow-2xl rounded-3xl">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_25%_25%,#10b981_0,transparent_50%),radial-gradient(circle_at_75%_75%,#3b82f6_0,transparent_50%)]"></div>
                        <div className="relative z-10">
                            <h2 className="mb-6 text-3xl font-extrabold text-white">
                                Ready to Make a Difference?
                            </h2>
                            <p className="max-w-2xl mx-auto mb-10 text-gray-300 text-lg">
                                Join a global network of donors, first responders, and relief organizations working together to provide immediate aid where it's needed most.
                            </p>
                            <div className="flex flex-col justify-center gap-6 sm:flex-row">
                                <Link href="/donate" className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto px-8 bg-green-500 hover:bg-green-600 text-white font-bold h-12">
                                        <Heart className="w-5 h-5 mr-3" />
                                        Donate Now
                                    </Button>
                                </Link>
                                <Link href="/transparency" className="w-full sm:w-auto">
                                    <Button variant="outline" className="w-full sm:w-auto px-8 border-gray-600 text-gray-100 hover:bg-gray-800 h-12">
                                        View Transparency Portal
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
};

export default GuestWelcome;
