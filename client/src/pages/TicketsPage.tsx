import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Container } from '../components/layout';
import { FilterPanel, TicketList, TicketModal } from '../components/tickets';
import { ConfirmDialog, FloatingActionButton } from '../components/common';
import { useTickets, useCreateTicket, useUpdateTicket, useDeleteTicket, useToggleComplete } from '../hooks';
import type { Ticket, CreateTicketRequest } from '../types';

export function TicketsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string>('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<number | null>(null);

  const { data: tickets, isLoading, error } = useTickets({
    search: search || undefined,
    status,
    tags: selectedTags || undefined,
  });

  const createMutation = useCreateTicket();
  const updateMutation = useUpdateTicket();
  const deleteMutation = useDeleteTicket();
  const toggleMutation = useToggleComplete();

  const handleCreate = async (data: CreateTicketRequest) => {
    try {
      await createMutation.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Ticket created successfully');
    } catch (error) {
      toast.error('Failed to create ticket');
    }
  };

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data: CreateTicketRequest) => {
    if (!editingTicket) return;
    
    try {
      await updateMutation.mutateAsync({ id: editingTicket.id, data });
      setIsModalOpen(false);
      setEditingTicket(null);
      toast.success('Ticket updated successfully');
    } catch (error) {
      toast.error('Failed to update ticket');
    }
  };

  const handleDelete = async () => {
    if (!deletingTicketId) return;
    
    try {
      await deleteMutation.mutateAsync(deletingTicketId);
      setDeletingTicketId(null);
      toast.success('Ticket deleted successfully');
    } catch (error) {
      toast.error('Failed to delete ticket');
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast.success('Ticket status updated');
    } catch (error) {
      toast.error('Failed to update ticket status');
    }
  };

  const handleOpenModal = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTicket(null);
  };

  if (error) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 rounded-xl p-6 border border-red-200"
        >
          <p className="text-red-800">Error loading tickets: {(error as Error).message}</p>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-5">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center pt-4 pb-1"
        >
          <h1 className="text-3xl font-bold mb-1 text-gray-900">
            Tickets
          </h1>
          <p className="text-sm text-gray-600">
            {isLoading ? 'Loading...' : `${tickets?.length || 0} total tickets`}
          </p>
        </motion.div>

        {/* Filters */}
        <FilterPanel
          search={search}
          status={status}
          selectedTags={selectedTags}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onTagsChange={setSelectedTags}
        />

        {/* Tickets List */}
        <TicketList
          tickets={tickets || []}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={setDeletingTicketId}
          onToggleComplete={handleToggleComplete}
          onCreateTicket={handleOpenModal}
        />

        {/* Floating Action Button */}
        <FloatingActionButton onClick={handleOpenModal} label="New Ticket" />

        {/* Create/Edit Modal */}
        <TicketModal
          open={isModalOpen}
          onClose={handleCloseModal}
          ticket={editingTicket}
          onSubmit={editingTicket ? handleUpdate : handleCreate}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={!!deletingTicketId}
          onClose={() => setDeletingTicketId(null)}
          onConfirm={handleDelete}
          title="Delete Ticket"
          description="Are you sure you want to delete this ticket? This action cannot be undone."
          confirmLabel="Delete"
          variant="destructive"
        />
      </div>
    </Container>
  );
}
