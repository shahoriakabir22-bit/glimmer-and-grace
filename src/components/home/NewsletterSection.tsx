import React, { useState } from 'react';
import { Mail, CheckCircle, Sparkles } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <section className="py-16 bg-gradient-blush border-b border-blush-200 relative overflow-hidden">
      {/* Decorative rose background orbs */}
      <div className="absolute top-0 right-10 w-72 h-72 rounded-full bg-rose-200/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 rounded-full bg-gold-200/40 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 text-burgundy-600 text-xs font-semibold mb-3 border border-blush-300">
          <Sparkles className="w-3.5 h-3.5 text-gold-500" />
          <span>Exclusive VIP Perks</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-burgundy-500">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-xs sm:text-sm text-charcoal/80 max-w-lg mx-auto mt-2 mb-8">
          Get the latest secret offers, new collection launches, and bespoke beauty tips straight to your inbox.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold animate-in zoom-in-95 duration-200">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <span>Thank you for joining GLIMMER & Grace! Enjoy 10% off your next purchase.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3.5 rounded-full text-xs sm:text-sm bg-white border border-blush-300 focus:outline-none focus:ring-2 focus:ring-gold-500/50 text-charcoal shadow-sm"
              />
              <Mail className="w-4 h-4 text-charcoal-muted absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white font-semibold rounded-full text-xs uppercase tracking-widest transition-colors shadow-md shrink-0"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="text-[11px] text-charcoal-muted mt-4">
          We respect your privacy. No spam ever — unsubscribe at any time.
        </p>
      </div>
    </section>
  );
};
