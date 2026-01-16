import React from 'react'
import Link from 'next/link'
import { Mountain, Github, Twitter, Globe, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Features', href: '/features' },
      { name: 'Security', href: '/security' },
      { name: 'API Docs', href: '/docs' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Community', href: '/community' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Status', href: '/status' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ]
  }

  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/avalanche-disaster-relief',
      icon: Github
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/avalanche_relief',
      icon: Twitter
    },
    {
      name: 'Website',
      href: 'https://avalanche-disaster-relief.com',
      icon: Globe
    }
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <Mountain className="w-8 h-8 text-green-500" />
              <span className="ml-2 text-lg font-bold text-gray-900">
                Relief Network
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Transparent, efficient, and accountable disaster relief funding through blockchain technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors duration-200 hover:text-gray-500"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase">
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-600 transition-colors duration-200 hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="pt-8 mt-12 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">$2.5M+</div>
              <div className="text-sm text-gray-600">Funds Distributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">15,000+</div>
              <div className="text-sm text-gray-600">Lives Impacted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">250+</div>
              <div className="text-sm text-gray-600">Verified Vendors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-avalanche-600">50+</div>
              <div className="text-sm text-gray-600">Active Zones</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-12 border-t border-gray-200">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="flex items-center text-sm text-gray-600">
              <span>© {currentYear} Avalanche Disaster Relief Network.</span>
              <span className="ml-1">Built with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500" fill="currentColor" />
              <span>for humanitarian causes.</span>
            </div>

            <div className="flex items-center mt-4 space-x-6 md:mt-0">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 mr-2 bg-green-500 rounded-full"></div>
                <span>All systems operational</span>
              </div>
              <div className="text-sm text-gray-500">
                Powered by Avalanche
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="pt-6 mt-8 border-t border-gray-200">
          <p className="text-xs text-center text-gray-500">
            This platform operates on the Avalanche blockchain. Please ensure you understand the risks associated with cryptocurrency transactions.
            All donations are recorded on the blockchain for complete transparency.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
