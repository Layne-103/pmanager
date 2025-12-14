import { motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
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
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
          <Inbox className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tickets found</h3>
        <p className="text-gray-500 text-center max-w-md">
          Try adjusting your filters or create a new ticket to get started
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {tickets.map((ticket, index) => (
        <TicketCard key={ticket.id} ticket={ticket} index={index} />
      ))}
    </div>
  );
}
