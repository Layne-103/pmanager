import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  label?: string;
}

export function FloatingActionButton({ onClick, label = 'Create' }: FloatingActionButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 z-40"
      aria-label={label}
    >
      <Plus className="w-5 h-5" strokeWidth={2.5} />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}
