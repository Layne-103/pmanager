import { motion } from 'framer-motion';
import { CheckSquare, Square, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/cn';
import { BatchActionsDropdown } from './BatchActionsDropdown';
import { FilterPanel } from './FilterPanel';

interface CombinedToolbarProps {
  // Filter props
  search: string;
  status: string;
  selectedTags: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTagsChange: (value: string) => void;
  
  // Batch actions props
  totalCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectCompleted: () => void;
  onSelectIncomplete: () => void;
  onInvertSelection: () => void;
  onBatchMarkComplete: () => void;
  onBatchMarkIncomplete: () => void;
  onBatchDelete: () => void;
}

export function CombinedToolbar({
  search,
  status,
  selectedTags,
  onSearchChange,
  onStatusChange,
  onTagsChange,
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onSelectCompleted,
  onSelectIncomplete,
  onInvertSelection,
  onBatchMarkComplete,
  onBatchMarkIncomplete,
  onBatchDelete,
}: CombinedToolbarProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl px-5 py-4 border border-gray-200 shadow-sm space-y-4"
    >
      {/* Top Row: Filters */}
      <FilterPanel
        search={search}
        status={status}
        selectedTags={selectedTags}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onTagsChange={onTagsChange}
      />

      {/* Bottom Row: Batch Actions */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-200">
        {/* Left: Batch Actions Dropdown */}
        <div className="flex items-center gap-3">
          <BatchActionsDropdown
            selectedCount={selectedCount}
            onMarkComplete={onBatchMarkComplete}
            onMarkIncomplete={onBatchMarkIncomplete}
            onDelete={onBatchDelete}
          />
          {selectedCount > 0 && (
            <span className="text-sm text-gray-500">
              <span className="text-blue-600 font-medium">{selectedCount}</span> / {totalCount} selected
            </span>
          )}
        </div>

        {/* Right: Selection Buttons */}
        <div className="flex items-center gap-2">
          {/* Select Completed */}
          <button
            onClick={onSelectCompleted}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              'flex items-center gap-2',
              'bg-gray-50 text-gray-600 border border-gray-200',
              'hover:bg-green-50 hover:text-green-600 hover:border-green-200',
              'transition-all duration-200'
            )}
            title="Select completed tickets"
          >
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            <span>Completed</span>
          </button>

          {/* Select Incomplete */}
          <button
            onClick={onSelectIncomplete}
            className={cn(
              'px-3 py-1.5 rounded-lg text-sm font-medium',
              'flex items-center gap-2',
              'bg-gray-50 text-gray-600 border border-gray-200',
              'hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200',
              'transition-all duration-200'
            )}
            title="Select incomplete tickets"
          >
            <XCircle className="w-4 h-4" strokeWidth={2} />
            <span>Incomplete</span>
          </button>

          {/* Invert Selection */}
          {selectedCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onInvertSelection}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium',
                'flex items-center gap-2',
                'bg-gray-50 text-gray-600 border border-gray-200',
                'hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200',
                'transition-all duration-200'
              )}
              title="Invert selection"
            >
              <RotateCcw className="w-4 h-4" strokeWidth={2} />
              <span>Invert</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
