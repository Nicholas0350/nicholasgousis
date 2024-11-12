'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ArrowRight, Bot, CheckCircle, Play, Sparkles, Star } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
// import PricingModal from "./pricing-modal"
import StripePaymentForm from "./stripe-payment-form"
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Remove this hardcoded value and use environment variable
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE!)

export function EnhancedLandingPageWithStripe() {
  // State for payment form modal
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Navigation Header */}
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
          <Button size="sm" onClick={() => setShowPaymentForm(true)}>Εγγραφή</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Γίνετε{" "}
                  <span className="text-purple-600 relative">
                    10x καλύτερος
                    <span className="absolute bottom-1 left-0 w-full h-3 bg-pink-200/50 -z-10" />
                  </span>{" "}
                  Product Manager
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  με έναν AI συγκυβερνήτη που είναι πάντα διαθέσιμος.
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Το ChatPRD είναι το #1 εργαλείο AI για product managers και τις ομάδες τους.
                </p>
                <p className="text-sm text-gray-500">
                  Γράψτε εξαιρετικά έγγραφα προϊόντων γρήγορα και γίνετε ένας κορυφαίος PM.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-purple-600 hover:bg-purple-700" size="lg" onClick={() => setShowPaymentForm(true)}>
                  Δοκιμάστε το Τώρα - $129/μήνα
                </Button>
                <Button variant="outline" size="lg">
                  Δείτε το σε δράση <Play className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 items-start">
              <div className="flex flex-col justify-center space-y-4">
                <div className="flex items-center space-x-2 text-purple-600">
                  <Sparkles className="h-6 w-6" />
                  <h3 className="text-xl font-bold">Γράψτε PRDs Γρήγορα</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  Δημιουργήστε επαγγελματικά έγγραφα προδιαγρφών προϊόντος σε λεπτά, όχ ώρες.
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

        {/* Product Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Το #1 εργαλείο AI για Product Managers
                </h2>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Αυτοματοποιημένη δημιουργία PRD</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Έξυπνες προτάσεις χαρακτηριστικών</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Ανάλυση ανταγωνισμού με AI</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>Συνεργασία ομάδας σε πραγματικό χρόνο</span>
                  </li>
                </ul>
              </div>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <Image
                    src="/placeholder.svg?height=300&width=500"
                    alt="ChatPRD Interface"
                    width={500}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Πώς μπορώ να σας βοηθήσω σήμερα;
              </h2>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Βοηθήστε με να γράψω ένα PRD</h3>
                  <p className="text-sm text-gray-500 mb-4">Δημιουργήστε ένα νέο Έγγραφο Απαιτήσεων Προϊόντος</p>
                  <Button variant="outline" className="w-full">
                    Ξεκινήστε <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Βελτιώστε ένα υπάρχον έγγραφο</h3>
                  <p className="text-sm text-gray-500 mb-4">Λάβετε μια αναθεώρηση για να βελτιώσετε τη δουλειά σας</p>
                  <Button variant="outline" className="w-full">
                    Ξεκινήστε <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Καταιγισμός ιδεών για νέα χαρακτηριστικά</h3>
                  <p className="text-sm text-gray-500 mb-4">Δημιουργήστε νέες ιδέες γι το προϊόν σας</p>
                  <Button variant="outline" className="w-full">
                    Ξεκινήτε <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-8 text-center">
              Συχνές Ερωτήσεις
            </h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              <AccordionItem value="item-1">
                <AccordionTrigger>Τι είναι το ChatPRD;</AccordionTrigger>
                <AccordionContent>
                  Το ChatPRD είναι ένα εργαλείο AI που βοηθά τους product managers να δημιουργούν καλύτερα έγγραφα προϊόντων και να βελτιώνουν τη διαδικασία ανάπτυξης προϊόντων. Χρησιμοποιεί προηγμένη τεχνητή νοημοσύνη για να παρέχει έξυπνες προτάσεις, αυτοματοποιημένη δημιουργία περιεχομένου και άμεση ανατροφοδότηση.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Πώς μπορεί το ChatPRD να βοηθήσει την ομάδα μου;</AccordionTrigger>
                <AccordionContent>
                  Το ChatPRD μπορεί να βοηθήσει την ομάδα σας με πολλούς τρόπους:
                  1) Επιταχύνει τη διαδικασία δημιουργίας PRD.
                  2) Βελτιώνει την ποιότητα των εγγράφων προϊόντων.
                  3) Διευκολύνει τη συνεργασία μεταξύ των μελών της ομάδας.
                  4) Παρέχει έξυπνες προτάσεις για χαρακτηριστικά και βελτιώσεις προϊόντων.
                  5) Εξοικονομεί χρόνο, επιτρέποντας στην ομάδα σας να επικεντρωθεί σε πιο στρατηγικές εργασίες.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Είναι το ChatPRD σφαλές για ευαίσθητες πληροφορίες προϊόντων;</AccordionTrigger>
                <AccordionContent>
                  Ναι, το ChatPRD έχει σχεδιαστεί με γνώμονα την ασφάλεια. Χρησιμοποιούμε κρυπτογράφηση τελευταίας τεχνολογίας για να προστατεύσουμε τα δεδομένα σας και δεν μοιραζόμαστε ποτέ τις πληροφορίες σας με τρίτους. Επιπλέον, προσφέρουμε επιλογές για τοπική ανάπτυξη για οργανισμούς με αυστηρότερες απαιτήσεις ασφαλείας.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Πόσο κοστίζει το ChatPRD;</AccordionTrigger>
                <AccordionContent>
                  Το ChatPRD προσφέρει μια μηνιαία συνδρομή για $129 ανά μήνα. Αυτό το πλάνο περιλαμβάνει όλες τις βασικές λειτουργίες και συνεχείς ενημερώσεις. Για μεγαλύτερες ομάδες ή επιχειρήσεις που χρειάζονται προσαρμοσμένες λύσεις, παρακαλούμε επικοινωνήστε με την ομάδα πωλήσεών μας για μια εξατομικευμένη προσφορά.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Πώς μπ��ρώ να ξεκινήσ�� με το ChatPRD;</AccordionTrigger>
                <AccordionContent>
                  Το ξεκίνημα με το ChatPRD είναι εύκολο! Απλά κάντε κλικ στο κουμπί &quot;Δοκιμάστε το Τώρα&quot; ή &quot;Εγγραφή&quot; στη κορυφή της σελίδας. Θα σας καθοδηγήσουμε μέσα από μια απλή διαδικασία εγγραφής και πληρωμής. Μόλις ολοκληρωθεί, θα έχετε άμεση πρόσβαση στο εργαλείο μας. Προσφέρουμε επίσης εκτενή τεκμηρίωση, οδηγούς χρήσης και υποστήριξη πελατών για να σας βοηθήσουμε να ξεκινήσετε γρήγορα.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-purple-600 text-white">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight mb-4">
              Έτοιμοι να γίνετε καλύτεροι Product Manager;
            </h2>
            <p className="mx-auto max-w-[600px] text-purple-100 mb-8">
              Ξεκινήστε τώρα και δείτε πώς το ChatPRD μπορεί να μεταμορφώσει τον τρόπο που δουλεύετε.
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-white text-purple-600 hover:bg-gray-100" size="lg" onClick={() => setShowPaymentForm(true)}>
                Εγγραφείτε Τώρα - $129/μήνα
              </Button>
              <Button variant="outline" className="text-white border-white hover:bg-purple-700" size="lg">
                Ζητήστε μια Επίδειξη
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
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

      {/* Payment Form Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <Elements stripe={stripePromise}>
              <StripePaymentForm />
            </Elements>
            <Button variant="ghost" className="mt-4" onClick={() => setShowPaymentForm(false)}>
              Κλείσιμο
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}