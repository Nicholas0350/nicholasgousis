'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    setIsOpen(false) // Close mobile menu after clicking
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            Nicholas Gousis
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#about"
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              About
            </a>
            <a
              href="#services"
              onClick={(e) => handleSmoothScroll(e, 'services')}
              className="text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              Services
            </a>
            <a
              href="#portfolio"
              onClick={(e) => handleSmoothScroll(e, 'portfolio')}
              className="text-white hover:text-blue-400 transition-colors cursor-pointer"
            >
              Portfolio
            </a>
            <Link
              href="/courses"
              className="text-white hover:text-blue-400 transition-colors"
            >
              Courses
            </Link>
            <Button
              variant="secondary"
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className="text-white hover:text-blue-400 transition-colors cursor-pointer"
              >
                About
              </a>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, 'services')}
                className="text-white hover:text-blue-400 transition-colors cursor-pointer"
              >
                Services
              </a>
              <a
                href="#portfolio"
                onClick={(e) => handleSmoothScroll(e, 'portfolio')}
                className="text-white hover:text-blue-400 transition-colors cursor-pointer"
              >
                Portfolio
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, 'contact')}
                className="text-white hover:text-blue-400 transition-colors cursor-pointer"
              >
                Contact
              </a>
              <Link
                href="/courses"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Courses
              </Link>
              <Button
                variant="secondary"
                className="bg-blue-500 hover:bg-blue-600 text-white w-full"
              >
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}