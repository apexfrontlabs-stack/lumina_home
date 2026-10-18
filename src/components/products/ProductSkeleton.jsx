
import {Skeleton} from '../common/Skeleton'

export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />

      <div className="space-y-3 pt-4">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  )
}
