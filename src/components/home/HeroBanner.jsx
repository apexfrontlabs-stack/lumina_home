import { Button } from '../common/Button'

export function HeroBanner({ eyebrow, title, subtitle, image, ctaLabel, ctaHref = '/shop' }) {
  return (
    <section className="relative flex min-h-[70vh] items-center">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl text-white">
          {eyebrow && <p className="mb-4 font-sans text-xs uppercase tracking-extreme text-brand-gold">{eyebrow}</p>}
          <h1 className="font-serif text-5xl leading-tight md:text-7xl">{title}</h1>
          {subtitle && <p className="mt-6 font-sans text-sm leading-relaxed text-neutral-200">{subtitle}</p>}
          {ctaLabel && <Button variant="gold" size="lg" href={ctaHref} className="mt-8">{ctaLabel}</Button>}
        </div>
      </div>
    </section>
  )
}