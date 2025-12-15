import { useState } from 'react';
import { Plus, Tag as TagIcon, X } from 'lucide-react';
import { useTags } from '../../hooks';
import type { Tag } from '../../types';

interface TagSelectorProps {
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: number) => void;
  disabled?: boolean;
}

/**
 * Simplified TagSelector component
 * - Displays selected tags with remove buttons
 * - Click "Add Tag" to show available tags dropdown
 */
export function TagSelector({
  selectedTags,
  onAddTag,
  onRemoveTag,
  disabled = false,
}: TagSelectorProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: allTags, isLoading } = useTags();

  console.log('=== TagSelector Debug ===');
  console.log('All tags from API:', allTags);
  console.log('Selected tags:', selectedTags);
  console.log('Is loading:', isLoading);
  console.log('Disabled:', disabled);

  // Filter out already selected tags
  const availableTags = (allTags || [])
    .filter((tag) => !selectedTags.find((selected) => selected.id === tag.id))
    .map((tag) => ({
      id: tag.id,
      name: tag.name,
      color: tag.color,
    }));

  console.log('Available tags (filtered):', availableTags);

  const handleAddTag = (tag: Tag) => {
    console.log('Adding tag:', tag);
    onAddTag(tag);
    setShowDropdown(false);
  };

  const handleRemoveTag = (tagId: number) => {
    console.log('Removing tag ID:', tagId);
    onRemoveTag(tagId);
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <div
              key={tag.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border"
              style={{
                backgroundColor: tag.color ? `${tag.color}15` : '#f3f4f6',
                color: tag.color || '#6b7280',
                borderColor: tag.color ? `${tag.color}40` : '#e5e7eb',
              }}
            >
              <TagIcon className="w-3.5 h-3.5" />
              <span>{tag.name}</span>
              {!disabled && (
                <button
                  onClick={() => handleRemoveTag(tag.id)}
                  className="ml-1 hover:bg-black/10 rounded p-0.5 transition-colors"
                  title="Remove tag"
                  type="button"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Tag Button and Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          disabled={disabled || (availableTags.length === 0 && !isLoading)}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          type="button"
        >
          <Plus className="w-4 h-4" />
          Add Tag
          {availableTags.length === 0 && !isLoading && ' (All tags added)'}
        </button>

        {/* Dropdown List */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setShowDropdown(false)}
            />

            {/* Dropdown Content */}
            <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-64 overflow-auto">
              {isLoading && (
                <div className="p-4 text-sm text-gray-500 text-center">
                  Loading tags...
                </div>
              )}

              {!isLoading && availableTags.length === 0 && (
                <div className="p-4 text-sm text-gray-500 text-center">
                  All tags have been added
                </div>
              )}

              {!isLoading && availableTags.length > 0 && (
                <div className="py-1">
                  {availableTags.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleAddTag(tag)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      type="button"
                    >
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color || '#94a3b8' }}
                      />
                      <span className="text-sm text-gray-900">{tag.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Empty State */}
      {selectedTags.length === 0 && !disabled && (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          <span>No tags selected. Add tags to organize this ticket.</span>
        </div>
      )}
    </div>
  );
}
