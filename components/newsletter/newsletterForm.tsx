'use client'

import { useState } from 'react';
import { subscribeToNewsletter, sendVerificationEmail } from '@/app/actions/resend';
import { ArrowRight } from 'lucide-react';

export default function NewsletterSignup() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const email = formData.get('email') as string;

    // Generate verification URL (adjust based on your needs)
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?email=${encodeURIComponent(email)}`;

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationUrl);
    if (emailResult.error) {
      setMessage(emailResult.error);
    } else {
      // Subscribe to newsletter
      const result = await subscribeToNewsletter(formData);
      if (result.success) {
        setMessage('Please check your email to verify your subscription');
      } else {
        setMessage(result.error || 'An error occurred');
      }
    }

    setIsLoading(false);
  }

  return (
    <form action={handleSubmit} className="mt-8  space-y-4">
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
        {isLoading ? 'Subscribing...' : 'Subscribe Now'}
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