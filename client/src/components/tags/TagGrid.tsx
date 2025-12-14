import { motion } from 'framer-motion';
import { Tag as TagIcon } from 'lucide-react';
import type { TagWithCount } from '../../types';
import { TagCard } from './TagCard';

interface TagGridProps {
  tags: TagWithCount[];
}

export function TagGrid({ tags }: TagGridProps) {
  if (tags.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-4">
          <TagIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No tags found</h3>
        <p className="text-gray-500 text-center max-w-md">
          Create a new tag to organize your tickets
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tags.map((tag, index) => (
        <TagCard key={tag.id} tag={tag} index={index} />
      ))}
    </div>
  );
}
