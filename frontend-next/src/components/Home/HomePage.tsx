'use client';

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Heart,
  Users,
  DollarSign,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle
} from 'lucide-react'

const HomePage = () => {
  const router = useRouter()
  const features = [
    {
      icon: Shield,
      title: 'Transparent & Secure',
      description: 'All transactions recorded on Avalanche blockchain for complete transparency and security.',
      color: 'text-blue-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Sub-second transaction finality with minimal fees on Avalanche network.',
      color: 'text-yellow-500'
    },
    {
      icon: Globe,
      title: 'Geo-Locked Spending',
      description: 'Funds can only be spent within designated disaster zones for maximum impact.',
      color: 'text-green-500'
    },
    {
      icon: Heart,
      title: 'Direct Impact',
      description: 'Connect directly with verified vendors and see real-time proof of aid delivery.',
      color: 'text-red-500'
    }
  ]

  const stats = [
    {
      icon: DollarSign,
      value: '$2.5M+',
      label: 'Funds Distributed',
      change: '+15% this month'
    },
    {
      icon: Users,
      value: '15,000+',
      label: 'Lives Impacted',
      change: '+23% this month'
    },
    {
      icon: MapPin,
      value: '50+',
      label: 'Active Zones',
      change: '+8 new zones'
    },
    {
      icon: TrendingUp,
      value: '99.8%',
      label: 'Fund Efficiency',
      change: 'Industry leading'
    }
  ]

  const recentDisasters = [
    {
      id: 1,
      name: 'Turkey Earthquake Relief',
      location: 'Kahramanmaraş, Turkey',
      raised: '$125,000',
      distributed: '$98,000',
      beneficiaries: 2500,
      status: 'active',
      image: 'https://forward.com/wp-content/uploads/2023/02/GettyImages-1246848248.jpeg'
    },
    {
      id: 2,
      name: 'Flood Recovery Fund',
      location: 'Kerala, India',
      raised: '$87,500',
      distributed: '$75,200',
      beneficiaries: 1800,
      status: 'active',
      image: 'https://imagesvs.oneindia.com/img/2023/12/chennai-floods-small-1701933535.jpg'
    },
    {
      id: 3,
      name: 'Wildfire Support',
      location: 'California, USA',
      raised: '$156,000',
      distributed: '$156,000',
      beneficiaries: 3200,
      status: 'completed',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS97yLCkYtLMx3pMfG4KAOd6luNbIk-YYQejg&s'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
              Blockchain-Powered
              <span className="block text-green-100">
                Disaster Relief
              </span>
            </h1>
            <p className="max-w-3xl mx-auto mb-8 text-xl text-green-100">
              Transparent, efficient, and accountable disaster relief funding through
              Avalanche blockchain technology. Every donation tracked, every impact verified.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/donate"
                  className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-200 bg-white rounded-lg shadow-lg text-green-600 hover:bg-gray-50"
                >
                  Start Donating
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/transparency"
                  className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-200 border-2 border-white rounded-lg hover:bg-white hover:text-green-600"
                >
                  View Transparency
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-avalanche-50">
                      <Icon className="w-8 h-8 text-avalanche-500" />
                    </div>
                  </div>
                  <div className="mb-2 text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="mb-1 text-gray-600">
                    {stat.label}
                  </div>
                  <div className="text-sm text-success-600">
                    {stat.change}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              Why Choose Our Platform?
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Built on Avalanche blockchain for maximum transparency, efficiency, and impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="p-6 transition-all duration-200 bg-white shadow-sm rounded-xl hover:shadow-md"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-50">
                      <Icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-center text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-center text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Disasters Section */}
      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                Active Disaster Relief
              </h2>
              <p className="text-xl text-gray-600">
                See where your donations are making an immediate impact.
              </p>
            </div>
            <Link
              href="/transparency"
              className="items-center hidden font-medium sm:flex text-green-600 hover:text-green-700"
            >
              View All
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentDisasters.map((disaster, index) => (
              <motion.div
                key={disaster.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="overflow-hidden transition-all duration-200 bg-white border border-gray-200 shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={disaster.image}
                    alt={disaster.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const nextSibling = target.nextElementSibling as HTMLElement;
                      if (nextSibling) {
                        nextSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    className="items-center justify-center hidden w-full h-full bg-gradient-to-br from-avalanche-400 to-avalanche-600"
                  >
                    <MapPin className="w-12 h-12 text-white" />
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${disaster.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                      }
                    `}>
                      {disaster.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {disaster.name}
                  </h3>
                  <p className="flex items-center mb-4 text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {disaster.location}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Raised</span>
                      <span className="text-sm font-medium text-gray-900">
                        {disaster.raised}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Distributed</span>
                      <span className="text-sm font-medium text-gray-900">
                        {disaster.distributed}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Beneficiaries</span>
                      <span className="text-sm font-medium text-gray-900">
                        {disaster.beneficiaries.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-200">
                    <Link
                      href={`/disaster/${disaster.id}`}
                      className="w-full text-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-block"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/transparency"
              className="inline-flex items-center font-medium text-green-600 hover:text-green-700"
            >
              View All Disasters
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              How It Works
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Simple, transparent, and efficient disaster relief in four easy steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: '01',
                title: 'Connect Wallet',
                description: 'Connect your Web3 wallet to the Avalanche network'
              },
              {
                step: '02',
                title: 'Choose Disaster',
                description: 'Select an active disaster zone that needs support'
              },
              {
                step: '03',
                title: 'Make Donation',
                description: 'Send USDC donations with minimal transaction fees'
              },
              {
                step: '04',
                title: 'Track Impact',
                description: 'Monitor real-time spending and proof of aid delivery'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="mb-4 text-4xl font-bold text-green-500">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-500">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Make a Difference?
            </h2>
            <p className="mb-8 text-xl text-green-100">
              Join thousands of donors who are creating transparent,
              accountable disaster relief through blockchain technology.
            </p>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/donate"
                  className="inline-flex items-center px-8 py-4 font-semibold transition-all duration-200 bg-white rounded-lg shadow-lg text-green-600 hover:bg-gray-50"
                >
                  Start Donating Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-200 border-2 border-white rounded-lg hover:bg-white hover:text-green-600"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
