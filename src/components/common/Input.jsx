import { useId } from 'react'

export function Input({ label, labelAction, error, className = '', id, ...rest }) {
  const autoId = useId()
  const inputId = id ?? autoId
  const errorId = `${inputId}-error`

  return (
    <div className={`font-sans ${className}`}>
      {(label || labelAction) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="block text-xs uppercase tracking-widest text-brand-gray">
              {label}
            </label>
          )}
          {labelAction}
        </div>
      )}
      <input
        id={inputId}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`w-full border bg-white px-4 py-3 text-sm text-brand-dark outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-dark ${
          error ? 'border-red-600' : 'border-neutral-300'
        }`}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}