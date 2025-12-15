import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Hash, Tag as TagIcon, Edit, Trash2 } from 'lucide-react';
import type { Ticket } from '../../types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/cn';
import { Checkbox } from '../ui/checkbox';

interface AppleTicketCardProps {
  ticket: Ticket;
  index: number;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
  onToggleComplete?: (id: number) => void;
  selected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
}

export function AppleTicketCard({ 
  ticket, 
  index, 
  onEdit, 
  onDelete, 
  onToggleComplete,
  selected = false,
  onSelect
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

  const handleSelectionChange = (checked: boolean) => {
    onSelect?.(ticket.id, checked);
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
      className="group"
    >
      <div className={cn(
        "bg-white rounded-xl px-4 py-3.5",
        "border border-gray-200",
        "transition-all duration-200",
        "hover:border-gray-300",
        selected && "border-blue-300 bg-blue-50/20"
      )}>
        {/* Single Row Layout */}
        <div className="flex items-center gap-3">
          {/* Selection Checkbox */}
          <div className="flex-shrink-0">
            <Checkbox
              checked={selected}
              onCheckedChange={handleSelectionChange}
              className="h-5 w-5"
            />
          </div>

          {/* Title - takes most space */}
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              'text-[15px] font-medium',
              'truncate',
              ticket.isCompleted 
                ? 'text-gray-400 line-through' 
                : 'text-gray-900'
            )}>
              {ticket.title}
            </h3>
          </div>

          {/* Action Buttons - always visible */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {onEdit && (
              <button
                onClick={handleEdit}
                className={cn(
                  "p-1.5 rounded-lg",
                  "text-gray-400 hover:text-blue-600",
                  "hover:bg-blue-50",
                  "transition-all duration-200"
                )}
                title="Edit"
                type="button"
              >
                <Edit className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className={cn(
                  "p-1.5 rounded-lg",
                  "text-gray-400 hover:text-red-600",
                  "hover:bg-red-50",
                  "transition-all duration-200"
                )}
                title="Delete"
                type="button"
              >
                <Trash2 className="w-[18px] h-[18px]" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
