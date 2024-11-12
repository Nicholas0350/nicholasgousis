import Link from "next/link"
import { Bot } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-6 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <Link className="flex items-center" href="#">
              <Bot className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">ChatPRD</span>
            </Link>
            <p className="text-sm text-gray-500">
              Το ChatPRD είναι ένα εργαλείο AI που βοηθά τους product managers να δημιουργούν καλύτερα έγγραφα προϊόντων και να βελτιώνουν τη διαδικασία ανάπτυξης προϊόντων.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-lg font-semibold mb-2">Προϊόν</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-gray-500 hover:underline">Χαρακτηριστικά</Link></li>
                <li><Link href="#" className="text-sm text-gray-500 hover:underline">Τιμολόγηση</Link></li>
                <li><Link href="#" className="text-sm text-gray-500 hover:underline">Συχνές Ερωτήσεις</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Εταιρεία</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="text-sm text-gray-500 hover:underline">Σχετικά με εμάς</Link></li>
                <li><Link href="#" className="text-sm text-gray-500 hover:underline">Καριέρα</Link></li>
                <li><Link href="#" className="text-sm text-gray-500 hover:underline">Επικοινωνία</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500">© 2024 ChatPRD. Με επιφύλαξη παντός δικαιώματος.</p>
        </div>
      </div>
    </footer>
  )
}