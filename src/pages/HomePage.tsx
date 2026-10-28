import React from 'react';
import { HeroBanner } from '../components/home/HeroBanner';
import { ValueProps } from '../components/home/ValueProps';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ZenniaMuseSection } from '../components/home/ZenniaMuseSection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { SpecialOfferBanner } from '../components/home/SpecialOfferBanner';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { NewsletterSection } from '../components/home/NewsletterSection';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <HeroBanner />
      <ValueProps />
      <CategoryGrid />
      <ZenniaMuseSection />
      <FeaturedProducts />
      <SpecialOfferBanner />
      <TestimonialsSection />
      <NewsletterSection />
    </div>
  );
};
