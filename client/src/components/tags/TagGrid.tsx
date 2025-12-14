import { motion } from 'framer-motion';
import { Tags as TagsIcon } from 'lucide-react';
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
        transition={{ duration: 0.5 }}
        className="glass rounded-2xl p-16 text-center border border-white/20"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-6"
        >
          <TagsIcon className="w-10 h-10 text-gray-400" />
        </motion.div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">No tags found</h3>
        <p className="text-gray-500 max-w-md mx-auto">
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
