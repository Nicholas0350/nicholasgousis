'use client'

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NewsletterSignupProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
}

export default function NewsletterSignup({ onSubmit, isLoading, error }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  async function handleSubmit(formData: FormData) {
    const emailValue = formData.get('email') as string;
    if (!emailValue || !emailValue.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }
    setValidationError('');
    await onSubmit(emailValue);
  }

  return (
    <form action={handleSubmit} className="mt-18 sm:mt-20 md:mt-24 space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setValidationError('');
          }}
          className={`font-heading text-center text-sm sm:text-base w-full py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 appearance-none rounded-full border ${
            validationError || error ? 'border-red-500' : 'border-gray-700'
          } bg-[#1a1a1a] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          placeholder="Enter your email"
        />
        {(validationError || error) && (
          <p className="text-red-500 text-sm text-center">{validationError || error}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isLoading || !email}
        className="font-heading font-bold text-xs sm:text-sm md:text-base text-white py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded-full inline-flex items-center space-x-2 border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 w-full justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center">
            Processing...
            <svg className="animate-spin ml-2 h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        ) : (
          <>
            Subscribe Now - $77/month
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </>
        )}
      </button>
    </form>
  );
}