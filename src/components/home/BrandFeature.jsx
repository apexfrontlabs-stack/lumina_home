import { Container } from '../common/Container'

export function BrandFeatures({ features = [] }) {
  return (
    <section className="border-y border-neutral-200 bg-white py-12">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-4 font-sans">
            <Icon size={28} strokeWidth={1.25} className="shrink-0 text-brand-gold" />
            <div>
              <h3 className="text-xs font-medium uppercase tracking-widest text-brand-dark">{title}</h3>
              <p className="mt-1 text-sm text-brand-gray">{text}</p>
            </div>
          </div>
        ))}
      </Container>
    </section>
  )
}