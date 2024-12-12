import Link from "next/link"
import { Shield } from 'lucide-react'

export function NewsletterFooter() {
  return (
    <footer className="border-t bg-gray-100 dark:bg-gray-800">
      <div className="container flex flex-col gap-4 px-4 py-6 md:px-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span className="font-semibold">ASIC Compliance Insider</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Expert insights for AFSL & ACL compliance
          </p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-4 text-sm">
            <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
              Privacy Policy
            </Link>
            <Link className="text-gray-500 hover:underline dark:text-gray-400" href="#">
              Terms of Service
            </Link>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 ASIC Compliance Insider
          </div>
        </div>
      </div>
    </footer>
  )
}