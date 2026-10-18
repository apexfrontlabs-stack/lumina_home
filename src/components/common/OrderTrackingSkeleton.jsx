
import { Skeleton } from './Skeleton'

export default function OrderTrackingSkeleton() {
  return (
    <section
      aria-label="Loading order tracking"
      className="mt-8 rounded-lg border border-neutral-200 p-5 sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-4 w-28" />
      </div>

      <ol className="mt-8 space-y-8">
        {Array.from({ length: 5 }, (_, index) => (
          <li key={index} className="flex gap-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />

            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
