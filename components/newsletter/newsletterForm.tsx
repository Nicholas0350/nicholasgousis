'use client'

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface NewsletterSignupProps {
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export default function NewsletterSignup({ onSubmit, isLoading }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');

  async function handleSubmit(formData: FormData) {
    const emailValue = formData.get('email') as string;
    if (!emailValue || !emailValue.includes('@')) {
      return;
    }
    await onSubmit(emailValue);
  }

  return (
    <form action={handleSubmit} className="mt-18 sm:mt-20 md:mt-24 space-y-4 max-w-md mx-auto">
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="font-heading text-center text-[13px] sm:text-sm md:text-base w-full py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 appearance-none rounded-full border border-gray-700 bg-[#1a1a1a] placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your email"
      />
      <button
        type="submit"
        disabled={isLoading || !email}
        className="font-heading font-bold text-[13px] sm:text-sm md:text-base text-white py-1.5 sm:py-2 md:py-3 px-3 sm:px-4 md:px-6 rounded-full inline-flex items-center space-x-2 border-gray-700 bg-gradient-to-r from-blue-500 to-purple-500 w-full justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Processing...' : 'Subscribe Now - $77/month'}
        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
      </button>
    </form>
  );
}