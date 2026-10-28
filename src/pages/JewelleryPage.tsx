import React from 'react';
import { CategoryView } from '../components/catalog/CategoryView';

export const JewelleryPage: React.FC = () => {
  return (
    <CategoryView
      category="jewellery"
      title="Exquisite Jewellery"
      subtitle="Elegance in Every Detail. Handcrafted earrings, bridal necklaces, rings & bracelets."
      bannerImage="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80"
    />
  );
};
