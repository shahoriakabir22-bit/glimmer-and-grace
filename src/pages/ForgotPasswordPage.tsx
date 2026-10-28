import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await resetPassword(email.trim());
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password reset email. Please try again.';
      setError(msg.replace('Firebase: ', ''));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory-200 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-4 bg-white rounded-3xl p-8 border border-blush-200 shadow-luxury">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted hover:text-burgundy-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>

        <h1 className="font-serif text-2xl font-bold text-burgundy-500 mb-2">
          Reset Your Password
        </h1>
        <p className="text-xs text-charcoal-muted mb-6">
          Enter your registered email address below. We'll send you an encrypted link to reset your password.
        </p>

        {submitted ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Reset Email Sent</span>
            </div>
            <p>
              Please check your inbox at <strong>{email}</strong> for instructions to reset your password.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-blush-50 border border-blush-300 text-xs text-charcoal focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <Mail className="w-4 h-4 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-burgundy-500 hover:bg-burgundy-600 text-white font-bold rounded-2xl text-xs uppercase tracking-widest transition-all shadow-md disabled:opacity-50"
            >
              <span>{submitting ? 'Sending Link...' : 'Send Reset Link'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
