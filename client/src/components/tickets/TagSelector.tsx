import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Tag as TagIcon } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { TagBadge } from '../tag/TagBadge';
import { useTags } from '../../hooks';
import type { Tag } from '../../types';

interface TagSelectorProps {
  selectedTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: number) => void;
  disabled?: boolean;
}

/**
 * TagSelector component for managing tags on a ticket
 * Allows adding and removing tags with a searchable dropdown
 */
export function TagSelector({
  selectedTags,
  onAddTag,
  onRemoveTag,
  disabled = false,
}: TagSelectorProps) {
  const [open, setOpen] = useState(false);
  const { data: allTags, isLoading } = useTags();

  // Filter out already selected tags
  const availableTags = allTags?.filter(
    (tag) => !selectedTags.find((selected) => selected.id === tag.id)
  ) || [];

  const handleSelectTag = (tag: Tag) => {
    onAddTag(tag);
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap gap-2"
        >
          <AnimatePresence>
            {selectedTags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <TagBadge
                  tag={tag}
                  onRemove={disabled ? undefined : () => onRemoveTag(tag.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Tag Button */}
      {!disabled && availableTags.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 border-dashed hover:border-solid hover:border-blue-500 hover:bg-blue-50 transition-all"
              disabled={disabled}
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandInput placeholder="Search tags..." />
              <CommandEmpty>
                {isLoading ? 'Loading tags...' : 'No tags found.'}
              </CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {availableTags.map((tag) => (
                  <CommandItem
                    key={tag.id}
                    onSelect={() => handleSelectTag(tag)}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color || '#94a3b8' }}
                      />
                      <span className="flex-1">{tag.name}</span>
                      <Plus className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Empty State */}
      {selectedTags.length === 0 && !disabled && (
        <div className="text-sm text-gray-500 flex items-center gap-2">
          <TagIcon className="w-4 h-4" />
          <span>No tags selected. Add tags to organize this ticket.</span>
        </div>
      )}

      {/* No Available Tags Message */}
      {availableTags.length === 0 && selectedTags.length > 0 && !disabled && (
        <p className="text-xs text-gray-500 italic">
          All available tags have been added.
        </p>
      )}
    </div>
  );
}
