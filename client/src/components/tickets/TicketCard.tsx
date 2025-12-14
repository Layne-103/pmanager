import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Calendar, Hash } from 'lucide-react';
import type { Ticket } from '../../types';
import { Card } from '../ui/Card';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
}

export function TicketCard({ ticket, index }: TicketCardProps) {
  return (
    <Card delay={index * 0.05} className="p-6 group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              {ticket.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
              <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {ticket.title}
              </h3>
            </div>
            {ticket.description && (
              <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed ml-8">
                {ticket.description}
              </p>
            )}
          </div>

          {/* Status Badge */}
          {ticket.isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="px-3 py-1 rounded-full bg-green-100/80 text-green-700 text-xs font-medium whitespace-nowrap backdrop-blur-sm"
            >
              ✓ Completed
            </motion.div>
          )}
        </div>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 ml-8">
            {ticket.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 + tagIndex * 0.05 }}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                style={{
                  backgroundColor: tag.color ? `${tag.color}15` : '#f3f4f6',
                  color: tag.color || '#6b7280',
                  border: `1px solid ${tag.color ? `${tag.color}30` : '#e5e7eb'}`,
                }}
              >
                {tag.name}
              </motion.span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 text-sm text-gray-500 ml-8 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Hash className="w-4 h-4" />
            <span>{ticket.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
