import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Container } from '../components/layout';
import { 
  TicketModal, 
  TicketTable,
  CombinedToolbar
} from '../components/tickets';
import { ConfirmDialog, FloatingActionButton } from '../components/common';
import { 
  useTickets, 
  useCreateTicket, 
  useUpdateTicket, 
  useDeleteTicket, 
  useToggleComplete,
  useBatchUpdateStatus,
  useBatchDeleteTickets 
} from '../hooks';
import type { Ticket, CreateTicketRequest } from '../types';

export function TicketsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deletingTicketId, setDeletingTicketId] = useState<number | null>(null);
  
  // Batch operations state
  const [selectedTickets, setSelectedTickets] = useState<Set<number>>(new Set());
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);

  const { data: tickets, isLoading, error } = useTickets({
    search: search || undefined,
    status,
    tags: selectedTags || undefined,
  });

  // Sort tickets by creation time
  const sortedTickets = useMemo(() => {
    if (!tickets) return [];
    
    const sorted = [...tickets].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    
    return sorted;
  }, [tickets, sortOrder]);

  const createMutation = useCreateTicket();
  const updateMutation = useUpdateTicket();
  const deleteMutation = useDeleteTicket();
  const toggleMutation = useToggleComplete();
  const batchUpdateStatusMutation = useBatchUpdateStatus();
  const batchDeleteMutation = useBatchDeleteTickets();

  const handleCreate = async (data: CreateTicketRequest) => {
    try {
      const newTicket = await createMutation.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Ticket created successfully', {
        description: `"${data.title}" has been added to your tickets`,
        duration: 4000,
      });
      console.log('Created ticket:', newTicket);
    } catch (error) {
      console.error('Create error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to create ticket', {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  const handleEdit = (ticket: Ticket) => {
    console.log('Editing ticket:', ticket);
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleUpdate = async (data: CreateTicketRequest) => {
    if (!editingTicket) {
      console.error('No ticket being edited');
      return;
    }

    try {
      console.log('Updating ticket:', editingTicket.id, data);
      await updateMutation.mutateAsync({ id: editingTicket.id, data });
      setIsModalOpen(false);
      setEditingTicket(null);
      toast.success('Ticket updated successfully', {
        description: `"${data.title}" has been updated`,
        duration: 4000,
      });
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update ticket', {
        description: errorMessage,
        duration: 5000,
      });
    }
  };

  const handleDelete = async () => {
    if (!deletingTicketId) {
      console.error('No ticket to delete');
      return;
    }

    try {
      console.log('Deleting ticket:', deletingTicketId);
      await deleteMutation.mutateAsync(deletingTicketId);
      setDeletingTicketId(null);
      toast.success('Ticket deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete ticket');
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await toggleMutation.mutateAsync(id);
      toast.success('Ticket status updated');
    } catch (error) {
      console.error('Toggle error:', error);
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

  // Batch operations handlers
  const handleSelectTicket = (id: number, selected: boolean) => {
    setSelectedTickets(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && sortedTickets && sortedTickets.length > 0) {
      const allIds = new Set(sortedTickets.map(ticket => ticket.id));
      setSelectedTickets(allIds);
      toast.success(`Selected all ${sortedTickets.length} tickets`);
    } else {
      setSelectedTickets(new Set());
      toast.info('Selection cleared');
    }
  };

  const handleDeselectAll = () => {
    setSelectedTickets(new Set());
    toast.info('Selection cleared');
  };

  const handleSelectCompleted = () => {
    if (sortedTickets) {
      const completedIds = new Set(
        sortedTickets.filter(t => t.isCompleted).map(t => t.id)
      );
      setSelectedTickets(completedIds);
      toast.success(`Selected ${completedIds.size} completed tickets`);
    }
  };

  const handleSelectIncomplete = () => {
    if (sortedTickets) {
      const incompleteIds = new Set(
        sortedTickets.filter(t => !t.isCompleted).map(t => t.id)
      );
      setSelectedTickets(incompleteIds);
      toast.success(`Selected ${incompleteIds.size} incomplete tickets`);
    }
  };

  const handleInvertSelection = () => {
    if (sortedTickets) {
      const allIds = sortedTickets.map(t => t.id);
      const newSelection = new Set(
        allIds.filter(id => !selectedTickets.has(id))
      );
      setSelectedTickets(newSelection);
      toast.info(`Inverted selection: ${newSelection.size} tickets`);
    }
  };

  const handleBatchMarkComplete = async () => {
    const ticketIds = Array.from(selectedTickets);
    try {
      const result = await batchUpdateStatusMutation.mutateAsync({ 
        ticketIds, 
        isCompleted: true 
      });
      toast.success(result.message);
      setSelectedTickets(new Set());
    } catch (error) {
      console.error('Batch complete error:', error);
      toast.error('Failed to mark tickets as complete');
    }
  };

  const handleBatchMarkIncomplete = async () => {
    const ticketIds = Array.from(selectedTickets);
    try {
      const result = await batchUpdateStatusMutation.mutateAsync({ 
        ticketIds, 
        isCompleted: false 
      });
      toast.success(result.message);
      setSelectedTickets(new Set());
    } catch (error) {
      console.error('Batch reopen error:', error);
      toast.error('Failed to mark tickets as incomplete');
    }
  };

  const handleBatchDeleteConfirm = async () => {
    const ticketIds = Array.from(selectedTickets);
    try {
      const result = await batchDeleteMutation.mutateAsync(ticketIds);
      toast.success(result.message);
      setSelectedTickets(new Set());
      setShowBatchDeleteConfirm(false);
    } catch (error) {
      console.error('Batch delete error:', error);
      toast.error('Failed to delete tickets');
    }
  };

  const handleCancelSelection = () => {
    setSelectedTickets(new Set());
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle if not typing in an input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isModalOpen
      ) {
        return;
      }

      // Ctrl/Cmd + A: Select all
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        if (sortedTickets && sortedTickets.length > 0) {
          handleSelectAll();
        }
      }

      // Escape: Clear selection
      if (e.key === 'Escape' && selectedTickets.size > 0) {
        e.preventDefault();
        handleCancelSelection();
      }

      // Ctrl/Cmd + I: Invert selection
      if ((e.ctrlKey || e.metaKey) && e.key === 'i' && selectedTickets.size > 0) {
        e.preventDefault();
        handleInvertSelection();
      }

      // Delete: Batch delete (with confirmation)
      if (e.key === 'Delete' && selectedTickets.size > 0) {
        e.preventDefault();
        setShowBatchDeleteConfirm(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sortedTickets, selectedTickets, isModalOpen]);

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
            {isLoading ? 'Loading...' : `${sortedTickets?.length || 0} total tickets`}
          </p>
        </motion.div>

        {/* Combined Toolbar: Filters + Batch Actions */}
        {!isLoading && (
          <CombinedToolbar
            search={search}
            status={status}
            selectedTags={selectedTags}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            onTagsChange={setSelectedTags}
            totalCount={sortedTickets?.length || 0}
            selectedCount={selectedTickets.size}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onSelectCompleted={handleSelectCompleted}
            onSelectIncomplete={handleSelectIncomplete}
            onInvertSelection={handleInvertSelection}
            onBatchMarkComplete={handleBatchMarkComplete}
            onBatchMarkIncomplete={handleBatchMarkIncomplete}
            onBatchDelete={() => setShowBatchDeleteConfirm(true)}
          />
        )}

        {/* Tickets Table */}
        <TicketTable
          tickets={sortedTickets || []}
          loading={isLoading}
          sortOrder={sortOrder}
          selectedTickets={selectedTickets}
          onSortChange={setSortOrder}
          onSelect={handleSelectTicket}
          onSelectAll={handleSelectAll}
          onEdit={handleEdit}
          onDelete={setDeletingTicketId}
          onCreateTicket={handleOpenModal}
        />

        {/* Floating Action Button */}
        {!isLoading && (
          <FloatingActionButton onClick={handleOpenModal} label="New Ticket" />
        )}

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
          cancelLabel="Cancel"
          variant="destructive"
        />

        {/* Batch Delete Confirmation Dialog */}
        <ConfirmDialog
          open={showBatchDeleteConfirm}
          onClose={() => setShowBatchDeleteConfirm(false)}
          onConfirm={handleBatchDeleteConfirm}
          title="Delete Multiple Tickets"
          description={`Are you sure you want to delete ${selectedTickets.size} ticket(s)? This action cannot be undone.`}
          confirmLabel="Delete All"
          cancelLabel="Cancel"
          variant="destructive"
        />
      </div>
    </Container>
  );
}
