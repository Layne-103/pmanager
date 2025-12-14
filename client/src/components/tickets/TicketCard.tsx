import { CheckCircle2, Circle, Calendar, Hash, Tag as TagIcon, Edit, Trash2 } from 'lucide-react';
import type { Ticket } from '../../types';
import { Card } from '../ui/Card';
import { formatDistanceToNow } from 'date-fns';

interface TicketCardProps {
  ticket: Ticket;
  index: number;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
}

export function TicketCard({ ticket, index, onEdit, onDelete, onToggleComplete }: TicketCardProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(ticket);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(ticket.id);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleComplete?.(ticket.id);
  };

  return (
    <Card delay={index * 0.03} className="p-4 group shadow-sm hover:shadow-md">
      <div className="space-y-3">
        {/* Header with Title and Status */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className="flex-shrink-0 pt-0.5 hover:scale-110 transition-transform"
            title={ticket.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            type="button"
          >
            {ticket.isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={2.5} />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" strokeWidth={2} />
            )}
          </button>

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

            {/* Footer Metadata and Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  <span>{ticket.id}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Action Buttons - Always visible on mobile, hover on desktop */}
              <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={handleEdit}
                    className="p-1.5 rounded-md hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Edit ticket"
                    type="button"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-md hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors"
                    title="Delete ticket"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
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
