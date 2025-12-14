import { motion } from 'framer-motion';

/**
 * Skeleton loader component for tag cards
 * Displays a placeholder while tag data is loading
 */
export function TagSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
    >
      {/* Color indicator skeleton */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div>
            <div className="h-5 bg-gray-200 rounded-lg w-24 mb-1.5 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
          </div>
        </div>
        <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="pt-3 border-t border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </motion.div>
  );
}

/**
 * Grid of multiple tag skeleton loaders
 */
export function TagSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <TagSkeleton key={i} />
      ))}
    </div>
  );
}
