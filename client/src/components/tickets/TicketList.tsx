import type { Ticket } from '../../types';
import { TicketCard } from './TicketCard';
import { EmptyTicketState } from './EmptyTicketState';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface TicketListProps {
  tickets: Ticket[];
  loading?: boolean;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
  onCreateTicket?: () => void;
}

export function TicketList({
  tickets,
  loading,
  onEdit,
  onDelete,
  onToggleComplete,
  onCreateTicket,
}: TicketListProps) {
  if (loading) {
    return <LoadingSpinner message="Loading tickets..." />;
  }

  if (tickets.length === 0) {
    return <EmptyTicketState onCreateTicket={onCreateTicket} />;
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket, index) => (
        <TicketCard
          key={ticket.id}
          ticket={ticket}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}
