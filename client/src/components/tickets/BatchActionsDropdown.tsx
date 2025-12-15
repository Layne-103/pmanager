import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface BatchActionsDropdownProps {
  selectedCount: number;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onDelete: () => void;
  disabled?: boolean;
}

export function BatchActionsDropdown({
  selectedCount,
  onMarkComplete,
  onMarkIncomplete,
  onDelete,
  disabled = false,
}: BatchActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || selectedCount === 0}
        className={cn(
          'px-4 py-2 rounded-lg text-sm font-medium',
          'flex items-center gap-2',
          'border transition-all duration-200',
          disabled || selectedCount === 0
            ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed'
            : selectedCount > 0
            ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
        )}
      >
        <span>Batch Actions</span>
        <ChevronDown 
          className={cn(
            'w-4 h-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )} 
          strokeWidth={2} 
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && selectedCount > 0 && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute top-full left-0 mt-2 z-50',
                'min-w-[200px]',
                'bg-white rounded-lg border border-gray-200',
                'shadow-lg overflow-hidden'
              )}
            >
              {/* Menu Header */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-500">
                  {selectedCount} ticket{selectedCount > 1 ? 's' : ''} selected
                </span>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {/* Mark as Complete */}
                <button
                  onClick={() => handleAction(onMarkComplete)}
                  className={cn(
                    'w-full px-4 py-2.5 flex items-center gap-3',
                    'text-sm font-medium text-left',
                    'text-gray-700 hover:bg-green-50 hover:text-green-700',
                    'transition-colors duration-150'
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
                  <span>Mark as Complete</span>
                </button>

                {/* Mark as Incomplete */}
                <button
                  onClick={() => handleAction(onMarkIncomplete)}
                  className={cn(
                    'w-full px-4 py-2.5 flex items-center gap-3',
                    'text-sm font-medium text-left',
                    'text-gray-700 hover:bg-orange-50 hover:text-orange-700',
                    'transition-colors duration-150'
                  )}
                >
                  <XCircle className="w-4 h-4" strokeWidth={2} />
                  <span>Mark as Incomplete</span>
                </button>

                {/* Divider */}
                <div className="my-1 border-t border-gray-200" />

                {/* Delete */}
                <button
                  onClick={() => handleAction(onDelete)}
                  className={cn(
                    'w-full px-4 py-2.5 flex items-center gap-3',
                    'text-sm font-medium text-left',
                    'text-red-600 hover:bg-red-50',
                    'transition-colors duration-150'
                  )}
                >
                  <Trash2 className="w-4 h-4" strokeWidth={2} />
                  <span>Delete Selected</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
