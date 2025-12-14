import { CheckCircle2, Circle, Calendar, Hash, Tag as TagIcon } from 'lucide-react';
import type { Ticket } from '../../types';
import { Card } from '../ui/Card';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
}

export function TicketCard({ ticket, index }: TicketCardProps) {
  return (
    <Card delay={index * 0.03} className="p-4 group shadow-sm hover:shadow-md">
      <div className="space-y-3">
        {/* Header with Title and Status */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="flex-shrink-0 pt-0.5">
            {ticket.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" strokeWidth={2} />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title and Badge */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className={cn(
                'text-sm font-semibold leading-snug',
                ticket.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
              )}>
                {ticket.title}
              </h3>
              {ticket.isCompleted && (
                <span className="flex-shrink-0 px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                  ✓ Completed
                </span>
              )}
            </div>

            {/* Description */}
            {ticket.description && (
              <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-2">
                {ticket.description}
              </p>
            )}

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ticket.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border"
                    style={{
                      backgroundColor: tag.color ? `${tag.color}15` : '#f3f4f6',
                      color: tag.color || '#6b7280',
                      borderColor: tag.color ? `${tag.color}40` : '#e5e7eb',
                    }}
                  >
                    <TagIcon className="w-3 h-3" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Footer Metadata */}
            <div className="flex items-center gap-3 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                <span>{ticket.id}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
