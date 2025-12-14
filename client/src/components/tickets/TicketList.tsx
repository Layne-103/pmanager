import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import type { Ticket } from '../../types';
import { TicketCard } from './TicketCard';

interface TicketListProps {
  tickets: Ticket[];
}

export function TicketList({ tickets }: TicketListProps) {
  if (tickets.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-16 text-center border border-white/20"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6"
        >
          <FileText className="w-10 h-10 text-gray-400" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No tickets found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          Try adjusting your filters or create a new ticket to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => (
        <TicketCard key={ticket.id} ticket={ticket} index={index} />
      ))}
    </div>
  );
}
