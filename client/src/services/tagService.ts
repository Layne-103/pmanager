import { api } from './api';
import type { 
  TagWithCount, 
  CreateTagRequest,
  UpdateTagRequest,
  TagsListResponse 
} from '../types/tag';

export const tagService = {
  /**
   * Get all tags with ticket counts
   */
  async getAll(): Promise<TagWithCount[]> {
    const response = await api.get<TagsListResponse>('/api/tags/');
    return response.data.tags;
  },

  /**
   * Get a single tag by ID
   */
  async getById(id: number): Promise<TagWithCount> {
    const response = await api.get<TagWithCount>(`/api/tags/${id}`);
    return response.data;
  },

  /**
   * Create a new tag
   */
  async create(tag: CreateTagRequest): Promise<TagWithCount> {
    const response = await api.post<TagWithCount>('/api/tags/', tag);
    return response.data;
  },

  /**
   * Update an existing tag
   */
  async update(id: number, tag: UpdateTagRequest): Promise<TagWithCount> {
    const response = await api.put<TagWithCount>(`/api/tags/${id}`, tag);
    return response.data;
  },

  /**
   * Delete a tag
   */
  async delete(id: number): Promise<void> {
    await api.delete(`/api/tags/${id}`);
  },
};
