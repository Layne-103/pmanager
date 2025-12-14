import { motion } from 'framer-motion';

/**
 * Skeleton loader component for ticket cards
 * Displays a placeholder while ticket data is loading
 */
export function TicketSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
    >
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded-lg w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-1/2 animate-pulse" />
        </div>
        <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse ml-2" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-4/6 animate-pulse" />
      </div>

      {/* Footer skeleton */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
          <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </motion.div>
  );
}

/**
 * Grid of multiple skeleton loaders
 */
export function TicketSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TicketSkeleton key={i} />
      ))}
    </div>
  );
}
