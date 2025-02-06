import { redirect } from 'next/navigation'

export default function NewsletterConfirm({
  searchParams,
}: {
  searchParams: { email?: string }
}) {
  if (!searchParams.email) {
    redirect('/')
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-4 text-3xl font-bold">Subscription Confirmed!</h1>
        <p className="mb-4 text-gray-600">
          Thank you for confirming your subscription to our newsletter. You'll now receive updates about ASIC Financial Services.
        </p>
        <a
          href="/"
          className="text-blue-600 hover:text-blue-800"
        >
          Return to Homepage
        </a>
      </div>
    </div>
  )
}