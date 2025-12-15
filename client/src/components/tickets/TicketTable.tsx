import { motion } from 'framer-motion';
import { TicketTableHeader } from './TicketTableHeader';
import { TicketTableRow } from './TicketTableRow';
import { LoadingSkeleton } from './LoadingSkeleton';
import { EmptyTicketState } from './EmptyTicketState';
import type { Ticket } from '../../types';

interface TicketTableProps {
  tickets: Ticket[];
  loading: boolean;
  sortOrder: 'newest' | 'oldest';
  selectedTickets: Set<number>;
  onSortChange: (order: 'newest' | 'oldest') => void;
  onSelect: (id: number, selected: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onCreateTicket: () => void;
}

export function TicketTable({
  tickets,
  loading,
  sortOrder,
  selectedTickets,
  onSortChange,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onCreateTicket,
}: TicketTableProps) {
  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!tickets || tickets.length === 0) {
    return <EmptyTicketState onCreate={onCreateTicket} />;
  }

  const allSelected = tickets.length > 0 && selectedTickets.size === tickets.length;
  const someSelected = selectedTickets.size > 0 && selectedTickets.size < tickets.length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Table Header */}
      <TicketTableHeader
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        allSelected={allSelected}
        onSelectAll={onSelectAll}
        someSelected={someSelected}
      />

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {tickets.map((ticket, index) => (
          <TicketTableRow
            key={ticket.id}
            ticket={ticket}
            index={index}
            selected={selectedTickets.has(ticket.id)}
            onSelect={onSelect}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </motion.div>
  );
}
