"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/data/nav-items";
import { AuthDialog } from "@/components/auth/auth-dialog";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const shouldShow = current > 0.05;
      setVisible(shouldShow);
    }
  });

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, link: string) => {
    if (link.startsWith('#')) {
      e.preventDefault();
      const targetId = link.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -100,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-4 inset-x-0 mx-auto border border-white/[0.2] rounded-full bg-black/60 backdrop-blur-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
          className
        )}
      >
        {navItems.map((navItem, idx) => {
          const Icon = navItem.icon;
          return (
            <a
              key={`link-${idx}`}
              href={navItem.link}
              onClick={(e) => handleSmoothScroll(e, navItem.link)}
              className={cn(
                "relative font-space-grotesk text-[0.875rem] tracking-[-0.02em] text-neutral-50 items-center flex space-x-1 hover:text-blue-400 transition-colors"
              )}
            >
              <span className="block sm:hidden">
                <Icon className="h-4 w-4" />
              </span>
              <span className="hidden sm:block font-medium">{navItem.name}</span>
            </a>
          );
        })}
        <AuthDialog />
      </motion.div>
    </AnimatePresence>
  );
};
