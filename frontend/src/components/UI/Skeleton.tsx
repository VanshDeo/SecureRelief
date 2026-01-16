import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton screen components for loading states
 */
export const SkeletonCard = ({ className = '', animated = true }) => {
  const baseClasses = "bg-gray-200 dark:bg-gray-700 rounded";
  
  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      {...(animated && {
        animate: { opacity: [0.5, 1, 0.5] },
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
      })}
      aria-hidden="true"
    />
  );
};

export const SkeletonText = ({ 
  lines = 1, 
  className = '', 
  animated = true,
  width = 'full' 
}) => {
  const widthClasses = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/4': 'w-1/4'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonCard
          key={index}
          className={`h-4 ${widthClasses[width]} ${
            index === lines - 1 && lines > 1 ? 'w-3/4' : ''
          }`}
          animated={animated}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ size = 'md', className = '', animated = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <SkeletonCard
      className={`${sizeClasses[size]} rounded-full ${className}`}
      animated={animated}
    />
  );
};

export const SkeletonButton = ({ className = '', animated = true }) => {
  return (
    <SkeletonCard
      className={`h-10 w-24 rounded-md ${className}`}
      animated={animated}
    />
  );
};

export const SkeletonTable = ({ 
  rows = 3, 
  columns = 4, 
  className = '', 
  animated = true 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <SkeletonCard
            key={`header-${index}`}
            className="h-4 w-3/4"
            animated={animated}
          />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={`row-${rowIndex}`}
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonCard
              key={`cell-${rowIndex}-${colIndex}`}
              className="h-4"
              animated={animated}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const SkeletonDashboard = ({ className = '', animated = true }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <SkeletonCard className="h-8 w-48" animated={animated} />
          <SkeletonCard className="h-4 w-32" animated={animated} />
        </div>
        <SkeletonButton animated={animated} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <SkeletonCard className="h-4 w-16 mb-2" animated={animated} />
            <SkeletonCard className="h-8 w-20" animated={animated} />
          </div>
        ))}
      </div>

      {/* Chart section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <SkeletonCard className="h-6 w-32 mb-4" animated={animated} />
        <SkeletonCard className="h-64 w-full" animated={animated} />
      </div>

      {/* Table section */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <SkeletonCard className="h-6 w-40 mb-4" animated={animated} />
        <SkeletonTable rows={5} columns={5} animated={animated} />
      </div>
    </div>
  );
};

export default {
  Card: SkeletonCard,
  Text: SkeletonText,
  Avatar: SkeletonAvatar,
  Button: SkeletonButton,
  Table: SkeletonTable,
  Dashboard: SkeletonDashboard
};
