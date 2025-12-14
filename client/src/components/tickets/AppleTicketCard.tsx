import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Hash, Tag as TagIcon, Edit, Trash2 } from 'lucide-react';
import type { Ticket } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/cn';

interface AppleTicketCardProps {
  ticket: Ticket;
  index: number;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
}

export function AppleTicketCard({ 
  ticket, 
  index, 
  onEdit, 
  onDelete, 
  onToggleComplete 
}: AppleTicketCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.35, 
        delay: index * 0.04,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={{ 
        y: -2,
        transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }
      }}
      className="group"
    >
      <div className={cn(
        "bg-white rounded-[16px] p-5",
        "border border-gray-100",
        "transition-all duration-300 ease-out",
        "hover:shadow-[0_8px_16px_rgba(0,0,0,0.08),0_4px_8px_rgba(0,0,0,0.04)]",
        "hover:border-gray-200"
      )}>
        {/* Header Section */}
        <div className="flex items-start gap-4">
          {/* Checkbox - Apple style */}
          <button
            onClick={handleToggle}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full mt-0.5",
              "border-2 transition-all duration-200",
              "flex items-center justify-center",
              ticket.isCompleted
                ? "bg-blue-500 border-blue-500"
                : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
            )}
            title={ticket.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            type="button"
          >
            {ticket.isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
              </motion.div>
            )}
          </button>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title Row */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className={cn(
                'text-[17px] font-semibold leading-[1.29412] tracking-[-0.022em]',
                'transition-all duration-200',
                ticket.isCompleted 
                  ? 'text-gray-400 line-through' 
                  : 'text-gray-900'
              )}>
                {ticket.title}
              </h3>
              {ticket.isCompleted && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={cn(
                    "flex-shrink-0 px-2.5 py-1",
                    "rounded-full",
                    "bg-green-50 text-green-600",
                    "text-[11px] font-medium tracking-wide",
                    "border border-green-100"
                  )}
                >
                  COMPLETED
                </motion.span>
              )}
            </div>

            {/* Description */}
            {ticket.description && (
              <p className={cn(
                "text-[15px] leading-[1.47059] tracking-[-0.016em]",
                "text-gray-600 mb-3",
                "line-clamp-2"
              )}>
                {ticket.description}
              </p>
            )}

            {/* Tags */}
            {ticket.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {ticket.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      "px-3 py-1.5 rounded-full",
                      "text-[12px] font-medium tracking-wide",
                      "transition-all duration-200",
                      "border"
                    )}
                    style={{
                      backgroundColor: tag.color ? `${tag.color}08` : '#f5f5f7',
                      color: tag.color || '#6e6e73',
                      borderColor: tag.color ? `${tag.color}20` : '#e5e5ea',
                    }}
                  >
                    <TagIcon className="w-3 h-3" strokeWidth={2.5} />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Footer - Metadata and Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              {/* Metadata */}
              <div className="flex items-center gap-4 text-[13px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5" strokeWidth={2} />
                  <span className="font-medium">{ticket.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>
                    {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={cn(
                "flex items-center gap-1",
                "opacity-0 md:group-hover:opacity-100",
                "transition-opacity duration-200"
              )}>
                {onEdit && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleEdit}
                    className={cn(
                      "p-2 rounded-lg",
                      "text-gray-600 hover:text-blue-600",
                      "hover:bg-blue-50",
                      "transition-all duration-200"
                    )}
                    title="Edit ticket"
                    type="button"
                  >
                    <Edit className="w-[18px] h-[18px]" strokeWidth={2} />
                  </motion.button>
                )}
                {onDelete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDelete}
                    className={cn(
                      "p-2 rounded-lg",
                      "text-gray-600 hover:text-red-600",
                      "hover:bg-red-50",
                      "transition-all duration-200"
                    )}
                    title="Delete ticket"
                    type="button"
                  >
                    <Trash2 className="w-[18px] h-[18px]" strokeWidth={2} />
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
