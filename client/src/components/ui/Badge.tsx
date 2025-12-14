import { cn } from '../../lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'primary';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-all',
        'backdrop-blur-xl',
        {
          'bg-gray-100/80 text-gray-700': variant === 'default',
          'bg-green-50/80 text-green-700': variant === 'success',
          'bg-blue-50/80 text-blue-700': variant === 'primary',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
