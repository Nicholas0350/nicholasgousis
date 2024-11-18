'use client'

import React from 'react'
import { Home, User, Briefcase, FolderKanban, Mail, GraduationCap, LucideIcon } from 'lucide-react'

export interface NavItem {
  name: string
  link: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  {
    name: "Home",
    link: "#",
    icon: Home,
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
    name: "Courses",
    link: "/courses",
    icon: GraduationCap,
  },
]