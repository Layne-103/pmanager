export interface Tag {
  id: number;
  name: string;
  color: string | null;
}

export interface Ticket {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
}

export interface CreateTicketRequest {
  title: string;
  description?: string;
  tagIds?: number[];
}

export interface UpdateTicketRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

export interface TicketsListResponse {
  tickets: Ticket[];
}
