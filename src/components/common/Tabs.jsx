import { useState } from 'react'

export function Tabs({ items = [], className = '' }) {
  const [active, setActive] = useState(0)

  return (
    <div className={`font-sans ${className}`}>
      <div role="tablist" className="flex gap-8 border-b border-neutral-200">
        {items.map((item, i) => (
          <button
            key={item.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 pb-3 text-xs uppercase tracking-widest transition-colors ${
              active === i ? 'border-brand-dark text-brand-dark' : 'border-transparent text-brand-gray hover:text-brand-dark'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="py-6 text-sm leading-relaxed text-brand-gray">
        {items[active]?.content}
      </div>
    </div>
  )
}