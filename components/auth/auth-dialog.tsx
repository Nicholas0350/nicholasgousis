'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  InnerDialog,
  InnerDialogTrigger,
  InnerDialogContent,
  InnerDialogHeader,
  InnerDialogFooter,
  InnerDialogTitle,
  InnerDialogDescription,
} from "@/components/ui/nested-dialog";

export function AuthDialog() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      router.push('/dashboard');
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setShowSuccessMessage(false);

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error instanceof Error ? error.message : 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-space-grotesk text-[0.875rem] tracking-[-0.02em] relative text-white hover:bg-white/10 transition-colors disabled:opacity-50">
          {isLoading ? 'Please wait...' : 'Login'}
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-space-grotesk font-medium tracking-tight">Sign In</DialogTitle>
          <DialogDescription className="font-space-grotesk text-sm text-neutral-400">
            Enter your email and password to access your account
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSignIn} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}
        </form>

        <DialogFooter className="flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
          <div className="flex flex-col gap-2 sm:flex-row">
            <InnerDialog>
              <InnerDialogTrigger asChild>
                <Button variant="outline" type="button">
                  Forgot Password?
                </Button>
              </InnerDialogTrigger>
              <InnerDialogContent>
                <InnerDialogHeader>
                  <InnerDialogTitle className="font-space-grotesk font-medium tracking-tight">Reset Password</InnerDialogTitle>
                  <InnerDialogDescription className="font-space-grotesk text-sm text-neutral-400">
                    Enter your email to receive a password reset link
                  </InnerDialogDescription>
                </InnerDialogHeader>

                <form onSubmit={handlePasswordReset} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-sm text-red-500">
                      {error}
                    </div>
                  )}
                  {showSuccessMessage && (
                    <div className="rounded-md bg-green-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-800">
                            Password reset link sent! Check your email for instructions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </form>

                <InnerDialogFooter>
                  <Button
                    type="submit"
                    onClick={handlePasswordReset}
                    disabled={isLoading || showSuccessMessage}
                  >
                    {isLoading ? 'Sending...' : showSuccessMessage ? 'Link Sent!' : 'Send Reset Link'}
                  </Button>
                </InnerDialogFooter>
              </InnerDialogContent>
            </InnerDialog>

            <a
              href="/newsletter"
              className="inline-flex items-center justify-center font-space-grotesk text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Not a subscriber? Sign up for the newsletter
            </a>
          </div>

          <Button type="submit" onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}