'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function UnsubscribePage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const handleUnsubscribe = async () => {
    try {
      setStatus('loading');
      // Get email from URL query parameter
      const params = new URLSearchParams(window.location.search);
      const email = params.get('email');

      if (!email) {
        throw new Error('No email provided');
      }

      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to unsubscribe');
      }

      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="container max-w-lg min-h-[80vh] flex items-center justify-center py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Unsubscribe from Newsletter</CardTitle>
          <CardDescription>
            We&apos;re sorry to see you go. You can always subscribe again in the future.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'idle' && (
            <Button
              onClick={handleUnsubscribe}
              className="w-full"
            >
              Confirm Unsubscribe
            </Button>
          )}

          {status === 'loading' && (
            <Button disabled className="w-full">
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </Button>
          )}

          {status === 'success' && (
            <div className="text-center space-y-4">
              <Icons.check className="mx-auto h-8 w-8 text-green-500" />
              <p className="text-sm text-muted-foreground">
                You&apos;ve been successfully unsubscribed.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center space-y-4">
              <Icons.warning className="mx-auto h-8 w-8 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
              <Button
                variant="outline"
                onClick={() => setStatus('idle')}
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}