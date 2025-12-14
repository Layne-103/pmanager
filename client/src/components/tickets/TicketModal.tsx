import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Ticket as TicketIcon, Tag as TagIconLucide } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { EnhancedTicketForm } from './EnhancedTicketForm';
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
    console.log('handleAddTag called with tag:', tag);
    console.log('Current ticket:', ticket);
    console.log('Current selectedTags:', selectedTags);

    if (!ticket) {
      // For new tickets, just update local state
      console.log('New ticket: updating local state');
      setSelectedTags([...selectedTags, tag]);
      return;
    }

    // For existing tickets, update via API
    try {
      console.log('Making API call to add tag:', {
        ticketId: ticket.id,
        tagIds: [tag.id],
      });

      const result = await addTagMutation.mutateAsync({
        ticketId: ticket.id,
        tagIds: [tag.id],
      });

      console.log('API call successful, result:', result);
      setSelectedTags([...selectedTags, tag]);
      toast.success(`Tag "${tag.name}" added`);
    } catch (error) {
      console.error('Failed to add tag:', error);
      console.error('Error details:', error);
      toast.error(`Failed to add tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader className="space-y-3 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isEditing ? 'bg-blue-100' : 'bg-green-100'
              }`}
            >
              <TicketIcon className={`w-5 h-5 ${isEditing ? 'text-blue-600' : 'text-green-600'}`} />
            </motion.div>
            <div>
              <SheetTitle className="text-xl">
                {isEditing ? 'Edit Ticket' : 'Create New Ticket'}
              </SheetTitle>
              <SheetDescription className="text-sm">
                {isEditing
                  ? 'Update the ticket details and tags below'
                  : 'Fill in the details to create a new ticket'}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Ticket Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <EnhancedTicketForm
              initialValues={ticket ? {
                title: ticket.title,
                description: ticket.description || '',
              } : undefined}
              onSubmit={handleSubmit}
              onCancel={onClose}
              submitLabel={isEditing ? 'Update Ticket' : 'Create Ticket'}
              isSubmitting={isSubmitting}
            />
          </motion.div>

          {/* Tag Management Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-6 border-t border-gray-200"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <TagIconLucide className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Tags</h3>
                <p className="text-xs text-gray-500">
                  {isEditing
                    ? 'Manage tags for this ticket'
                    : 'Add tags to organize your ticket (optional)'}
                </p>
              </div>
            </div>
            <TagSelector
              selectedTags={selectedTags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
              disabled={isSubmitting}
            />
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
