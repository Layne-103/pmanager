export interface TagWithCount {
  id: number;
  name: string;
  color: string | null;
  ticketCount: number;
}

export interface CreateTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
}

export interface TagsListResponse {
  tags: TagWithCount[];
}
