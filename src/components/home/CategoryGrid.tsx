import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid: React.FC = () => {
  const categories = [
    {
      title: 'Skincare',
      subtitle: 'Glow naturally',
      image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
      path: '/cosmetics?sub=skincare'
    },
    {
      title: 'Makeup',
      subtitle: 'Express yourself',
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
      path: '/cosmetics?sub=makeup'
    },
    {
      title: 'Lipstick',
      subtitle: 'Color your world',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80',
      path: '/cosmetics?sub=lipstick'
    },
    {
      title: 'Jewellery',
      subtitle: 'Timeless elegance',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
      path: '/jewellery'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Handpicked Curations
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            Explore our exclusive collections crafted with purest ingredients and artisanal excellence.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.path}
              className="group relative rounded-3xl overflow-hidden bg-white border border-blush-200 shadow-sm hover:shadow-luxury-hover hover:border-gold-400 transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden bg-ivory-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex items-center justify-between bg-white flex-1">
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal group-hover:text-burgundy-500 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold text-rose-dark group-hover:text-burgundy-500 transition-colors">
                  <span>Shop</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};
