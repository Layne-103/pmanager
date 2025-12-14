import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../services/ticketService';
import type { CreateTicketRequest, UpdateTicketRequest } from '../types/ticket';

/**
 * Hook to fetch tickets with optional filters
 */
export function useTickets(filters?: {
  search?: string;
  tags?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => ticketService.getAll(filters),
  });
}

/**
 * Hook to fetch a single ticket by ID
 */
export function useTicket(id: number) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => ticketService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new ticket
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticket: CreateTicketRequest) => ticketService.create(ticket),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * Hook to update a ticket
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTicketRequest }) =>
      ticketService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * Hook to delete a ticket
 */
export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ticketService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * Hook to toggle ticket completion status
 */
export function useToggleComplete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ticketService.toggleComplete(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', id] });
    },
  });
}

// Keep old name for backward compatibility
export const useToggleTicketComplete = useToggleComplete;

/**
 * Hook to add tags to a ticket
 */
export function useAddTagsToTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, tagIds }: { ticketId: number; tagIds: number[] }) =>
      ticketService.addTags(ticketId, tagIds),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * Hook to remove a tag from a ticket
 */
export function useRemoveTagFromTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, tagId }: { ticketId: number; tagId: number }) =>
      ticketService.removeTag(ticketId, tagId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      queryClient.invalidateQueries({ queryKey: ['tickets', variables.ticketId] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}
