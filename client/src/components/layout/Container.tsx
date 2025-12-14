import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  return (
    <div className={cn('max-w-7xl mx-auto px-6 lg:px-8 py-12', className)}>
      {children}
    </div>
  );
}
