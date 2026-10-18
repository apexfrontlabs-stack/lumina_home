import { useLayoutEffect, useRef, useState } from 'react'
import { Skeleton } from './Skeleton'

export function ProductImage({
  src,
  alt,
  loading = 'lazy',
  className = '',
}) {
  const imageRef = useRef(null)
  const [status, setStatus] = useState('loading')

  useLayoutEffect(() => {
    const image = imageRef.current

    if (!image) return

    if (image.complete) {
      setStatus(image.naturalWidth > 0 ? 'loaded' : 'error')
    } else {
      setStatus('loading')
    }
  }, [src])

  return (
    <div className={`relative overflow-hidden bg-stone-100 ${className}`}>
      {status === 'loading' && (
        <Skeleton className="absolute inset-0 z-10 h-full w-full rounded-none" />
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-neutral-500">
          Image unavailable
        </div>
      )}

      <img
        ref={imageRef}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          status === 'loaded' ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}