import { motion } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';

interface EmptyTicketStateProps {
  onCreateTicket?: () => void;
}

export function EmptyTicketState({ onCreateTicket }: EmptyTicketStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6"
      >
        <Inbox className="w-10 h-10 text-gray-400" />
      </motion.div>

      <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets yet</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">
        Get started by creating your first ticket to track your tasks and projects.
      </p>

      {onCreateTicket && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateTicket}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Your First Ticket
        </motion.button>
      )}
    </motion.div>
  );
}
