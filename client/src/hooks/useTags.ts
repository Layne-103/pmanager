import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tagService } from '../services/tagService';
import type { CreateTagRequest, UpdateTagRequest } from '../types/tag';

/**
 * Hook to fetch all tags with counts
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getAll(),
  });
}

/**
 * Hook to fetch a single tag by ID
 */
export function useTag(id: number) {
  return useQuery({
    queryKey: ['tags', id],
    queryFn: () => tagService.getById(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new tag
 */
export function useCreateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tag: CreateTagRequest) => tagService.create(tag),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

/**
 * Hook to update a tag
 */
export function useUpdateTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, tag }: { id: number; tag: UpdateTagRequest }) =>
      tagService.update(id, tag),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tags', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

/**
 * Hook to delete a tag
 */
export function useDeleteTag() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => tagService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
