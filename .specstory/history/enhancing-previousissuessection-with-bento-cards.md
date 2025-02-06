## SpecStory

## Enhancing PreviousIssuesSection with Bento Cards (04/02/2025, 11:38:40)

_**User**_

enhance @PreviousIssuesSection.tsx with the use of Bento cards by way of the followig snippet import React from "react"
import { motion } from "framer-motion"

import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg"

interface BentoCardProps {
  title: string
  value: string | number
  subtitle?: string
  colors: string[]
  delay: number
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  value,
  subtitle,
  colors,
  delay,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      className="relative overflow-hidden h-full bg-background dark:bg-background/50" // Изменено здесь
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-3 sm:p-5 md:p-8 text-foreground backdrop-blur-sm" // Добавлен backdrop-blur
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h3 
          className="text-sm sm:text-base md:text-lg text-foreground" 
          variants={item}
        >
          {title}
        </motion.h3>
        <motion.p
          className="text-2xl sm:text-4xl md:text-5xl font-medium mb-4 text-foreground"
          variants={item}
        >
          {value}
        </motion.p>
        {subtitle && (
          <motion.p 
            className="text-sm text-foreground/80" 
            variants={item}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  )
}

const AnimatedGradientDemo: React.FC = () => {
  return (
    <div className="w-full bg-background h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 grow h-full">
        <div className="md:col-span-2">
          <BentoCard
            title="Total Revenue"
            value="$1,234,567"
            subtitle="15% increase from last month"
            colors={["#3B82F6", "#60A5FA", "#93C5FD"]}
            delay={0.2}
          />
        </div>
        <BentoCard
          title="New Users"
          value={1234}
          subtitle="Daily signups"
          colors={["#60A5FA", "#34D399", "#93C5FD"]}
          delay={0.4}
        />
        <BentoCard
          title="Conversion Rate"
          value="3.45%"
          subtitle="0.5% increase from last week"
          colors={["#F59E0B", "#A78BFA", "#FCD34D"]}
          delay={0.6}
        />
        <div className="md:col-span-2">
          <BentoCard
            title="Active Projects"
            value={42}
            subtitle="8 completed this month"
            colors={["#3B82F6", "#A78BFA", "#FBCFE8"]}
            delay={0.8}
          />
        </div>
        <div className="md:col-span-3">
          <BentoCard
            title="Customer Satisfaction"
            value="4.8/5"
            subtitle="Based on 1,000+ reviews from verified customers across all product categories"
            colors={["#EC4899", "#F472B6", "#3B82F6"]}
            delay={1}
          />
        </div>
      </div>
    </div>
  )
}

export { AnimatedGradientDemo }

---

_**Assistant**_

I'll help you enhance the PreviousIssuesSection with Bento cards. Here's how to modify the code:

```typescript:components/newsletter/PreviousIssuesSection.tsx
// ... existing imports ...
import { motion } from "framer-motion"
import { AnimatedGradient } from "@/components/ui/animated-gradient-with-svg"

interface BentoCardProps {
  title: string
  value: string | number
  subtitle?: string
  colors: string[]
  delay: number
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  value,
  subtitle,
  colors,
  delay,
}) => {
  // ... existing BentoCard implementation ...
}

export function PreviousIssuesSection() {
  // ... existing useState ...

  return (
    <>
      <section className="pt-12 w-full flex items-center justify-center py-12 md:py-24 lg:py-32 relative">
        {/* ... existing header ... */}
        
        <div className="container relative px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article, index) => (
                  <BentoCard
                    key={article.number}
                    title={`#${article.number}`}
                    value={article.title}
                    subtitle={article.date}
                    colors={[
                      "rgb(59, 130, 246)",
                      "rgb(96, 165, 250)",
                      "rgb(147, 197, 253)",
                    ].map((c, i) => i === index % 3 ? c : `${c}80`)}
                    delay={0.1 * index}
                  />
                ))}
              </div>
            </div>

            {/* ... existing newsletter signup card ... */}
          </div>
        </div>
      </section>
      
      {/* ... existing ArticleModal ... */}
    </>
  )
}
```

Key changes:
1. Added BentoCard component and its dependencies
2. Replaced the article list with a grid of BentoCards
3. Each card now has a unique color gradient and animation delay
4. Maintained the existing layout structure but with enhanced visual elements

The articles will now appear as animated gradient cards with staggered animations on load. Click handling can be added to the BentoCard component if needed.

---

_**User**_

fior @Codebase which ffolder should TileProps be moved to so as to keep the component clean 

---

_**Assistant**_

Based on the codebase structure, the `TilesProps` interface should be moved to a dedicated types file. Here's how to organize it:

1. Create a new types file:

```typescript:types/tiles.ts
interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: "sm" | "md" | "lg"
}

const tileSizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
} as const

export type { TilesProps }
export { tileSizes }
```

2. Then update the PreviousIssuesSection imports:

```typescript:components/newsletter/PreviousIssuesSection.tsx
import type { TilesProps } from "@/types/tiles"
import { tileSizes } from "@/types/tiles"
```

This follows the pattern of:
- Keeping component files focused on component logic
- Centralizing type definitions
- Making types reusable across components
- Following Next.js recommended folder structure

The types folder should be at the root level alongside components, lib, etc.

---

_**User**_

where should tiles.ts reside in the codebase

---

_**Assistant**_

Based on the codebase structure, since the Tiles component is specifically part of the newsletter functionality, the types should be organized as follows:

```typescript:components/newsletter/types/tiles.ts
export interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: "sm" | "md" | "lg"
}

export const tileSizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
} as const
```

Then update the import in PreviousIssuesSection:

```typescript:components/newsletter/PreviousIssuesSection.tsx
// ... existing imports ...
import type { TilesProps } from "./types/tiles"
import { tileSizes } from "./types/tiles"
```

This organization:
1. Keeps related code together in the newsletter component folder
2. Makes it clear these types are specific to the newsletter feature
3. Follows the component-first organization pattern seen in the codebase
4. Makes it easier to maintain and refactor newsletter-specific code

---



---

