import { motion } from 'framer-motion';
import { Tag as TagIcon, Ticket } from 'lucide-react';
import type { TagWithCount } from '../../types';
import { Card } from '../ui/Card';

interface TagCardProps {
  tag: TagWithCount;
  index: number;
}

export function TagCard({ tag, index }: TagCardProps) {
  return (
    <Card delay={index * 0.05} className="p-6 group">
      <div className="space-y-4">
        {/* Icon and Title */}
        <div className="flex items-start space-x-4">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
            style={{
              backgroundColor: tag.color || '#e5e7eb',
              boxShadow: tag.color ? `0 10px 30px -5px ${tag.color}40` : undefined,
            }}
          >
            <TagIcon
              className="w-7 h-7"
              style={{ color: tag.color ? '#ffffff' : '#6b7280' }}
              strokeWidth={2.5}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {tag.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Ticket className="w-4 h-4 text-gray-400" />
              <p className="text-sm text-gray-500">
                {tag.ticketCount} {tag.ticketCount === 1 ? 'ticket' : 'tickets'}
              </p>
            </div>
          </div>
        </div>

        {/* Color Code */}
        {tag.color && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
            className="flex items-center justify-between pt-3 border-t border-gray-100"
          >
            <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">
              Color
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-600">
                {tag.color}
              </span>
              <div
                className="w-4 h-4 rounded border border-gray-200"
                style={{ backgroundColor: tag.color }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
