import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Tag as TagIcon } from 'lucide-react';
import { useTags } from '../../hooks';
import { cn } from '../../lib/cn';

interface TagFilterSelectorProps {
  selectedTagNames: string[];
  onTagsChange: (tagNames: string[]) => void;
}

/**
 * Multi-select tag filter component
 * Allows users to select multiple tags by name instead of entering IDs
 */
export function TagFilterSelector({
  selectedTagNames,
  onTagsChange,
}: TagFilterSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: allTags, isLoading } = useTags();

  // Close dropdown when clicking outside (now handled by backdrop)
  useEffect(() => {
    // Close on Escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  // Filter tags based on search query
  const filteredTags = (allTags || []).filter((tag) =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleTag = (tagName: string) => {
    if (selectedTagNames.includes(tagName)) {
      onTagsChange(selectedTagNames.filter((name) => name !== tagName));
    } else {
      onTagsChange([...selectedTagNames, tagName]);
    }
  };

  const clearAll = () => {
    onTagsChange([]);
    setIsOpen(false);
  };

  // Get selected tags with their details
  const selectedTagsDetails = (allTags || []).filter((tag) =>
    selectedTagNames.includes(tag.name)
  );

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2 rounded-lg border text-sm text-left',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
          'transition-all duration-200',
          'flex items-center justify-between gap-2',
          selectedTagNames.length > 0
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <TagIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {selectedTagNames.length === 0 ? (
            <span className="text-gray-400">Select tags...</span>
          ) : (
            <div className="flex flex-wrap gap-1 flex-1 min-w-0">
              {selectedTagsDetails.slice(0, 2).map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                  style={{
                    backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
                    color: tag.color || '#6b7280',
                  }}
                >
                  {tag.name}
                </span>
              ))}
              {selectedTagNames.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  +{selectedTagNames.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {selectedTagNames.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              className="p-0.5 hover:bg-gray-200 rounded transition-colors"
              aria-label="Clear all tags"
            >
              <X className="w-3.5 h-3.5 text-gray-500" />
            </button>
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform',
              isOpen && 'transform rotate-180'
            )}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[200]" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[210] max-h-80 overflow-hidden flex flex-col">
            {/* Search */}
            <div className="p-2 border-b border-gray-100 flex-shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Tag List */}
            <div className="overflow-y-auto flex-1 min-h-0">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Loading tags...
              </div>
            ) : filteredTags.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {searchQuery ? 'No tags found' : 'No tags available'}
              </div>
            ) : (
              <div className="py-1">
                {filteredTags.map((tag) => {
                  const isSelected = selectedTagNames.includes(tag.name);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.name)}
                      className={cn(
                        'w-full px-3 py-2 text-left text-sm',
                        'flex items-center gap-3',
                        'hover:bg-gray-50 transition-colors',
                        isSelected && 'bg-blue-50'
                      )}
                    >
                      {/* Checkbox */}
                      <div
                        className={cn(
                          'w-4 h-4 rounded border flex items-center justify-center flex-shrink-0',
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        )}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>

                      {/* Tag Color */}
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color || '#94a3b8' }}
                      />

                      {/* Tag Name */}
                      <span className="flex-1 text-gray-900">{tag.name}</span>

                      {/* Ticket Count */}
                      <span className="text-xs text-gray-500">
                        {tag.ticketCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

            {/* Footer */}
            {selectedTagNames.length > 0 && (
              <div className="p-2 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
                <span className="text-xs text-gray-600">
                  {selectedTagNames.length} selected
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
