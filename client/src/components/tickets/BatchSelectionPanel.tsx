import { motion } from 'framer-motion';
import { CheckSquare, Square, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/cn';

interface BatchSelectionPanelProps {
  totalCount: number;
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectCompleted: () => void;
  onSelectIncomplete: () => void;
  onInvertSelection: () => void;
}

export function BatchSelectionPanel({
  totalCount,
  selectedCount,
  onSelectAll,
  onDeselectAll,
  onSelectCompleted,
  onSelectIncomplete,
  onInvertSelection,
}: BatchSelectionPanelProps) {
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white rounded-xl px-4 py-3 border border-gray-200 shadow-sm"
    >
      {/* Selection Info */}
      <div className="mb-3">
        <span className="text-sm font-medium text-gray-700">
          {selectedCount > 0 ? (
            <>
              已选择 <span className="text-blue-600">{selectedCount}</span> / {totalCount}
            </>
          ) : (
            <>共 {totalCount} 条记录</>
          )}
        </span>
      </div>

      {/* Selection Actions - Grid Layout */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {/* Select All / Deselect All */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium',
            'flex items-center justify-center gap-2',
            'transition-all duration-200',
            allSelected
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
          )}
          title={allSelected ? '取消全选' : '全选'}
        >
          {allSelected ? (
            <>
              <CheckSquare className="w-4 h-4" strokeWidth={2.5} />
              取消全选
            </>
          ) : (
            <>
              <Square className="w-4 h-4" strokeWidth={2} />
              全选
            </>
          )}
        </motion.button>

        {/* Select Completed */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectCompleted}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium',
            'flex items-center justify-center gap-2',
            'bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700',
            'transition-all duration-200',
            'border border-gray-200'
          )}
          title="选择已完成"
        >
          <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
          已完成
        </motion.button>

        {/* Select Incomplete */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSelectIncomplete}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium',
            'flex items-center justify-center gap-2',
            'bg-gray-50 text-gray-700 hover:bg-orange-50 hover:text-orange-700',
            'transition-all duration-200',
            'border border-gray-200'
          )}
          title="选择未完成"
        >
          <XCircle className="w-4 h-4" strokeWidth={2} />
          未完成
        </motion.button>

        {/* Invert Selection */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onInvertSelection}
          disabled={selectedCount === 0}
          className={cn(
            'px-3 py-2 rounded-lg text-sm font-medium',
            'flex items-center justify-center gap-2',
            'transition-all duration-200',
            'border border-gray-200',
            selectedCount > 0
              ? 'bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
          )}
          title="反选"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2} />
          反选
        </motion.button>

        {/* Clear Selection */}
        {selectedCount > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onDeselectAll}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium',
              'flex items-center justify-center gap-2',
              'bg-gray-50 text-gray-700 hover:bg-red-50 hover:text-red-700',
              'transition-all duration-200',
              'border border-gray-200'
            )}
            title="清空选择"
          >
            <XCircle className="w-4 h-4" strokeWidth={2} />
            清空
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
