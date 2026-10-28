import React from 'react';
import { CategoryView } from '../components/catalog/CategoryView';

export const ProductListingPage: React.FC = () => {
  return (
    <CategoryView
      title="All Collections"
      subtitle="Discover our complete range of certified cosmetics and handcrafted luxury jewellery."
      bannerImage="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    />
  );
};
