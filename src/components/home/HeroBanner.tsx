import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Diamond } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-blush py-12 md:py-20 lg:py-24 border-b border-blush-200">
      {/* Subtle decorative circles */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-gold-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-gold-400/40 shadow-xs">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-burgundy-600">
                DISCOVER YOUR NATURAL BEAUTY
              </span>
            </div>

            {/* Serif Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-charcoal tracking-tight leading-[1.15]">
              Premium Cosmetics <br />
              <span className="font-light italic text-rose-dark">&</span>{' '}
              <span className="text-gradient-burgundy">Exquisite Jewellery</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-charcoal-light font-normal max-w-xl mx-auto lg:mx-0">
              Feel beautiful. Look elegant. Be you. Indulge in certified skincare, velvet lip shades, and regal 22K gold & pearl jewellery crafted for every moment.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/cosmetics"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-luxury hover:opacity-95 text-white font-semibold rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-luxury hover:shadow-luxury-hover transition-all group"
              >
                <span>Shop Cosmetics</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/jewellery"
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gold-50 text-burgundy-600 border border-gold-500/50 font-semibold rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Diamond className="w-4 h-4 text-gold-600" />
                <span>Explore Jewellery</span>
              </Link>
            </div>

            {/* Stats preview */}
            <div className="pt-6 border-t border-blush-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-burgundy-500">100%</div>
                <div className="text-[11px] text-charcoal-muted uppercase">Authentic</div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-burgundy-500">10,000+</div>
                <div className="text-[11px] text-charcoal-muted uppercase">Happy Brides</div>
              </div>
              <div>
                <div className="font-serif text-xl sm:text-2xl font-bold text-burgundy-500">7 Days</div>
                <div className="text-[11px] text-charcoal-muted uppercase">Easy Return</div>
              </div>
            </div>

          </div>

          {/* Right Showcase Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Luxury Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-gold-400/40 bg-white">
                <img
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
                  alt="Glimmer and Grace Luxury Model"
                  className="w-full h-[460px] object-cover object-center"
                />
                
                {/* Floating offer pill */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-blush-200 shadow-luxury flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest block">
                      Limited Bridal Offer
                    </span>
                    <span className="font-serif font-bold text-sm text-burgundy-500">
                      Up to 30% Off Sets
                    </span>
                  </div>
                  <Link
                    to="/shop?filter=offers"
                    className="px-4 py-2 bg-burgundy-500 text-white rounded-xl text-xs font-semibold hover:bg-burgundy-600 transition-colors"
                  >
                    View Offer
                  </Link>
                </div>
              </div>

              {/* Floating gold emblem pill */}
              <div className="hidden sm:flex absolute -top-4 -left-6 bg-white p-3 rounded-2xl shadow-luxury border border-gold-300/80 items-center gap-3">
                <img src="/images/logo.png" alt="Logo" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-xs font-bold text-burgundy-500 font-serif">GLIMMER & Grace</p>
                  <p className="text-[9px] text-gold-600 font-semibold uppercase tracking-wider">Beauty & Beyond</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
