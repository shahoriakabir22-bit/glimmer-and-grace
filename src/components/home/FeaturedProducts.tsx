import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { ProductCard } from '../common/ProductCard';
import { QuickViewModal } from '../common/QuickViewModal';
import { Product } from '../../types/product';

export const FeaturedProducts: React.FC = () => {
  const { products, loading } = useProducts();
  const [activeTab, setActiveTab] = useState<'bestseller' | 'new' | 'all'>('bestseller');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => {
    if (activeTab === 'bestseller') return p.isBestSeller;
    if (activeTab === 'new') return p.isNewArrival;
    return true;
  }).slice(0, 5);

  return (
    <section className="py-16 md:py-20 bg-white border-b border-blush-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-gold-600 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Most Loved Products</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
              Best Sellers
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-1 bg-blush-100 rounded-full flex gap-1">
              <button
                onClick={() => setActiveTab('bestseller')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'bestseller'
                    ? 'bg-burgundy-500 text-white shadow-xs'
                    : 'text-charcoal hover:text-burgundy-500'
                }`}
              >
                Best Sellers
              </button>
              <button
                onClick={() => setActiveTab('new')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'new'
                    ? 'bg-burgundy-500 text-white shadow-xs'
                    : 'text-charcoal hover:text-burgundy-500'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === 'all'
                    ? 'bg-burgundy-500 text-white shadow-xs'
                    : 'text-charcoal hover:text-burgundy-500'
                }`}
              >
                All Products
              </button>
            </div>

            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-burgundy-500 hover:text-burgundy-600 ml-4 group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="rounded-2xl bg-blush-50 h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-burgundy-500 hover:underline"
          >
            <span>View All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  );
};
