'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldCheck, Gift, Activity, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

const steps = [
    {
        id: 1,
        title: "Donate Securely",
        description: "Contributors fund relief efforts via smart contracts, ensuring funds are locked until conditions are met.",
        icon: Wallet,
        color: "text-blue-500",
        bg: "bg-blue-50",
        borderColor: "border-blue-100"
    },
    {
        id: 2,
        title: "Verify Identity",
        description: "Beneficiaries and vendors are vetted using trusted oracles and digital identity verification systems.",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        borderColor: "border-emerald-100"
    },
    {
        id: 3,
        title: "Direct Distribution",
        description: "Smart contracts automatically release funds or digital vouchers directly to verified recipients.",
        icon: Gift,
        color: "text-purple-500",
        bg: "bg-purple-50",
        borderColor: "border-purple-100"
    },
    {
        id: 4,
        title: "Track Impact",
        description: "Every transaction is recorded on-chain, providing real-time, immutable proof of aid delivery.",
        icon: Activity,
        color: "text-amber-500",
        bg: "bg-amber-50",
        borderColor: "border-amber-100"
    }
];

export function HowItWorks() {
    return (
        <section className="py-24 bg-gray-50/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4"
                    >
                        How it Works
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-600"
                    >
                        Secure Relief leverages blockchain technology to eliminate intermediaries and ensure 100% transparency in aid distribution.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connector Line for Desktop */}
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-200 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className="relative"
                        >
                            <Card className={`h-full border ${step.borderColor} shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden`}>
                                <div className={`absolute top-0 right-0 p-3 opacity-10`}>
                                    <step.icon className={`w-24 h-24 ${step.color}`} />
                                </div>
                                <CardContent className="p-6 pt-8 flex flex-col items-center text-center relative z-10">
                                    <div className={`mb-6 p-4 rounded-full ${step.bg} ${step.color} shadow-sm ring-4 ring-white`}>
                                        <step.icon className="h-8 w-8" />
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Mobile Connector Arrow */}
                            {index < steps.length - 1 && (
                                <div className="flex justify-center -mb-4 mt-4 lg:hidden text-gray-300">
                                    <ArrowRight className="h-6 w-6 rotate-90" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
