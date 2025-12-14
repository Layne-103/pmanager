import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cn';

interface FilterPanelProps {
  search: string;
  status: string;
  selectedTags: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTagsChange: (value: string) => void;
}

export function FilterPanel({
  search,
  status,
  selectedTags,
  onSearchChange,
  onStatusChange,
  onTagsChange,
}: FilterPanelProps) {
  const hasFilters = search || status !== 'all' || selectedTags;

  const clearFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onTagsChange('');
  };

  return (
    <Card className="p-6" delay={0.1}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tickets..."
              className={cn(
                'w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200',
                'bg-white/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200',
                'placeholder:text-gray-400'
              )}
            />
          </div>

          {/* Status */}
          <div>
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={cn(
                'w-full px-4 py-3 rounded-xl border border-gray-200',
                'bg-white/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200',
                'cursor-pointer appearance-none',
                'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]',
                'bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10'
              )}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <input
              type="text"
              value={selectedTags}
              onChange={(e) => onTagsChange(e.target.value)}
              placeholder="Tag IDs (e.g., 1,2,3)"
              className={cn(
                'w-full px-4 py-3 rounded-xl border border-gray-200',
                'bg-white/50 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200',
                'placeholder:text-gray-400'
              )}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
