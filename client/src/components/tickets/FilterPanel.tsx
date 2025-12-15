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
  );
}
