import { Skeleton } from "@/components/ui/skeleton";

export function WorkfloorSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Tab bar skeleton */}
      <div className="flex gap-4 border-b pb-2">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm p-4 space-y-4"
          >
            <div className="flex justify-between items-center">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-6 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
