import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Tag } from 'lucide-react';

export const SpecialOfferBanner: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-ivory-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blush-200 via-blush-300 to-rose-200 border border-blush-300 p-8 sm:p-12 shadow-luxury">
          
          {/* Subtle background glow */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold-400/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Offer Text */}
            <div className="md:col-span-7 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-burgundy-600 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Tag className="w-3.5 h-3.5 text-gold-600" />
                <span>Special Festive Offer</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-500 leading-tight">
                Get Up to 30% OFF <br />
                <span className="text-charcoal font-normal text-2xl sm:text-3xl lg:text-4xl block mt-1">
                  On Selected Cosmetics & Jewellery
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-charcoal/80 max-w-lg mx-auto md:mx-0">
                Elevate your daily glam or wedding wardrobe with our limited-edition discount sets. Use code <strong className="text-burgundy-600 font-bold">BEAUTY30</strong> at checkout.
              </p>

              <div className="pt-2">
                <Link
                  to="/shop?filter=offers"
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-md transition-all group"
                >
                  <span>Shop Offers Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Offer Badge & Visual Collage */}
            <div className="md:col-span-5 flex items-center justify-center md:justify-end gap-4">
              
              {/* Circular Flat 30% OFF badge */}
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-burgundy-500 text-white flex flex-col items-center justify-center p-3 text-center shadow-xl ring-4 ring-gold-400/80 transform hover:scale-105 transition-transform shrink-0">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-medium text-gold-300">FLAT</span>
                <span className="font-serif text-2xl sm:text-3xl font-extrabold leading-none my-0.5">30%</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold">OFF</span>
              </div>

              {/* Showcase Image */}
              <div className="w-40 sm:w-48 aspect-square rounded-2xl overflow-hidden shadow-xl border-2 border-white shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80"
                  alt="Special Offer Bundle"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
