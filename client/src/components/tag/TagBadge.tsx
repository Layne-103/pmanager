import { X } from 'lucide-react';
import type { Tag } from '../../types';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  removable?: boolean;
  className?: string;
}

export function TagBadge({ tag, onRemove, removable = false, className = '' }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${className}`}
      style={{
        backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
        color: tag.color || '#6b7280',
        border: `1px solid ${tag.color ? `${tag.color}40` : '#e5e7eb'}`,
      }}
    >
      <span>{tag.name}</span>
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-black/10 rounded-full p-0.5 transition-colors"
          type="button"
          aria-label={`Remove ${tag.name}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
