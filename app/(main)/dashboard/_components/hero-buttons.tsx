"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Briefcase, User } from "lucide-react";
import { RouteURL } from "@/lib/routes";
import { cn } from "@/lib/utils";

const heroButtons = [
  {
    href: RouteURL.PROFILE,
    label: "Profile",
    icon: User,
    gradient: "from-primary to-primary/80",
    accentGradient: "from-primary/20 to-primary/10",
    hoverScale: 1.05,
  },
  {
    href: RouteURL.CREATE_COVER_LETTER,
    label: "Cover Letter",
    icon: FileText,
    gradient: "from-blue-500 to-cyan-500",
    accentGradient: "from-blue-500/20 to-cyan-500/10",
    hoverScale: 1.05,
  },
  {
    href: RouteURL.CREATE_RESUME,
    label: "Resume",
    icon: Briefcase,
    gradient: "from-pink-500 to-rose-500",
    accentGradient: "from-pink-500/20 to-rose-500/10",
    hoverScale: 1.05,
  },
];

export function HeroButtonsSection() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {heroButtons.map((button, index) => {
          const Icon = button.icon;

          return (
            <motion.div
              key={button.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{ scale: button.hoverScale }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={button.href} className="block h-full">
                <motion.div
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-8 h-32",
                    "flex flex-col items-center justify-center gap-3",
                    "bg-gradient-to-br transition-all duration-300",
                    button.gradient,
                    "shadow-lg hover:shadow-xl",
                    "group cursor-pointer"
                  )}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {/* Animated background gradient overlay */}
                  <motion.div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100",
                      button.accentGradient
                    )}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 100 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    {/* Icon with motion */}
                    <motion.div
                      initial={{ rotate: 0, scale: 1 }}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                    </motion.div>

                    {/* Label */}
                    <motion.h3
                      className="text-lg font-bold text-white text-center drop-shadow-md"
                      initial={{ letterSpacing: "0em" }}
                      whileHover={{ letterSpacing: "0.05em" }}
                      transition={{ duration: 0.2 }}
                    >
                      {button.label}
                    </motion.h3>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
