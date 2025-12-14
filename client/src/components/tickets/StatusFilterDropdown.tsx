import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Filter } from 'lucide-react';
import { cn } from '../../lib/cn';

interface StatusOption {
  value: string;
  label: string;
  description: string;
  icon: string;
}

const STATUS_OPTIONS: StatusOption[] = [
  {
    value: 'all',
    label: 'All Tickets',
    description: 'Show all tickets',
    icon: '📋',
  },
  {
    value: 'open',
    label: 'Open Only',
    description: 'Show incomplete tickets',
    icon: '🔓',
  },
  {
    value: 'completed',
    label: 'Completed Only',
    description: 'Show finished tickets',
    icon: '✅',
  },
];

interface StatusFilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function StatusFilterDropdown({
  value,
  onChange,
}: StatusFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = STATUS_OPTIONS.find((opt) => opt.value === value) || STATUS_OPTIONS[0];

  // Close on escape key
  useEffect(() => {
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

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

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
          value !== 'all'
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-gray-400'
        )}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-900 truncate">{selectedOption.label}</span>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform flex-shrink-0',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[200]"
            onClick={() => setIsOpen(false)}
          />

          {/* Options List */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-[210] overflow-hidden">
            <div className="py-1">
              {STATUS_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full px-3 py-2.5 text-left',
                      'flex items-center gap-3',
                      'hover:bg-gray-50 transition-colors',
                      isSelected && 'bg-blue-50'
                    )}
                  >
                    {/* Icon */}
                    <span className="text-lg flex-shrink-0">{option.icon}</span>

                    {/* Label and Description */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {option.description}
                      </div>
                    </div>

                    {/* Check Icon */}
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
