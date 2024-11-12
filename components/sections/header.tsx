import Link from "next/link"
import { Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onPaymentClick: () => void
}

export function Header({ onPaymentClick }: HeaderProps) {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center border-b">
      <Link className="flex items-center justify-center" href="#">
        <Bot className="h-6 w-6" />
        <span className="ml-2 text-lg font-bold">ChatPRD</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Προϊόν
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Κριτικές
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Τιμολόγηση
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Πόροι
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
          Εταιρεία
        </Link>
      </nav>
      <div className="ml-4 flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Σύνδεση
        </Button>
        <Button size="sm" onClick={onPaymentClick}>Εγγραφή</Button>
      </div>
    </header>
  )
}