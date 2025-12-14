import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function Card({ children, className, hover = true, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hover ? { y: -2 } : undefined}
      className={cn(
        'bg-white rounded-xl border border-gray-200',
        'transition-all duration-200',
        hover && 'hover:shadow-lg hover:border-gray-300',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
