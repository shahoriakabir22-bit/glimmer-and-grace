import React from 'react';
import { CategoryView } from '../components/catalog/CategoryView';

export const CosmeticsPage: React.FC = () => {
  return (
    <CategoryView
      category="cosmetics"
      title="Cosmetics & Skincare"
      subtitle="Skincare, Makeup, Lipstick & More formulated for radiant, natural South Asian beauty."
      bannerImage="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
    />
  );
};
