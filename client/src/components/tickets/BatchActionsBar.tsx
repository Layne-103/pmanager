import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, Trash2, XCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

interface BatchActionsBarProps {
  selectedCount: number;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onDelete: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BatchActionsBar({
  selectedCount,
  onMarkComplete,
  onMarkIncomplete,
  onDelete,
  onCancel,
  isLoading = false,
}: BatchActionsBarProps) {
  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={cn(
              'bg-white rounded-[16px] shadow-2xl',
              'border border-gray-200',
              'px-6 py-4',
              'flex items-center gap-4',
              'backdrop-blur-xl bg-white/95'
            )}
          >
            {/* Selected Count */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                {selectedCount}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {selectedCount === 1 ? 'ticket selected' : 'tickets selected'}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200" />

            {/* Actions */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMarkComplete}
                disabled={isLoading}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'bg-green-50 hover:bg-green-100',
                  'text-green-700 hover:text-green-800',
                  'text-sm font-medium',
                  'flex items-center gap-2',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="Mark as complete"
              >
                <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                Complete
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMarkIncomplete}
                disabled={isLoading}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'bg-orange-50 hover:bg-orange-100',
                  'text-orange-700 hover:text-orange-800',
                  'text-sm font-medium',
                  'flex items-center gap-2',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="Mark as incomplete"
              >
                <XCircle className="w-4 h-4" strokeWidth={2.5} />
                Reopen
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onDelete}
                disabled={isLoading}
                className={cn(
                  'px-4 py-2 rounded-lg',
                  'bg-red-50 hover:bg-red-100',
                  'text-red-700 hover:text-red-800',
                  'text-sm font-medium',
                  'flex items-center gap-2',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                title="Delete selected"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                Delete
              </motion.button>
            </div>

            {/* Divider */}
            <div className="w-px h-8 bg-gray-200" />

            {/* Cancel Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancel}
              disabled={isLoading}
              className={cn(
                'p-2 rounded-lg',
                'text-gray-600 hover:text-gray-800',
                'hover:bg-gray-100',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              title="Cancel selection"
            >
              <X className="w-5 h-5" strokeWidth={2} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
