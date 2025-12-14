import { motion } from 'framer-motion';
import { Container } from '../components/layout';
import { TagGrid } from '../components/tags';
import { Skeleton } from '../components/ui';
import { Card } from '../components/ui/Card';
import { useTags } from '../hooks';

export function TagsPage() {
  const { data: tags, isLoading, error } = useTags();

  if (error) {
    return (
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border border-red-200"
        >
          <p className="text-red-800">Error loading tags: {(error as Error).message}</p>
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
            Tags
          </h1>
          <p className="text-lg text-gray-600">
            {isLoading ? 'Loading...' : `${tags?.length || 0} total tags`}
          </p>
        </motion.div>

        {/* Tags Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6" hover={false}>
                <div className="flex items-start space-x-4">
                  <Skeleton className="w-14 h-14 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <TagGrid tags={tags || []} />
        )}
      </div>
    </Container>
  );
}
