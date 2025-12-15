import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Checkbox } from '../ui/checkbox';

interface TicketTableHeaderProps {
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  someSelected: boolean;
}

export function TicketTableHeader({
  sortOrder,
  onSortChange,
  allSelected,
  onSelectAll,
  someSelected,
}: TicketTableHeaderProps) {
  const toggleSort = () => {
    onSortChange(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <div className="grid grid-cols-[auto_2fr_100px_1fr_auto] gap-4 px-4 py-3 bg-gray-50/50 border-b border-gray-200">
      {/* Checkbox Column - Select All */}
      <div className="flex items-center w-10">
        <Checkbox
          checked={allSelected}
          onCheckedChange={(checked) => onSelectAll(checked as boolean)}
          className={cn(
            'h-5 w-5',
            someSelected && !allSelected && 'data-[state=checked]:bg-blue-500'
          )}
        />
      </div>

      {/* Title Column */}
      <div className="text-sm font-medium text-gray-500">
        Title
      </div>

      {/* Status Column */}
      <div className="text-sm font-medium text-gray-500">
        Status
      </div>

      {/* Date Column - Sortable */}
      <button
        onClick={toggleSort}
        className={cn(
          'flex items-center gap-2',
          'text-sm font-medium text-gray-500',
          'hover:text-gray-700 transition-colors',
          'text-left justify-start'
        )}
      >
        <span>Date</span>
        <div className="flex flex-col">
          {sortOrder === 'newest' ? (
            <ChevronDown className="w-4 h-4" strokeWidth={2} />
          ) : (
            <ChevronUp className="w-4 h-4" strokeWidth={2} />
          )}
        </div>
      </button>

      {/* Tag Column */}
      <div className="text-sm font-medium text-gray-500 text-right">
        Tag
      </div>
    </div>
  );
}
