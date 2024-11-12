import { Bot, Sparkles, Star } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-2 text-purple-600">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-xl font-bold">Γράψτε PRDs Γρήγορα</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Δημιουργήστε επαγγελματικά έγγραφα προδιαγραφών προϊόντος σε λεπτά, όχ ώρες.
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-2 text-purple-600">
              <Bot className="h-6 w-6" />
              <h3 className="text-xl font-bold">AI Συγκυβερνήτης</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Έξυπνες προτάσεις, αυτόματη βελτίωση περιεχομένου και άμεση ανατροφοδότηση.
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-2 text-purple-600">
              <Star className="h-6 w-6" />
              <h3 className="text-xl font-bold">Επαγγελματικά Αποτελέσματα</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Βελτιώστε την ποιότητα της δουλειάς σας και εντυπωσιάστε την ομάδα σας.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}