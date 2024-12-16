type Tab = {
  title: string
  value: string
  content: {
    title: string
    description: string
    image: string
  }[]
}

const portfolioTabs: Tab[] = [
  {
    title: "Web Apps",
    value: "web-apps",
    content: [
      {
        title: "IgnytLabs",
        description: "MVP development agency website built with Next.js and TailwindCSS",
        image: "/images/portfolio/ignytlabs.png"
      },
      {
        title: "Think.ai",
        description: "AI-powered study assistant featuring GPT integration",
        image: "/images/portfolio/thinkai.png"
      },
      {
        title: "Portfolio 2024",
        description: "Modern portfolio website with smooth animations",
        image: "/images/portfolio/portfolio.png"
      }
    ]
  },
  {
    title: "AI Projects",
    value: "ai-projects",
    content: [
      {
        title: "QuizMaster",
        description: "AI-generated quiz platform with real-time scoring",
        image: "/images/portfolio/quizmaster.png"
      },
      {
        title: "FinTech Dashboard",
        description: "Financial analytics platform with AI predictions",
        image: "/images/portfolio/fintech.png"
      },
      {
        title: "AI Chat Bot",
        description: "Custom-trained chatbot for customer service",
        image: "/images/portfolio/chatbot.png"
      }
    ]
  },
  {
    title: "Mobile Apps",
    value: "mobile-apps",
    content: [
      {
        title: "Fitness Tracker",
        description: "React Native app for workout tracking",
        image: "/images/portfolio/fitness.png"
      },
      {
        title: "Recipe Finder",
        description: "Mobile app for discovering and saving recipes",
        image: "/images/portfolio/recipe.png"
      }
    ]
  }
]

export default portfolioTabs;
