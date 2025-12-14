import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Container } from '../components/layout';
import { TagGrid } from '../components/tags';
import { TagCreateDialog } from '../components/tag';
import { ConfirmDialog, TagSkeletonGrid } from '../components/common';
import { useTags, useCreateTag, useDeleteTag } from '../hooks';
import type { CreateTagRequest } from '../types';

export function TagsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [deletingTagId, setDeletingTagId] = useState<number | null>(null);

  const { data: tags, isLoading, error } = useTags();
  const createMutation = useCreateTag();
  const deleteMutation = useDeleteTag();

  const handleCreate = async (data: CreateTagRequest) => {
    try{
      console.log('Creating tag:', data);
      await createMutation.mutateAsync(data);
      setIsCreateDialogOpen(false);
      toast.success('Tag created successfully');
    } catch (error) {
      console.error('Create tag error:', error);
      toast.error('Failed to create tag');
    }
  };

  const handleDelete = async () => {
    if (!deletingTagId) {
      console.error('No tag to delete');
      return;
    }

    try {
      console.log('Deleting tag:', deletingTagId);
      await deleteMutation.mutateAsync(deletingTagId);
      setDeletingTagId(null);
      toast.success('Tag deleted successfully');
    } catch (error) {
      console.error('Delete tag error:', error);
      toast.error('Failed to delete tag');
    }
  };

  if (error) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 rounded-xl p-6 border border-red-200"
        >
          <p className="text-red-800">Error loading tags: {(error as Error).message}</p>
        </motion.div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="space-y-5">
          <div className="flex items-center justify-between pt-4 pb-1">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
              <p className="mt-1 text-gray-600">Organize your tickets with tags</p>
            </div>
          </div>
          <TagSkeletonGrid count={8} />
        </div>
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
          className="flex items-center justify-between pt-4 pb-1"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
            <p className="text-sm text-gray-600 mt-1">
              {tags?.length || 0} tags • Organize your tickets
            </p>
          </div>

          {/* Create Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>New Tag</span>
          </motion.button>
        </motion.div>

        {/* Tags Grid */}
        <TagGrid
          tags={tags || []}
          onDelete={setDeletingTagId}
        />

        {/* Create Dialog */}
        <TagCreateDialog
          open={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreate}
          isSubmitting={createMutation.isPending}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          open={!!deletingTagId}
          onClose={() => setDeletingTagId(null)}
          onConfirm={handleDelete}
          title="Delete Tag"
          description="Are you sure you want to delete this tag? It will be removed from all tickets. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          variant="destructive"
        />
      </div>
    </Container>
  );
}
