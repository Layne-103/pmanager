import { api } from './api';
import type {
  Ticket,
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketsListResponse
} from '../types/ticket';

export const ticketService = {
  /**
   * Get all tickets with optional filters
   */
  async getAll(params?: {
    search?: string;
    tags?: string;
    status?: string;
  }): Promise<Ticket[]> {
    const response = await api.get<TicketsListResponse>('/api/tickets/', { params });
    return response.data.tickets;
  },

  /**
   * Get a single ticket by ID
   */
  async getById(id: number): Promise<Ticket> {
    const response = await api.get<Ticket>(`/api/tickets/${id}`);
    return response.data;
  },

  /**
   * Create a new ticket
   */
  async create(ticket: CreateTicketRequest): Promise<Ticket> {
    const response = await api.post<Ticket>('/api/tickets/', ticket);
    return response.data;
  },

  /**
   * Update an existing ticket
   */
  async update(id: number, ticket: UpdateTicketRequest): Promise<Ticket> {
    const response = await api.put<Ticket>(`/api/tickets/${id}`, ticket);
    return response.data;
  },

  /**
   * Delete a ticket
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/tickets/${id}`);
  },

  /**
   * Toggle ticket completion status
   */
  async toggleComplete(id: number): Promise<Ticket> {
    const response = await api.patch<Ticket>(`/api/tickets/${id}/complete`);
    return response.data;
  },

  /**
   * Add tags to a ticket
   */
  async addTags(id: number, tagIds: number[]): Promise<Ticket> {
    const response = await api.post<Ticket>(`/api/tickets/${id}/tags`, { tagIds });
    return response.data;
  },

  /**
   * Remove a tag from a ticket
   */
  async removeTag(ticketId: number, tagId: number): Promise<Ticket> {
    const response = await api.delete<Ticket>(`/api/tickets/${ticketId}/tags/${tagId}`);
    return response.data;
  },
};
