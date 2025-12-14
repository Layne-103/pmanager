import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { TicketForm } from './TicketForm';
import { TagSelector } from './TagSelector';
import { useAddTagsToTicket, useRemoveTagFromTicket } from '../../hooks';
import type { Ticket, CreateTicketRequest, Tag } from '../../types';

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
  const [selectedTags, setSelectedTags] = useState<Tag[]>(ticket?.tags || []);
  
  const addTagMutation = useAddTagsToTicket();
  const removeTagMutation = useRemoveTagFromTicket();

  // Update selected tags when ticket changes
  useEffect(() => {
    setSelectedTags(ticket?.tags || []);
  }, [ticket?.id]); // Only depend on ticket ID to avoid infinite loops

  const handleAddTag = async (tag: Tag) => {
    if (!ticket) {
      // For new tickets, just update local state
      setSelectedTags([...selectedTags, tag]);
      return;
    }

    // For existing tickets, update via API
    try {
      await addTagMutation.mutateAsync({
        ticketId: ticket.id,
        tagIds: [tag.id],
      });
      setSelectedTags([...selectedTags, tag]);
      toast.success(`Tag "${tag.name}" added`);
    } catch (error) {
      console.error('Failed to add tag:', error);
      toast.error('Failed to add tag');
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    if (!ticket) {
      // For new tickets, just update local state
      setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
      return;
    }

    // For existing tickets, update via API
    try {
      await removeTagMutation.mutateAsync({
        ticketId: ticket.id,
        tagId,
      });
      setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
      const removedTag = selectedTags.find((t) => t.id === tagId);
      toast.success(`Tag "${removedTag?.name}" removed`);
    } catch (error) {
      console.error('Failed to remove tag:', error);
      toast.error('Failed to remove tag');
    }
  };

  const handleSubmit = (data: CreateTicketRequest) => {
    // Include tag IDs for new tickets
    const submitData = isEditing
      ? data
      : { ...data, tagIds: selectedTags.map((t) => t.id) };
    
    onSubmit(submitData);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
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

        <div className="mt-6 space-y-6">
          {/* Ticket Form */}
          <TicketForm
            initialValues={ticket ? {
              title: ticket.title,
              description: ticket.description || '',
            } : undefined}
            onSubmit={handleSubmit}
            onCancel={onClose}
            submitLabel={isEditing ? 'Update Ticket' : 'Create Ticket'}
            isSubmitting={isSubmitting}
          />

          {/* Tag Management Section */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
            <TagSelector
              selectedTags={selectedTags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
