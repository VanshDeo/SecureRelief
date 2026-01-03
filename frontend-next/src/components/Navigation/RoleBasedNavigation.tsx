'use client';

import React from 'react';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import {
  Home,
  Shield,
  Banknote,
  Database,
  Store,
  Heart,
  Users,
  Eye,
  FileText,
  BarChart3,
  Settings,
  Building
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RoleGuard from '../Auth/RoleGuard';

const RoleBasedNavigation = ({ isMobile = false, isCollapsed = false }: { isMobile?: boolean; isCollapsed?: boolean }) => {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();

  const getNavigationItems = () => {
    // ... items stay the same ...
    const baseItems = [
      {
        name: 'Home',
        href: '/',
        icon: Home,
        description: 'Main dashboard',
        roles: [],
        permissions: []
      },
      {
        name: 'Transparency Portal',
        href: '/transparency',
        icon: Eye,
        description: 'Public transparency information',
        roles: [],
        permissions: []
      },
      {
        name: 'Proof Gallery',
        href: '/proof',
        icon: FileText,
        description: 'Aid distribution proof',
        roles: [],
        permissions: []
      }
    ];

    const roleSpecificItems = [
      {
        name: 'Admin Dashboard',
        href: '/admin',
        icon: Shield,
        description: 'System administration',
        roles: ['admin'],
        permissions: ['manage:all']
      },
      {
        name: 'Government Portal',
        href: '/government',
        icon: Building,
        description: 'Government oversight',
        roles: ['government'],
        permissions: ['disaster:create']
      },
      {
        name: 'Treasury Management',
        href: '/treasury',
        icon: Banknote,
        description: 'Financial management',
        roles: ['treasury'],
        permissions: ['treasury:allocate']
      },
      {
        name: 'Oracle Dashboard',
        href: '/oracle',
        icon: Database,
        description: 'Data verification',
        roles: ['oracle'],
        permissions: ['data:verify']
      },
      {
        name: 'Vendor Portal',
        href: '/vendor',
        icon: Store,
        description: 'Vendor management',
        roles: ['vendor'],
        permissions: ['voucher:redeem']
      },
      {
        name: 'Victim Portal',
        href: '/victim',
        icon: Users,
        description: 'Aid requests',
        roles: ['victim'],
        permissions: ['voucher:claim']
      },
      {
        name: 'Donation Dashboard',
        href: '/donate',
        icon: Heart,
        description: 'Make donations',
        roles: ['donor'],
        permissions: ['donation:make']
      }
    ];

    const managementItems = [
      {
        name: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
        description: 'System analytics',
        roles: ['admin', 'government', 'treasury'],
        permissions: ['analytics:view']
      },
      {
        name: 'Settings',
        href: '/settings',
        icon: Settings,
        description: 'System configuration',
        roles: ['admin'],
        permissions: ['system:configure']
      }
    ];

    return [...baseItems, ...roleSpecificItems, ...managementItems];
  };

  const navigationItems = getNavigationItems();

  const isCurrentPath = (href) => {
    return pathname === href;
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const isActive = isCurrentPath(item.href);

    return (
      <RoleGuard
        roles={item.roles}
        permissions={item.permissions}
        fallback={null}
      >
        <Link
          href={item.href}
          className={`
            flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300
            ${isActive
              ? 'bg-avalanche-100/80 text-avalanche-700 border-r-2 border-avalanche-500'
              : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900'
            }
            ${(isMobile || !isCollapsed) ? 'justify-start' : 'justify-center'}
          `}
          title={isCollapsed ? item.name : ''}
        >
          <Icon className={`w-5 h-5 flex-shrink-0 ${(isMobile || !isCollapsed) ? 'mr-3' : ''}`} />
          {(isMobile || !isCollapsed) && (
            <span className="truncate">
              {item.name}
            </span>
          )}
          {isActive && (isMobile || !isCollapsed) && (
            <div className="w-2 h-2 ml-auto rounded-full bg-avalanche-500" />
          )}
        </Link>
      </RoleGuard>
    );
  };

  return (
    <nav className="space-y-1">
      {/* User Role Badge */}
      {isAuthenticated && user && (
        <div className={`mb-6 ${isMobile ? 'px-4' : 'px-1'} transition-all duration-300`}>
          <div className={`p-3 text-white rounded-lg bg-gradient-to-r from-avalanche-500 to-avalanche-600 shadow-md ${isCollapsed && !isMobile ? 'flex justify-center' : ''}`}>
            <div className={`flex items-center ${(isMobile || !isCollapsed) ? 'justify-start' : 'justify-center'}`}>
              <Shield className={`w-5 h-5 flex-shrink-0 ${(isMobile || !isCollapsed) ? 'mr-2' : ''}`} />
              {(isMobile || !isCollapsed) && (
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold capitalize truncate">{user.role} Access</p>
                  <p className="text-[10px] text-avalanche-100 truncate opacity-90">
                    {user.authMethod === 'wallet' ? 'Web3 Connected' : 'Standard Auth'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      {navigationItems.map((item) => (
        <NavItem key={item.href} item={item} />
      ))}
    </nav>
  );
};

export default RoleBasedNavigation;
