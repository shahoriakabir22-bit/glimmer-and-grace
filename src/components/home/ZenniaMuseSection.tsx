import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Crown, ArrowRight, Diamond } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export const ZenniaMuseSection: React.FC = () => {
  const { settings } = useSiteSettings();

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-white via-blush-100/60 to-ivory-200 border-b border-blush-200 relative overflow-hidden">
      {/* Decorative ambient lights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-rose-300/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-300/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main luxury tribute card */}
        <div className="relative rounded-3xl overflow-hidden bg-white/90 backdrop-blur-md border-2 border-gold-400/60 shadow-luxury p-8 sm:p-12 lg:p-16 ring-1 ring-gold-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left: Romantic & Royal Muse Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">
                
                {/* Gold glowing frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-4 ring-gold-400/70 aspect-[4/5] bg-blush-100 group">
                  <img
                    src={settings.zenniaImageUrl || "/images/zennia.png"}
                    alt="Zennia — The Muse of Glimmer & Grace"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Floating royal badge on portrait */}
                  <div className="absolute top-4 left-4 bg-burgundy-500/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                    <Crown className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      The Royal Muse
                    </span>
                  </div>

                  {/* Bottom glass dedication tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-gold-300/60 shadow-lg text-center">
                    <span className="font-serif text-lg font-bold text-burgundy-500 block">
                      Zennia
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-gold-600 block">
                      Inspiration of Endless Radiance
                    </span>
                  </div>
                </div>

                {/* Decorative heart badge */}
                <div className="absolute -bottom-3 -right-3 w-14 h-14 rounded-full bg-gradient-luxury text-white flex items-center justify-center shadow-luxury ring-4 ring-white animate-bounce duration-1000">
                  <Heart className="w-6 h-6 text-rose-300 fill-current" />
                </div>

              </div>
            </div>

            {/* Right: Dedication Narrative & Collection Highlights */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blush-200/80 border border-gold-400/50 shadow-xs">
                <Sparkles className="w-4 h-4 text-gold-600" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-burgundy-600">
                  {settings.zenniaBadge || 'Bespoke Signature Tribute'}
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-burgundy-500 leading-tight">
                {settings.zenniaTitle} <br />
                <span className="font-light italic text-rose-dark text-2xl sm:text-3xl lg:text-4xl">
                  {settings.zenniaSubtitle}
                </span>
              </h2>

              <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {settings.zenniaDescription}
              </p>

              {/* Romantic quote pill */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blush-50 via-white to-blush-50 border border-blush-300/80 shadow-xs max-w-xl mx-auto lg:mx-0 text-left">
                <p className="text-xs sm:text-sm font-serif italic text-burgundy-600 leading-snug">
                  {settings.zenniaQuote}
                </p>
                <p className="text-[10px] text-charcoal-muted uppercase font-semibold tracking-wider mt-1.5 text-right">
                  — {settings.zenniaDedicatedBy}
                </p>
              </div>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto lg:mx-0 pt-2 text-center lg:text-left">
                <div className="p-3 bg-blush-50 rounded-2xl border border-blush-200">
                  <Diamond className="w-4 h-4 text-gold-600 mx-auto lg:mx-0 mb-1" />
                  <p className="font-serif font-bold text-xs text-charcoal">{settings.zenniaPillar1Title}</p>
                  <p className="text-[10px] text-charcoal-muted">{settings.zenniaPillar1Desc}</p>
                </div>
                <div className="p-3 bg-blush-50 rounded-2xl border border-blush-200">
                  <Crown className="w-4 h-4 text-gold-600 mx-auto lg:mx-0 mb-1" />
                  <p className="font-serif font-bold text-xs text-charcoal">{settings.zenniaPillar2Title}</p>
                  <p className="text-[10px] text-charcoal-muted">{settings.zenniaPillar2Desc}</p>
                </div>
                <div className="p-3 bg-blush-50 rounded-2xl border border-blush-200">
                  <Heart className="w-4 h-4 text-rose-500 mx-auto lg:mx-0 mb-1 fill-current" />
                  <p className="font-serif font-bold text-xs text-charcoal">{settings.zenniaPillar3Title}</p>
                  <p className="text-[10px] text-charcoal-muted">{settings.zenniaPillar3Desc}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/jewellery"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-luxury hover:opacity-95 text-white font-bold rounded-full text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-luxury transition-all"
                >
                  <Crown className="w-4 h-4 text-gold-400" />
                  <span>Explore Zennia's Jewels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/cosmetics"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-blush-100 text-burgundy-600 border border-blush-300 font-bold rounded-full text-xs uppercase tracking-wider transition-colors"
                >
                  <span>Zennia Radiance Skincare</span>
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
