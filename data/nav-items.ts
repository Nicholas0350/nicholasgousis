'use client'

import { Home, User, Briefcase, FolderKanban, Mail, GraduationCap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  name: string
  link: string
  icon: LucideIcon
}

export const navItems = [
  {
    name: "About",
    link: "#about",
    icon: User,
  },
  {
    name: "Services",
    link: "#services",
    icon: Briefcase,
  },
  {
    name: "Portfolio",
    link: "#portfolio",
    icon: FolderKanban,
  },
  {
    name: "Contact",
    link: "#contact",
    icon: Mail,
  },
  {
    name: "Courses",
    link: "/courses",
    icon: GraduationCap,
  },
]