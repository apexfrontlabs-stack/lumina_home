import { useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

export function Drawer({ open, onClose, title, side = 'right', children, footer }) {
  const panelRef = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    if (open) panelRef.current?.focus()
  }, [open])

  const position = side === 'left' ? 'left-0' : 'right-0'
  const hidden = side === 'left' ? '-translate-x-full' : 'translate-x-full'

  return (
    <div className={`fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`} inert={!open}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
      />
      <aside
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onKeyDown={(e) => e.key === 'Escape' && onClose()}
        className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-white shadow-xl outline-none transition-transform duration-300 ${position} ${open ? 'translate-x-0' : hidden}`}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h3 className="font-serif text-2xl text-brand-dark">{title}</h3>
          <button type="button" onClick={onClose} aria-label={t('common.close')}>
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
        {footer && <div className="border-t border-neutral-200 px-6 py-4">{footer}</div>}
      </aside>
    </div>
  )
}