import { motion } from 'framer-motion';
import { Tag, Ticket } from 'lucide-react';
import type { TagWithCount } from '../../types';
import { Card } from '../ui/Card';

interface TagCardProps {
  tag: TagWithCount;
  index: number;
}

export function TagCard({ tag, index }: TagCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <Card className="p-6 group cursor-pointer">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
            style={{
              backgroundColor: tag.color || '#e5e7eb',
              boxShadow: `0 8px 24px ${tag.color || '#e5e7eb'}30`,
            }}
          >
            <Tag
              className="w-6 h-6"
              style={{
                color: tag.color ? '#fff' : '#374151',
              }}
              strokeWidth={2.5}
            />
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
              {tag.name}
            </h3>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Ticket className="w-4 h-4" />
              <span>
                {tag.ticketCount} {tag.ticketCount === 1 ? 'ticket' : 'tickets'}
              </span>
            </div>

            {tag.color && (
              <div className="mt-3 flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="text-xs font-mono text-gray-400 uppercase">
                  {tag.color}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at top right, ${tag.color || '#e5e7eb'}10, transparent)`,
          }}
        />
      </Card>
    </motion.div>
  );
}
