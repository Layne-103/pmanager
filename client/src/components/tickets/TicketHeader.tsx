import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../../lib/cn';

interface TicketHeaderProps {
  totalCount: number;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
}

export function TicketHeader({
  totalCount,
  sortOrder,
  onSortChange,
}: TicketHeaderProps) {
  const toggleSort = () => {
    onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm"
    >
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <h2 className="text-base font-semibold text-gray-900">
          Batch Operations
        </h2>

        {/* Right: Sort Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSort}
          className={cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium',
            'flex items-center gap-2',
            'bg-gray-50 text-gray-700 hover:bg-gray-100',
            'transition-all duration-200',
            'border border-gray-200'
          )}
          title={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
        >
          {sortOrder === 'newest' ? (
            <>
              <ArrowDown className="w-4 h-4" strokeWidth={2} />
              <span>Date ↓</span>
            </>
          ) : (
            <>
              <ArrowUp className="w-4 h-4" strokeWidth={2} />
              <span>Date ↑</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
