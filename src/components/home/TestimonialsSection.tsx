import React from 'react';
import { Star, Quote } from 'lucide-react';
import { SAMPLE_TESTIMONIALS } from '../../data/sampleReviews';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-blush-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            Verified Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
            What Our Customers Say
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-2">
            Real stories, real happiness from women across Dhaka, Chittagong, Sylhet, and beyond.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_TESTIMONIALS.slice(0, 3).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-ivory-100 rounded-3xl p-6 sm:p-8 border border-blush-200/80 shadow-sm hover:shadow-luxury transition-all relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-rose-300 absolute top-6 right-6 opacity-60" />

              <div>
                {/* 5-Star Rating */}
                <div className="flex text-amber-400 gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-charcoal/85 italic leading-relaxed mb-6">
                  "{testimonial.comment}"
                </p>
              </div>

              {/* Customer Info */}
              <div className="flex items-center gap-3 pt-4 border-t border-blush-200/60">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-gold-400/50"
                />
                <div>
                  <h4 className="font-serif font-bold text-sm text-burgundy-500">
                    {testimonial.name}
                  </h4>
                  <p className="text-[11px] text-charcoal-muted">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
