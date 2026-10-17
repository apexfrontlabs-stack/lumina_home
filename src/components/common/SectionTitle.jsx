export function SectionTitle({ eyebrow, title, subtitle, align = 'center', className = '' }) {
  const alignment = align === 'center' ? 'text-center mx-auto' : 'text-left'

  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow && (
        <p className="mb-3 font-sans text-xs font-medium uppercase tracking-extreme text-brand-gold">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-4xl text-brand-dark md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 font-sans text-sm text-brand-gray">{subtitle}</p>}
    </div>
  )
}