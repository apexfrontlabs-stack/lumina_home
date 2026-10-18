
export function Skeleton({ className = '', ...rest }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-neutral-200 ${className}`}
      {...rest}
    />
  )
}
