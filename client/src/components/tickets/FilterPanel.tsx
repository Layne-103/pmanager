import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/cn';
import { useDebounce } from '../../hooks';

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
  const [searchInput, setSearchInput] = useState(search);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Update parent when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch]);

  // Sync with external search changes
  useEffect(() => {
    if (search !== searchInput) {
      setSearchInput(search);
    }
  }, [search]);

  const hasFilters = search || status !== 'all' || selectedTags;

  const clearFilters = () => {
    setSearchInput('');
    onSearchChange('');
    onStatusChange('all');
    onTagsChange('');
  };

  const clearSearch = () => {
    setSearchInput('');
    onSearchChange('');
  };

  // Count active filters
  const activeFilterCount = [
    search,
    status !== 'all',
    selectedTags,
  ].filter(Boolean).length;

  return (
    <Card className="p-5 shadow-sm" delay={0.1}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
              <Filter className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
              {activeFilterCount > 0 && (
                <p className="text-xs text-gray-500">{activeFilterCount} active</p>
              )}
            </div>
          </div>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={clearFilters}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              type="button"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              value={searchInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
              placeholder="Search tickets..."
              className={cn(
                'w-full pl-9 pr-9 py-2 rounded-lg border border-gray-300',
                'bg-white text-sm text-gray-900',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200',
                'placeholder:text-gray-400',
                searchInput && 'pr-9'
              )}
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded transition-colors"
                type="button"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
            {searchInput && debouncedSearch !== searchInput && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value)}
              className={cn(
                'w-full px-3 py-2 rounded-lg border',
                status !== 'all' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
                'text-sm text-gray-900',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200',
                'cursor-pointer appearance-none',
                'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")]',
                'bg-[length:1.25em_1.25em] bg-[right_0.5rem_center] bg-no-repeat pr-9'
              )}
            >
              <option value="all">All Tickets</option>
              <option value="open">Open Only</option>
              <option value="completed">Completed Only</option>
            </select>
          </div>

          {/* Tags */}
          <div className="relative">
            <input
              type="text"
              value={selectedTags}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onTagsChange(e.target.value)}
              placeholder="Tag IDs (e.g., 1,2,3)"
              className={cn(
                'w-full px-3 py-2 rounded-lg border',
                selectedTags ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white',
                'text-sm text-gray-900',
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                'transition-all duration-200',
                'placeholder:text-gray-400'
              )}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100"
          >
            <span className="text-xs font-medium text-gray-500">Active:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                Search: "{search}"
              </span>
            )}
            {status !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                Status: {status}
              </span>
            )}
            {selectedTags && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-medium">
                Tags: {selectedTags}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </Card>
  );
}
