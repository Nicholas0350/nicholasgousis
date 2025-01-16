import Image from 'next/image'
import { cn } from '@/lib/utils'
import { spaceGrotesk } from '@/lib/fonts'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface StrategyCallButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  calUsername?: string
}

export function StrategyCallButton({
  className,
  calUsername = "nicholasgousis",
  ...props
}: StrategyCallButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleBooking = async () => {
    try {
      setIsLoading(true)
      const calUrl = `https://cal.com/${calUsername}/30min`
      window.open(calUrl, '_blank')?.focus()
      // Add a small delay before resetting loading state
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error) {
      console.error('Failed to open calendar:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleBooking}
      disabled={isLoading}
      className={cn(
        "group flex items-center gap-3 rounded-full bg-white px-7 py-4",
        "shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300",
        "hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:scale-[1.02]",
        "hover:bg-gray-50/80 disabled:opacity-70 disabled:hover:scale-100",
        spaceGrotesk.className,
        className
      )}
      {...props}
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-100 transition-transform duration-300 group-hover:scale-110 group-hover:border-gray-200">
        <Image
          src="/profile-pic.jpg"
          alt="Profile picture"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <span className="flex items-center gap-2 text-[1.1rem] font-medium tracking-tight text-gray-900 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gray-800">
        {isLoading ? (
          <>
            Opening Calendar
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          'Claim Your Free Strategy Call Now'
        )}
      </span>
    </button>
  )
}