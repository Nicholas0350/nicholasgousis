'use client'

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterSignup() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setMessage('');

    const email = formData.get('email') as string;

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error;
        } catch {
          errorMessage = errorText;
        }
        throw new Error(errorMessage || 'Failed to create checkout session');
      }

      const data = await response.json();

      if (!data.url) {
        throw new Error('Invalid checkout URL received');
      }

      window.location.href = data.url;

    } catch (error) {
      console.error('Subscription error:', error);
      setMessage(error instanceof Error ? error.message : 'Failed to start subscription');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="mt-18 sm:mt-20 md:mt-24 space-y-4 max-w-md mx-auto">
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="font-heading text-[13px] sm:text-sm md:text-base w-full py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 appearance-none rounded-full border border-gray-700 bg-[#1a1a1a] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your email"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="font-heading font-bold text-[13px] sm:text-sm md:text-base text-white py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded-full inline-flex items-center space-x-2 border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 w-full justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
      >
        {isLoading ? 'Processing...' : 'Subscribe Now - $99/month'}
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}