import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Calendar } from 'lucide-react';
import type { Ticket } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/cn';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
}

export function TicketCard({ ticket, index }: TicketCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

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
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                {ticket.title}
              </h3>
              {ticket.isCompleted && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.5 }}
                >
                  <Badge variant="success" className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Completed</span>
                  </Badge>
                </motion.div>
              )}
            </div>

            {ticket.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                {ticket.description}
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {ticket.tags.map((tag) => (
              <motion.span
                key={tag.id}
                whileHover={{ scale: 1.05 }}
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                  'backdrop-blur-xl transition-all duration-200',
                  'border border-transparent hover:border-gray-300'
                )}
                style={{
                  backgroundColor: tag.color ? `${tag.color}15` : '#f3f4f6',
                  color: tag.color || '#374151',
                }}
              >
                {tag.name}
              </motion.span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(ticket.createdAt)}</span>
            </div>
            {!ticket.isCompleted && (
              <div className="flex items-center space-x-1 text-orange-600">
                <Clock className="w-3.5 h-3.5" />
                <span>In Progress</span>
              </div>
            )}
          </div>
          <span className="text-gray-400">#{ticket.id}</span>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
}
