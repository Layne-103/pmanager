import { motion } from 'framer-motion';
import { CheckSquare, Square, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

interface SelectionToolbarProps {
  totalCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectCompleted: () => void;
  onSelectIncomplete: () => void;
  onInvertSelection: () => void;
}

export function SelectionToolbar({
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onSelectCompleted,
  onSelectIncomplete,
  onInvertSelection,
}: SelectionToolbarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-white rounded-[16px] p-4 mb-4',
        'border border-gray-200',
        'shadow-sm'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {selectedCount > 0 ? (
              <>
                <span className="text-blue-600">{selectedCount}</span> of {totalCount} selected
              </>
            ) : (
              <>{totalCount} tickets</>
            )}
          </span>
        </div>

        {/* Selection Actions */}
        <div className="flex items-center gap-2">
          {/* Select All / Deselect All */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium',
              'flex items-center gap-2',
              'transition-all duration-200',
              allSelected || someSelected
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            )}
            title={allSelected ? 'Deselect all' : 'Select all'}
          >
            {allSelected ? (
              <>
                <CheckSquare className="w-4 h-4" strokeWidth={2.5} />
                Deselect All
              </>
            ) : (
              <>
                <Square className="w-4 h-4" strokeWidth={2} />
                Select All
              </>
            )}
          </motion.button>

          {/* Select Completed */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelectCompleted}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium',
              'flex items-center gap-2',
              'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700',
              'transition-all duration-200'
            )}
            title="Select completed tickets"
          >
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">Completed</span>
          </motion.button>

          {/* Select Incomplete */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSelectIncomplete}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium',
              'flex items-center gap-2',
              'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700',
              'transition-all duration-200'
            )}
            title="Select incomplete tickets"
          >
            <XCircle className="w-4 h-4" strokeWidth={2} />
            <span className="hidden sm:inline">Incomplete</span>
          </motion.button>

          {/* Invert Selection */}
          {selectedCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onInvertSelection}
              className={cn(
                'px-3 py-2 rounded-lg text-sm font-medium',
                'flex items-center gap-2',
                'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700',
                'transition-all duration-200'
              )}
              title="Invert selection"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline">Invert</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
