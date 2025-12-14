import { Card } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6" hover={false} delay={i * 0.05}>
          <div className="space-y-4">
            {/* Title and status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                <Skeleton className="w-5 h-5 rounded-full" />
                <Skeleton className="h-6 w-2/3" />
              </div>
              <Skeleton className="w-24 h-6 rounded-full" />
            </div>

            {/* Description */}
            <div className="ml-8 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            {/* Tags */}
            <div className="ml-8 flex gap-2">
              <Skeleton className="w-20 h-7 rounded-full" />
              <Skeleton className="w-24 h-7 rounded-full" />
              <Skeleton className="w-16 h-7 rounded-full" />
            </div>

            {/* Footer */}
            <div className="ml-8 flex gap-4 pt-2">
              <Skeleton className="w-12 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
