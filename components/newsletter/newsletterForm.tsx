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
    <form action={handleSubmit} className="mt-8 space-y-4">
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="w-full text-lg py-6 appearance-none rounded-md px-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your email"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="w-full text-lg py-6 inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? 'Processing...' : 'Subscribe Now - $99/month'}
        <ArrowRight className="ml-2 h-5 w-5" />
      </button>
      {message && (
        <p className={`mt-2 text-sm ${message.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}