import React from 'react';
import { Sparkles, Heart, ShieldCheck, Diamond } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Our Heritage & Mission
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-burgundy-500 mb-4">
            About GLIMMER & Grace
          </h1>
          <p className="text-sm sm:text-base text-charcoal/80 max-w-xl mx-auto leading-relaxed">
            Born out of a deep reverence for South Asian beauty, regal heritage, and modern dermatological science.
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush-200 shadow-luxury space-y-8 text-xs sm:text-sm text-charcoal/85 leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold text-burgundy-500">
                Beauty & Beyond
              </h2>
              <p>
                Founded in Dhaka, GLIMMER & Grace is a luxury cosmetics and jewellery brand dedicated to empowering women to embrace their authentic beauty. We believe makeup should enhance your natural radiance rather than conceal it, and jewellery should carry the weight of timeless memories.
              </p>
              <p>
                Every skincare formula is rigorously tested for our local climate—combating tropical humidity, sun exposure, and seasonal dryness while remaining 100% cruelty-free and paraben-free.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-md border-2 border-blush-200 aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
                alt="Brand Founder & Aesthetics"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-blush-200 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-blush-50 rounded-2xl border border-blush-200 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-gold-600 mx-auto" />
              <h3 className="font-serif font-bold text-sm text-burgundy-500">100% Authentic</h3>
              <p className="text-xs text-charcoal-muted">Sourced directly from verified global & local artisans.</p>
            </div>

            <div className="p-4 bg-blush-50 rounded-2xl border border-blush-200 text-center space-y-2">
              <Diamond className="w-6 h-6 text-gold-600 mx-auto" />
              <h3 className="font-serif font-bold text-sm text-burgundy-500">Artisanal Craft</h3>
              <p className="text-xs text-charcoal-muted">22K micro-plated gold and real cultured baroque pearls.</p>
            </div>

            <div className="p-4 bg-blush-50 rounded-2xl border border-blush-200 text-center space-y-2">
              <Heart className="w-6 h-6 text-gold-600 mx-auto" />
              <h3 className="font-serif font-bold text-sm text-burgundy-500">Clean Formulations</h3>
              <p className="text-xs text-charcoal-muted">Gentle, hypoallergenic, and never tested on animals.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
