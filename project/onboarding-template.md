# Onboarding Template Registry Setup

## Quick Install

```bash
npx shadcn@latest add "https://nicholasgousis.com/r/onboarding"
```

## Component Preview

```typescript
// demo.tsx
import { OnboardingFlow } from "@/components/blocks/onboarding"

const steps = [
  {
    title: "Welcome",
    description: "Let's get you set up with your new account",
    icon: "👋",
    theme: {
      gradient: "from-blue-500/20 to-violet-500/20",
      iconColor: "text-blue-500"
    }
  },
  {
    title: "Personal Info",
    description: "Tell us a bit about yourself",
    icon: "👤",
    theme: {
      gradient: "from-violet-500/20 to-pink-500/20",
      iconColor: "text-violet-500"
    }
  },
  {
    title: "Preferences",
    description: "Customize your experience",
    icon: "⚙️",
    theme: {
      gradient: "from-pink-500/20 to-orange-500/20",
      iconColor: "text-pink-500"
    }
  },
  {
    title: "Complete",
    description: "You're all set to go!",
    icon: "🎉",
    theme: {
      gradient: "from-orange-500/20 to-yellow-500/20",
      iconColor: "text-orange-500"
    }
  }
]

export function OnboardingDemo() {
  return (
    <OnboardingFlow
      steps={steps}
      onComplete={(data) => console.log('Completed:', data)}
      appearance={{
        cardWidth: "max-w-2xl",
        accentColor: "blue",
        borderRadius: "rounded-xl",
        animation: "slide", // or "fade" | "bounce"
        progressBar: {
          height: "h-2",
          style: "gradient", // or "solid" | "dashed"
          showSteps: true
        },
        typography: {
          titleSize: "text-2xl",
          descriptionSize: "text-sm",
          fontFamily: "font-space-grotesk"
        },
        darkMode: {
          background: "bg-zinc-900",
          text: "text-zinc-100",
          border: "border-zinc-800"
        }
      }}
      layout={{
        contentAlignment: "center", // or "left" | "right"
        spacing: "space-y-8",
        padding: "p-8"
      }}
      transitions={{
        duration: 300,
        type: "spring", // or "linear" | "ease"
        stiffness: 150
      }}
    />
  )
}
```

## Registry Configuration

```typescript
// lib/registry/components/onboarding.ts
import type { Registry } from '@/types/registry'

export const onboarding: Registry['onboarding'] = {
  name: "onboarding",
  type: "registry:ui",
  registryDependencies: [
    "button",
    "card",
    "form",
    "input",
    "label",
    "progress",
    "separator",
    "switch",
    "toast",
    "hover-card",
    "command",
    "popover"
  ],
  dependencies: [
    "@radix-ui/react-progress",
    "@radix-ui/react-dialog",
    "@radix-ui/react-form",
    "@radix-ui/react-separator",
    "@radix-ui/react-avatar",
    "@radix-ui/react-switch",
    "@radix-ui/react-toast",
    "lucide-react",
    "zod",
    "react-hook-form",
    "@hookform/resolvers/zod",
    "jotai"
  ],
  files: [
    {
      name: "onboarding.tsx",
      content: \`"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface OnboardingProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: {
    title: string
    description: string
    icon?: string
  }[]
  onComplete?: (data: any) => void
  appearance?: {
    cardWidth?: string
    accentColor?: string
    borderRadius?: string
  }
}

export function OnboardingFlow({
  steps,
  onComplete,
  appearance,
  className,
  ...props
}: OnboardingProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const { toast } = useToast()

  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <Card
      className={cn(
        appearance?.cardWidth || "max-w-lg",
        appearance?.borderRadius || "rounded-lg",
        "w-full mx-auto p-6",
        className
      )}
      {...props}
    >
      <Progress
        value={progress}
        className={cn(
          "h-1 mb-8",
          appearance?.accentColor && \`bg-\${appearance.accentColor}-100 [&>div]:bg-\${appearance.accentColor}-500\`
        )}
      />

      <div className="min-h-[400px] flex flex-col">
        <div className="text-center mb-8">
          {steps[currentStep].icon && (
            <span className="text-4xl mb-4 block">{steps[currentStep].icon}</span>
          )}
          <h2 className="text-2xl font-bold tracking-tight">
            {steps[currentStep].title}
          </h2>
          <p className="text-muted-foreground mt-2">
            {steps[currentStep].description}
          </p>
        </div>

        {/* Step content here */}
      </div>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(s => s - 1)}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (currentStep === steps.length - 1) {
              onComplete?.({})
              toast({
                title: "All done!",
                description: "Your setup is complete."
              })
            } else {
              setCurrentStep(s => s + 1)
              toast({
                title: "Step completed",
                description: \`Completed \${steps[currentStep].title}\`
              })
            }
          }}
        >
          {currentStep === steps.length - 1 ? "Complete" : "Next"}
        </Button>
      </div>
    </Card>
  )
}\`
    }
  ],
  styles: {
    css: \`
.onboarding-step {
  @apply relative overflow-hidden transition-all;
}

.onboarding-step-gradient {
  @apply absolute inset-0 opacity-50;
  background-size: 200% 200%;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.onboarding-progress-dashed {
  background-image: linear-gradient(to right, var(--progress-color) 50%, transparent 50%);
  background-size: 20px 1px;
  background-repeat: repeat-x;
}

.onboarding-icon {
  @apply relative inline-flex items-center justify-center;
  &::before {
    @apply absolute inset-0 blur-xl opacity-25;
    content: "";
    background: inherit;
  }
}

.dark {
  .onboarding-card {
    @apply bg-zinc-900 border-zinc-800;
  }
  .onboarding-step-gradient {
    @apply opacity-30;
  }
}\`
  }
}
```

