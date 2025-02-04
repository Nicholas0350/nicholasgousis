import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from "next/image"
import { spaceGrotesk } from "@/lib/fonts"
// import { Button } from "@/components/ui/button"
// import { CheckCircle } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
import { DemoModal } from "@/components/sign-ups/newsletter-modal-signup/main"


interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article: {
    number: number
    title: string
    date: string
  } | null
}

interface PlanOption {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
}

const plansSample: PlanOption[] = [
  {
      id: "basic",
      name: "Basic",
      price: "$9",
      description: "Perfect for side projects",
      features: ["5 projects", "Basic analytics", "24h support"],
  },
  {
      id: "pro",
      name: "Pro",
      price: "$19",
      description: "For professional developers",
      features: [
          "Unlimited projects",
          "Advanced analytics",
          "Priority support",
      ],
  },
];


export function ArticleModal({ isOpen, onClose, article }: ArticleModalProps) {
  if (!article) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] p-0 rounded-4xl">
        <div className="rounded-2xl border-2 border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-6 rounded-2xl">
            <div className="relative z-10">
              <DialogHeader className="mb-4">
                <DialogTitle className={`${spaceGrotesk.className} text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400`}>
                  {article.title}
                </DialogTitle>
                <DialogDescription className={`${spaceGrotesk.className} text-base font-medium text-gray-500 dark:text-gray-400`}>
                  Issue #{article.number} - {article.date}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <Image
                  src="/placeholder.svg"
                  alt="Article image"
                  width={600}
                  height={300}
                  className="rounded-xl object-cover w-full border border-gray-200 dark:border-gray-800 shadow-sm"
                />
                <div className="space-y-4 leading-relaxed">
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
                  </p>
                </div>
              </div>



              Subscribe to the Newsletter<DemoModal plans={plansSample} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
