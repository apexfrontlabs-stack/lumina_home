
import { Skeleton } from './Skeleton'

export function ProductCardSkeleton() {
  return (
    <div className="min-w-0">
      <Skeleton className="aspect-[4/5] w-full rounded-lg" />

      <div className="space-y-3 pt-4">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />

        <div className="flex gap-2 pt-1">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 w-10 rounded-md" />
        </div>
      </div>
    </div>
  )
}
