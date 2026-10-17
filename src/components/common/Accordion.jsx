import { ChevronDown } from 'lucide-react'

export function Accordion({ items = [], className = '' }) {
  return (
    <div className={`divide-y divide-neutral-200 border-y border-neutral-200 font-sans ${className}`}>
      {items.map((item) => (
        <details key={item.title} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-brand-dark">
            {item.title}
            <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-brand-gray">{item.content}</p>
        </details>
      ))}
    </div>
  )
}