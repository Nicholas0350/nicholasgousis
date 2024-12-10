import Link from "next/link"
import { Bot } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-6 bg-tgv-dark-darker border-t border-tgv-dark-border">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Link className="flex items-center" href="#">
              <Bot className="h-6 w-6 text-tgv-primary mr-2" />
              <span className="text-lg font-bold text-tgv-dark-text">Nicholas Gousis</span>
            </Link>
            <p className="text-sm text-tgv-secondary">
              Revolutionizing financial strategies with AI-powered solutions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-tgv-dark-text">Services</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-tgv-secondary hover:text-tgv-primary">AI Solutions</Link></li>
                <li><Link href="#" className="text-sm text-tgv-secondary hover:text-tgv-primary">MVP Development</Link></li>
                <li><Link href="#" className="text-sm text-tgv-secondary hover:text-tgv-primary">Consulting</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-tgv-dark-text">Company</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-tgv-secondary hover:text-tgv-primary">About</Link></li>
                <li><Link href="#" className="text-sm text-tgv-secondary hover:text-tgv-primary">Contact</Link></li>
                <li><Link href="#" className="text-sm text-tgv-secondary hover:text-tgv-primary">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}