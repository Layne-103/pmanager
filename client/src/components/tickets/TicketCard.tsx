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
    <Card delay={index * 0.03} className="p-5 group">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 flex items-start gap-3">
            {ticket.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                {ticket.title}
              </h3>
              {ticket.description && (
                <p className="text-gray-600 line-clamp-2 text-sm leading-relaxed mt-2">
                  {ticket.description}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          {ticket.isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium whitespace-nowrap border border-green-200"
            >
              ✓ Completed
            </motion.div>
          )}
        </div>

        {/* Tags */}
        {ticket.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {ticket.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 + tagIndex * 0.05 }}
                className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border"
                style={{
                  backgroundColor: tag.color ? `${tag.color}10` : '#f3f4f6',
                  color: tag.color || '#6b7280',
                  borderColor: tag.color ? `${tag.color}30` : '#e5e7eb',
                }}
              >
                {tag.name}
              </motion.span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5" />
            <span>{ticket.id}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
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
