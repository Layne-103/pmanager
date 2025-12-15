import { motion } from 'framer-motion';
import { Edit, Trash2 } from 'lucide-react';
import type { Ticket } from '../../types';
import { format } from 'date-fns';
import { cn } from '../../lib/cn';
import { Checkbox } from '../ui/checkbox';

interface TicketTableRowProps {
  ticket: Ticket;
  index: number;
  selected?: boolean;
  onSelect?: (id: number, selected: boolean) => void;
  onEdit?: (ticket: Ticket) => void;
  onDelete?: (id: number) => void;
}

export function TicketTableRow({
  ticket,
  index,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
}: TicketTableRowProps) {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(ticket);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(ticket.id);
  };

  const handleSelectionChange = (checked: boolean) => {
    onSelect?.(ticket.id, checked);
  };

  // Single click to toggle selection
  const handleRowClick = () => {
    onSelect?.(ticket.id, !selected);
  };

  // Double click to edit
  const handleRowDoubleClick = () => {
    onEdit?.(ticket);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="group"
    >
      <div
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        className={cn(
          'grid grid-cols-[auto_2fr_100px_1fr_auto] gap-4 px-4 py-4',
          'border-b border-gray-100',
          'hover:bg-gray-50/50 transition-colors cursor-pointer',
          selected && 'bg-blue-50/30'
        )}
      >
        {/* Checkbox */}
        <div 
          className="flex items-center w-10"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={selected}
            onCheckedChange={handleSelectionChange}
            className="h-5 w-5"
          />
        </div>

        {/* Title */}
        <div className="flex items-center justify-between gap-4">
          <span className={cn(
            'text-[15px] font-medium',
            ticket.isCompleted 
              ? 'text-gray-400 line-through' 
              : 'text-gray-900'
          )}>
            {ticket.title}
          </span>

          {/* Action Buttons - Show on hover */}
          <div 
            className={cn(
              'flex items-center gap-1 opacity-0 group-hover:opacity-100',
              'transition-opacity duration-200'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {onEdit && (
              <button
                onClick={handleEdit}
                className={cn(
                  'p-1.5 rounded-md',
                  'text-gray-400 hover:text-blue-600 hover:bg-blue-50',
                  'transition-all duration-200'
                )}
                title="Edit"
              >
                <Edit className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDelete}
                className={cn(
                  'p-1.5 rounded-md',
                  'text-gray-400 hover:text-red-600 hover:bg-red-50',
                  'transition-all duration-200'
                )}
                title="Delete"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2} />
              </button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center">
          <span className={cn(
            'px-2.5 py-1 rounded-md text-xs font-medium',
            ticket.isCompleted
              ? 'bg-green-100 text-green-700'
              : 'bg-orange-100 text-orange-700'
          )}>
            {ticket.isCompleted ? 'Completed' : 'Open'}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center">
          <span className={cn(
            'text-[15px] text-left',
            ticket.isCompleted ? 'text-gray-400' : 'text-gray-700'
          )}>
            {format(new Date(ticket.createdAt), 'yyyy-MM-dd')}
          </span>
        </div>

        {/* Tags */}
        <div className="flex items-center justify-end gap-2">
          {ticket.tags.slice(0, 2).map((tag) => (
            <span
              key={tag.id}
              className={cn(
                'px-3 py-1 rounded-md',
                'text-[13px] font-medium',
                'transition-colors'
              )}
              style={{
                backgroundColor: tag.color ? `${tag.color}15` : '#f0f0f0',
                color: tag.color || '#666',
              }}
            >
              {tag.name}
            </span>
          ))}
          {ticket.tags.length > 2 && (
            <span className="text-[13px] text-gray-400 font-medium">
              +{ticket.tags.length - 2}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
