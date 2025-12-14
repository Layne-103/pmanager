import { Skeleton } from '../ui/Skeleton';
import { Card } from '../ui/Card';

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="p-6" hover={false}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-24" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex gap-2 mt-4">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
