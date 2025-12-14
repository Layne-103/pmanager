import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { TicketForm } from './TicketForm';
import type { Ticket, CreateTicketRequest } from '../../types';

interface TicketModalProps {
  open: boolean;
  onClose: () => void;
  ticket?: Ticket | null;
  onSubmit: (data: CreateTicketRequest) => void;
  isSubmitting?: boolean;
}

export function TicketModal({
  open,
  onClose,
  ticket,
  onSubmit,
  isSubmitting = false,
}: TicketModalProps) {
  const isEditing = !!ticket;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {isEditing ? 'Edit Ticket' : 'Create New Ticket'}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? 'Update the ticket details below'
              : 'Fill in the details to create a new ticket'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <TicketForm
            initialValues={ticket ? {
              title: ticket.title,
              description: ticket.description || '',
            } : undefined}
            onSubmit={onSubmit}
            onCancel={onClose}
            submitLabel={isEditing ? 'Update Ticket' : 'Create Ticket'}
            isSubmitting={isSubmitting}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
