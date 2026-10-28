import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-ivory-200 min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600 block mb-1">
            We'd Love to Hear from You
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-burgundy-500 mb-4">
            Contact GLIMMER & Grace
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/80 max-w-lg mx-auto">
            Have questions about jewellery customization, shade matching, or your parcel delivery? Our concierge is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-blush-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-burgundy-500 pb-4 border-b border-blush-200">
              Showroom & Concierge
            </h2>

            <div className="space-y-4 text-xs text-charcoal/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-burgundy-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-charcoal">Flagship Lounge</h3>
                  <p className="mt-0.5">Level 4, Navana Tower, Gulshan-1, Dhaka 1212, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-burgundy-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-charcoal">Phone & WhatsApp Helpline</h3>
                  <p className="mt-0.5 font-semibold text-burgundy-600">+880 1712 345678</p>
                  <p className="text-[11px] text-charcoal-muted">Available 10:00 AM – 10:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-burgundy-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-charcoal">Official Email</h3>
                  <p className="mt-0.5">info@glimmergrace.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-burgundy-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-charcoal">Operating Hours</h3>
                  <p className="mt-0.5">Sunday – Saturday: 10:00 AM – 10:00 PM</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blush-50 rounded-2xl border border-blush-200 text-xs">
              <span className="font-bold text-burgundy-600 block mb-1">Bridal Consultation</span>
              <p className="text-charcoal/80">
                Planning your wedding jewellery? Schedule a personalized appointment with our lead styling consultant.
              </p>
            </div>
          </div>

          {/* Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-blush-200 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-burgundy-500 mb-6">
              Send Us a Message
            </h2>

            {submitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h3 className="font-serif font-bold text-lg">Message Received!</h3>
                <p className="text-xs">
                  Thank you for reaching out. One of our beauty advisors will connect with you via phone or email shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 bg-emerald-700 text-white rounded-full text-xs font-semibold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-charcoal mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tania Islam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="01712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-charcoal mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-charcoal mb-1">How can we assist you? *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the products or questions you have..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white rounded-full font-bold uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
