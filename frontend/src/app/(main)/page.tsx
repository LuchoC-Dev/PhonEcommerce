import { HeroSection } from '@features/home/components/HeroSection'
import { FeaturedProducts } from '@features/home/components/FeaturedProducts'
import { CategoryHighlights } from '@features/home/components/CategoryHighlights'
import { StatsBar } from '@features/home/components/StatsBar'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryHighlights />
      <StatsBar />
    </>
  )
}