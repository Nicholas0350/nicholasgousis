import { Bot, Sparkles, Star } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-tgv-dark-darker">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 w-full h-full bg-grid-small-white/[0.1]">
        {/* Radial gradient to fade edges */}
        <div className="absolute inset-0 bg-gradient-to-r from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-tgv-dark-darker/80 via-transparent to-tgv-dark-darker/80" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-2 text-tgv-primary">
              <Sparkles className="h-6 w-6" />
              <h3 className="text-xl font-bold text-tgv-dark-text">Γράψτε PRDs Γρήγορα</h3>
            </div>
            <p className="text-tgv-secondary">
              Δημιουργήστε επαγγελματικά έγγραφα προδιαγραφών προϊόντος σε λεπτά, όχ ώρες.
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-2 text-tgv-primary">
              <Bot className="h-6 w-6" />
              <h3 className="text-xl font-bold text-tgv-dark-text">AI Συγκυβερνήτης</h3>
            </div>
            <p className="text-tgv-secondary">
              Έξυπνες προτάσεις, αυτόματη βελτίωση περιεχομένου και άμεση ανατροφοδότηση.
            </p>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div className="flex items-center space-x-2 text-tgv-primary">
              <Star className="h-6 w-6" />
              <h3 className="text-xl font-bold text-tgv-dark-text">Επαγγελματικά Αποτελέσματα</h3>
            </div>
            <p className="text-tgv-secondary">
              Βελτιώστε την ποιότητα της δουλειάς σας και εντυπωσιάστε την ομάδα σας.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}