## API Reference

### OnboardingFlow

```typescript
interface LayoutOptions {
  contentAlignment: "left" | "center" | "right"
  spacing: string
  padding: string
  maxWidth: string
  containerClassName: string
  contentClassName: string
}
```

#### Props

```typescript
interface AnimationOptions {
  type: "slide" | "fade" | "bounce" | "spring"
  duration: number
  stiffness?: number
  damping?: number
  delay?: number
  custom?: Record<string, unknown>
}
```

#### Step Configuration

```typescript
interface ThemeOptions {
  gradient?: string
  iconColor?: string
  accentColor?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  shadowColor?: string
}
```

### Progress Bar Options

```typescript
interface ProgressBarOptions {
  height: string
  style: "solid" | "gradient" | "dashed"
  showSteps: boolean
  showLabels: boolean
  activeColor: string
  inactiveColor: string
  stepDotSize: string
}
```

## Examples

### Custom Theme Per Step

```typescript
<OnboardingFlow
  steps={[
    {
      title: "Welcome",
      description: "Get started with your journey",
      theme: {
        gradient: "from-blue-500/20 to-violet-500/20",
        iconColor: "text-blue-500",
        accentColor: "blue"
      }
    },
    // ... more steps
  ]}
/>
```

### Advanced Progress Bar

```typescript
<OnboardingFlow
  steps={steps}
  appearance={{
    progressBar: {
      height: "h-2",
      style: "gradient",
      showSteps: true,
      showLabels: true,
      activeColor: "bg-gradient-to-r from-blue-500 to-violet-500",
      inactiveColor: "bg-zinc-200",
      stepDotSize: "w-4 h-4"
    }
  }}
/>
```

### Custom Animations

```typescript
<OnboardingFlow
  transitions={{
    duration: 300,
    type: "spring",
    stiffness: 150,
    damping: 15,
    custom: {
      opacity: { duration: 150 },
      scale: { type: "spring", stiffness: 200 }
    }
  }}
/>
```

### With Form Integration

```typescript
<OnboardingFlow
  steps={[
    {
      title: "Account Setup",
      description: "Create your account",
      component: <AccountForm />
    },
    // ... more steps
  ]}
  onComplete={(data) => {
    // Handle form data
    console.log(data)
  }}
/>
```

### With Analytics

```typescript
<OnboardingFlow
  steps={steps}
  onStepComplete={(step) => {
    analytics.track('onboarding_step_complete', {
      step: step.title,
      timestamp: new Date()
    })
  }}
  onComplete={(data) => {
    analytics.track('onboarding_complete', {
      duration: Date.now() - startTime
    })
  }}
/>
```