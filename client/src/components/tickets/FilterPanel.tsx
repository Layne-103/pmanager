import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Card className="p-6" hover={false}>
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <Input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tickets..."
              className="pl-11"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="completed">Completed</option>
          </Select>

          {/* Tag Filter */}
          <Input
            type="text"
            value={selectedTags}
            onChange={(e) => onTagsChange(e.target.value)}
            placeholder="Tag IDs (e.g., 1,2,3)"
          />
        </div>
      </Card>
    </motion.div>
  );
}
