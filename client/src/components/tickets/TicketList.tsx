import type { Ticket } from '../../types';
import { AppleTicketCard } from './AppleTicketCard';
import { EmptyTicketState } from './EmptyTicketState';
import { TicketSkeletonGrid } from '../common/TicketSkeleton';

interface TicketListProps {
  tickets: Ticket[];
  loading?: boolean;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
  onCreateTicket?: () => void;
  selectedTickets?: Set<number>;
  onSelect?: (id: number, selected: boolean) => void;
}

export function TicketList({
  tickets,
  loading,
  onEdit,
  onDelete,
  onToggleComplete,
  onCreateTicket,
  selectedTickets = new Set(),
  onSelect = () => {}, // Provide default no-op function
}: TicketListProps) {
  if (loading) {
    return <TicketSkeletonGrid count={6} />;
  }

  if (tickets.length === 0) {
    return <EmptyTicketState onCreateTicket={onCreateTicket} />;
  }

  return (
    <div className="space-y-4">
      {tickets.map((ticket, index) => (
        <AppleTicketCard
          key={ticket.id}
          ticket={ticket}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
          selected={selectedTickets.has(ticket.id)}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
