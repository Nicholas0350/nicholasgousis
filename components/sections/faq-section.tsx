import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function FAQSection() {
  return (
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
          <AccordionItem value="item-5">
            <AccordionTrigger>Πώς μπορώ να ξεκινήσω με το ChatPRD;</AccordionTrigger>
            <AccordionContent>
              Το ξεκίνημα με το ChatPRD είναι εύκολο! Απλά κάντε κλικ στο κουμπί &quot;Δοκιμάστε το Τώρα&quot; ή &quot;Εγγραφή&quot; στη κορυφή της σελίδας. Θα σας καθοδηγήσουμε μέσα από μια απλή διαδικασία εγγραφής και πληρωμής. Μόλις ολοκληρωθεί, θα έχετε άμεση πρόσβαση στο εργαλείο μας. Προσφέρουμε επίσης εκτενή τεκμηρίωση, οδηγούς χρήσης και υποστήριξη πελατών για να σας βοηθήσουμε να ξεκινήσετε γρήγορα.
            </AccordionContent>
          </AccordionItem>
          {/* Add other FAQ items here */}
        </Accordion>
      </div>
    </section>
  )
}