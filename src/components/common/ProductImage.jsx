import { useState } from 'react'
import { Skeleton } from './Skeleton'

export function ProductImage({
  src,
  alt,
  loading = 'lazy',
  className = '',
}) {
  const [failedSrc, setFailedSrc] = useState(null)
  const failed = failedSrc === src

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      <Skeleton className="absolute inset-0 h-full w-full rounded-none" />

      {failed ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-stone-100 text-sm text-neutral-500">
          Image unavailable
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={loading}
          onError={() => setFailedSrc(src)}
          className="relative z-10 h-full w-full object-cover"
        />
      )}
    </div>
  )
}