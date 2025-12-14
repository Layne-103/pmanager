import { Container } from '../components/layout';
import { useTags } from '../hooks';

export function TagsPage() {
  const { data: tags, isLoading, error } = useTags();

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading tags...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error loading tags: {(error as Error).message}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
          <p className="text-gray-600 mt-1">
            {tags?.length || 0} total tags
          </p>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <div
                key={tag.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: tag.color || '#e5e7eb',
                      }}
                    >
                      <span
                        className="text-lg font-bold"
                        style={{
                          color: tag.color ? '#fff' : '#374151',
                        }}
                      >
                        {tag.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {tag.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {tag.ticketCount} {tag.ticketCount === 1 ? 'ticket' : 'tickets'}
                      </p>
                    </div>
                  </div>
                </div>
                {tag.color && (
                  <div className="mt-3 text-xs text-gray-400 font-mono">
                    {tag.color}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No tags found</p>
              <p className="text-gray-400 text-sm mt-1">
                Create a new tag to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
