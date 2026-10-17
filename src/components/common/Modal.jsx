import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

export function Modal({ open, onClose, title, children, className = '' }) {
  const dialogRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (open) dialogRef.current?.focus()
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className={`relative max-h-[90vh] w-full max-w-lg overflow-y-auto bg-white p-6 outline-none ${className}`}
      >
        <button type="button" onClick={onClose} aria-label={t('common.close')} className="absolute right-4 top-4 text-brand-dark">
          <X size={20} />
        </button>
        {title && <h3 className="mb-4 pr-8 font-serif text-2xl text-brand-dark">{title}</h3>}
        {children}
      </div>
    </div>
  )
}