import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '../components/layout';
import { FilterPanel, TicketList, LoadingSkeleton } from '../components/tickets';
import { useTickets } from '../hooks';

export function TicketsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string>('');

  const { data: tickets, isLoading, error } = useTickets({
    search: search || undefined,
    status,
    tags: selectedTags || undefined,
  });

  if (error) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-red-200"
        >
          <p className="text-red-800">Error loading tickets: {(error as Error).message}</p>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center pt-8 pb-4"
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Tickets
          </h1>
          <p className="text-lg text-gray-600">
            {isLoading ? 'Loading...' : `${tickets?.length || 0} total tickets`}
          </p>
        </motion.div>

        {/* Filters */}
        <FilterPanel
          search={search}
          status={status}
          selectedTags={selectedTags}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          onTagsChange={setSelectedTags}
        />

        {/* Tickets List */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <TicketList tickets={tickets || []} />
        )}
      </div>
    </Container>
  );
}
