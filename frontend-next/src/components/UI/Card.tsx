import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  ...props
}) => {
  const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200";
  const hoverClasses = hover ? "hover:shadow-md transition-shadow duration-200" : "";
  const clickableClasses = onClick ? "cursor-pointer" : "";

  const combinedClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <motion.div
      whileHover={onClick && hover ? { y: -2 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      className={combinedClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export { Card };
export default Card;
