import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers, Tag } from 'lucide-react';
import { cn } from '../../lib/cn';

export function Header() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Tickets', icon: Layers },
    { path: '/tags', label: 'Tags', icon: Tag },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm"
            >
              <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.div>
            <span className="text-base font-semibold text-gray-900">
              Ticket Manager
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-3 py-1.5 rounded-lg group"
                >
                  <div
                    className={cn(
                      'flex items-center space-x-1.5 transition-all duration-200',
                      isActive
                        ? 'text-blue-600'
                        : 'text-gray-600 group-hover:text-gray-900'
                    )}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gray-50 opacity-0 group-hover:opacity-100 rounded-lg -z-10 transition-opacity duration-200" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
