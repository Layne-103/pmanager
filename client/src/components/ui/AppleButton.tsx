import { motion, type MotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface AppleButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-blue-500 text-white',
    'hover:bg-blue-600',
    'active:bg-blue-700',
    'disabled:bg-gray-100 disabled:text-gray-400',
    'shadow-[0_1px_2px_rgba(0,122,255,0.15)]',
    'hover:shadow-[0_4px_8px_rgba(0,122,255,0.2)]'
  ),
  secondary: cn(
    'bg-white text-gray-900 border border-gray-200',
    'hover:bg-gray-50 hover:border-gray-300',
    'active:bg-gray-100',
    'disabled:bg-gray-50 disabled:text-gray-400'
  ),
  ghost: cn(
    'bg-transparent text-gray-700',
    'hover:bg-gray-100',
    'active:bg-gray-200',
    'disabled:text-gray-400'
  ),
  danger: cn(
    'bg-red-500 text-white',
    'hover:bg-red-600',
    'active:bg-red-700',
    'disabled:bg-gray-100 disabled:text-gray-400',
    'shadow-[0_1px_2px_rgba(255,59,48,0.15)]',
    'hover:shadow-[0_4px_8px_rgba(255,59,48,0.2)]'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-[13px] h-8',
  md: 'px-4 py-2 text-[15px] h-10',
  lg: 'px-6 py-3 text-[17px] h-12',
};

export function AppleButton({
  variant = 'primary',
  size = 'md',
  children,
  className,
  fullWidth = false,
  isLoading = false,
  disabled,
  onClick,
  type = 'button',
  ...props
}: AppleButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-semibold tracking-[-0.022em]',
        'rounded-[12px]',
        'transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:cursor-not-allowed',
        // Variant styles
        variantStyles[variant],
        // Size styles
        sizeStyles[size],
        // Full width
        fullWidth && 'w-full',
        // Custom className
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
