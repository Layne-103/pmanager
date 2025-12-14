import { useState } from 'react';
import type { ChangeEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import type { CreateTagRequest } from '../../types';

interface TagCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTagRequest) => void;
  isSubmitting?: boolean;
}

const PRESET_COLORS = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // green
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6b7280', // gray
];

export function TagCreateDialog({
  open,
  onClose,
  onSubmit,
  isSubmitting = false,
}: TagCreateDialogProps) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[3]); // blue default

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({ name: name.trim(), color });
    handleClose();
  };

  const handleClose = () => {
    setName('');
    setColor(PRESET_COLORS[3]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Tag</DialogTitle>
          <DialogDescription>
            Add a new tag to organize your tickets
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="tag-name" className="text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="tag-name"
                value={name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                placeholder="Enter tag name"
                maxLength={50}
                required
                autoFocus
                disabled={isSubmitting}
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-gray-500">
                {name.length}/50 characters
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex gap-2 mt-2">
                {PRESET_COLORS.map((presetColor) => (
                  <button
                    key={presetColor}
                    type="button"
                    className={`
                      w-10 h-10 rounded-lg transition-all
                      ${color === presetColor ? 'ring-2 ring-offset-2 scale-110' : 'hover:scale-105'}
                    `}
                    style={{
                      backgroundColor: presetColor,
                      ...(color === presetColor && {
                        boxShadow: `0 0 0 2px ${presetColor}`,
                      }),
                    }}
                    onClick={() => setColor(presetColor)}
                    disabled={isSubmitting}
                    aria-label={`Select color ${presetColor}`}
                  />
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    border: `1px solid ${color}40`,
                  }}
                >
                  {name || 'Tag name'}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Tag'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
