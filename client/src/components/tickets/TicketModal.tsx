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

  const handleAddTag = (tag: Tag) => {
    // Only update local state, don't call API immediately
    setSelectedTags([...selectedTags, tag]);
  };

  const handleRemoveTag = (tagId: number) => {
    // Only update local state, don't call API immediately
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleSubmit = async (data: CreateTicketRequest) => {
    // Include tag IDs in the submit data
    const submitData = {
      ...data,
      tagIds: selectedTags.map((t) => t.id),
    };

    // For editing, we need to handle tag updates
    if (isEditing && ticket) {
      const originalTagIds = new Set(ticket.tags.map((t) => t.id));
      const newTagIds = new Set(selectedTags.map((t) => t.id));

      // Find tags to add and remove
      const tagsToAdd = selectedTags.filter((t) => !originalTagIds.has(t.id));
      const tagsToRemove = ticket.tags.filter((t) => !newTagIds.has(t.id));

      try {
        // First update the ticket details
        onSubmit(submitData);

        // Then update tags if there are changes
        if (tagsToAdd.length > 0) {
          await addTagMutation.mutateAsync({
            ticketId: ticket.id,
            tagIds: tagsToAdd.map((t) => t.id),
          });
        }

        if (tagsToRemove.length > 0) {
          for (const tag of tagsToRemove) {
            await removeTagMutation.mutateAsync({
              ticketId: ticket.id,
              tagId: tag.id,
            });
          }
        }

        // Show success message if tags were updated
        if (tagsToAdd.length > 0 || tagsToRemove.length > 0) {
          toast.success('Tags updated successfully');
        }
      } catch (error) {
        console.error('Failed to update tags:', error);
        toast.error('Failed to update some tags');
      }
    } else {
      // For new tickets, just submit with tag IDs
      onSubmit(submitData);
    }
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

        <div className="mt-6">
          {/* Ticket Form with Tags inside */}
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
            >
              {/* Tag Management Section - now inside the form */}
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
            </EnhancedTicketForm>
          </motion.div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
