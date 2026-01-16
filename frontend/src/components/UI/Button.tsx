import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ComponentType<any>;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  type = 'button',
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:transform active:scale-95";

  const variantClasses = {
    primary: "bg-green-500 hover:bg-green-600 text-white focus:ring-avalanche-500 shadow-sm disabled:bg-gray-400",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500 disabled:bg-gray-100",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-gray-500 disabled:border-gray-200",
    ghost: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500 disabled:text-gray-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500 shadow-sm disabled:bg-gray-400",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500 shadow-sm disabled:bg-gray-400"
  };

  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const isDisabled = disabled || loading;
  const disabledClasses = isDisabled ? "cursor-not-allowed" : "cursor-pointer";

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  const handleClick = (e) => {
    if (isDisabled || !onClick) return;
    onClick(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Generate accessible label
  const accessibleLabel = loading
    ? `${ariaLabel || children} - Loading`
    : ariaLabel;

  return (
    <motion.button
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      className={combinedClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      type={type}
      aria-label={accessibleLabel}
      aria-describedby={ariaDescribedby}
      aria-disabled={isDisabled}
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="sm"
          color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'gray'}
          inline
          aria-label="Loading"
          className="mr-2"
        />
      )}
      {Icon && !loading && <Icon className="w-4 h-4 mr-2" aria-hidden="true" />}
      <span>{children}</span>
    </motion.button>
  );
};

export { Button };
export default Button;
