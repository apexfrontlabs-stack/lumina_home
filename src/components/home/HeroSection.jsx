import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { layoutAssetsData } from '../../data/layoutData'
import  Button  from '../common/Button'

export default function HeroSection() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <section className="relative isolate overflow-hidden bg-stone-100">
      <img
        src={layoutAssetsData.banners.hero1}
        alt={t('home.hero.image_alt')}
        className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        loading="eager"
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/70 via-neutral-950/30 to-neutral-950/10 lg:bg-gradient-to-r lg:from-neutral-950/60 lg:via-neutral-950/25 lg:to-transparent" />

      <div className="mx-auto flex min-h-[70dvh] max-w-7xl items-end px-5 pb-12 pt-24 sm:px-8 lg:min-h-[80dvh] lg:items-center lg:pb-0">
        <div className="max-w-xl text-white">
          <h1 className="font-serif text-4xl font-light leading-tight tracking-wide sm:text-5xl lg:text-6xl">
            {t('home.hero.title')}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            {t('home.hero.subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="button" variant="primary" size="md" onClick={() => navigate('/shop')}>
              {t('home.hero.shop_now')}
            </Button>
            <Link
              to="/shop?filter=new"
              className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/80"
            >
              {t('home.hero.see_new_arrivals')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}