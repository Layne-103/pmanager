import { cn } from '../../lib/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-gray-200/50 via-gray-100/50 to-gray-200/50',
        'bg-[length:200%_100%] rounded-xl',
        className
      )}
      style={{
        animation: 'shimmer 2s infinite',
      }}
    />
  );
}
