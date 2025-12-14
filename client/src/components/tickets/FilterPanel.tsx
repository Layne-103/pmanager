import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { useDebounce } from '../../hooks';
import { TagFilterSelector } from './TagFilterSelector';
import { StatusFilterDropdown } from './StatusFilterDropdown';

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

  // Parse selected tag names from comma-separated string
  const selectedTagNames = selectedTags
    ? selectedTags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

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

  const handleTagsChange = (tagNames: string[]) => {
    onTagsChange(tagNames.join(','));
  };

  // Count active filters
  const activeFilterCount = [
    search,
    status !== 'all',
    selectedTags,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "bg-white rounded-[16px] p-6",
        "border border-gray-100",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]",
        "relative z-10"
      )}
    >
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-[10px] bg-blue-50 flex items-center justify-center">
              <Filter className="w-[18px] h-[18px] text-blue-600" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-gray-900 tracking-[-0.022em]">Filters</h3>
              {activeFilterCount > 0 && (
                <p className="text-[13px] text-gray-500 mt-0.5">{activeFilterCount} active</p>
              )}
            </div>
          </div>
          {hasFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5",
                "text-[13px] font-medium text-gray-600",
                "hover:text-blue-600",
                "rounded-[8px] hover:bg-blue-50",
                "transition-all duration-200"
              )}
              type="button"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
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

          {/* Status - Custom Dropdown */}
          <StatusFilterDropdown
            value={status}
            onChange={onStatusChange}
          />

          {/* Tags */}
          <TagFilterSelector
            selectedTagNames={selectedTagNames}
            onTagsChange={handleTagsChange}
          />
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
                Tags: {selectedTagNames.join(', ')}
              </span>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
