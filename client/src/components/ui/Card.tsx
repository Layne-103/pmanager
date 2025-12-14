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
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      className={cn(
        'bg-white/90 backdrop-blur-xl rounded-2xl border border-gray-200/60 shadow-lg',
        'transition-all duration-300',
        hover && 'hover:shadow-xl hover:border-gray-300/60',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
