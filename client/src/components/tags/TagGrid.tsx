import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import type { TagWithCount } from '../../types';
import { TagCard } from './TagCard';

interface TagGridProps {
  tags: TagWithCount[];
  onDelete?: (id: number) => void;
}

export function TagGrid({ tags, onDelete }: TagGridProps) {
  if (tags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center py-16 px-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6"
        >
          <FolderOpen className="w-10 h-10 text-gray-400" />
        </motion.div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tags yet</h3>
        <p className="text-gray-600 text-center max-w-sm">
          Create your first tag to start organizing your tickets by category, priority, or any other way you like.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      {tags.map((tag, index) => (
        <TagCard key={tag.id} tag={tag} index={index} onDelete={onDelete} />
      ))}
    </motion.div>
  );
}
