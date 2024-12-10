'use client'

// import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function Navbar() {
  // Smooth scroll handler
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      const offset = 80 // Adjust this value based on your navbar height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <nav className="bg-tgv-dark-darker border-b border-tgv-dark-border">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-tgv-dark-text"
        >
          Nicholas Gousis
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#about"
            onClick={(e) => handleSmoothScroll(e, 'about')}
            className="text-tgv-secondary hover:text-tgv-primary transition-colors cursor-pointer"
          >
            About
          </a>
          <a
            href="#services"
            onClick={(e) => handleSmoothScroll(e, 'services')}
            className="text-tgv-secondary hover:text-tgv-primary transition-colors cursor-pointer"
          >
            Services
          </a>
          <a
            href="#portfolio"
            onClick={(e) => handleSmoothScroll(e, 'portfolio')}
            className="text-tgv-secondary hover:text-tgv-primary transition-colors cursor-pointer"
          >
            Portfolio
          </a>
          <Link
            href="/courses"
            className="text-tgv-secondary hover:text-tgv-primary transition-colors"
          >
            Courses
          </Link>
          <Button
            variant="secondary"
            className="bg-tgv-primary hover:bg-tgv-hover text-white"
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}