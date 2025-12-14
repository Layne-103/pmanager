import { motion } from 'framer-motion';
import { Tag as TagIcon, Trash2 } from 'lucide-react';
import type { TagWithCount } from '../../types';
import { Card } from '../ui/Card';

interface TagCardProps {
  tag: TagWithCount;
  index: number;
  onDelete?: (id: number) => void;
}

export function TagCard({ tag, index, onDelete }: TagCardProps) {
  return (
    <Card delay={index * 0.05} className="p-5 group cursor-pointer hover:shadow-lg transition-all">
      <div className="space-y-3">
        {/* Color and Name */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
            style={{
              backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
              border: `2px solid ${tag.color || '#e5e7eb'}`,
            }}
          >
            <TagIcon className="w-6 h-6" style={{ color: tag.color || '#6b7280' }} />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {tag.name}
            </h3>
          </div>
        </div>

        {/* Ticket Count and Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-sm font-medium">
              {tag.ticketCount} {tag.ticketCount === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tag.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
              title="Delete tag"
              type="button"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
}
