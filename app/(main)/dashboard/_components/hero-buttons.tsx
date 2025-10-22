"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { FileText, Briefcase, User, AlertCircle } from "lucide-react";
import { RouteURL } from "@/lib/routes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const heroButtons = [
  {
    href: RouteURL.PROFILE,
    label: "Profile",
    icon: User,
  },
  {
    href: RouteURL.CREATE_COVER_LETTER,
    label: "Cover Letter",
    icon: FileText,
  },
  {
    href: RouteURL.CREATE_RESUME,
    label: "Resume",
    icon: Briefcase,
  },
];

interface HeroButtonsSectionProps {
  canCreateCoverLetterAndResume?: boolean;
}

export function HeroButtonsSection({
  canCreateCoverLetterAndResume = true,
}: HeroButtonsSectionProps) {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {heroButtons.map((button, index) => {
          const Icon = button.icon;
          const isDisabled =
            !canCreateCoverLetterAndResume &&
            (button.href === RouteURL.CREATE_COVER_LETTER ||
              button.href === RouteURL.CREATE_RESUME);

          const buttonContent = (
            <motion.div
              key={button.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <Link
                href={button.href}
                className={`block h-full ${
                  isDisabled ? "pointer-events-none" : ""
                }`}
              >
                <motion.div
                  className={`relative rounded-lg border border-border border-dashed bg-muted/20 p-4 h-24
                    flex flex-col items-center justify-center gap-2
                    transition-all hover:bg-muted/40 hover:border-border/80
                    ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  whileHover={isDisabled ? {} : { y: -2 }}
                  whileTap={isDisabled ? {} : { scale: 0.98 }}
                >
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={isDisabled ? {} : { scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="w-5 h-5 text-foreground" />
                  </motion.div>

                  {/* Label */}
                  <h6>{button.label}</h6>
                </motion.div>
              </Link>
            </motion.div>
          );

          if (isDisabled) {
            return (
              <Tooltip key={button.href}>
                <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                <TooltipContent side="top" className="w-64">
                  <div className="flex gap-3">
                    <div className="flex flex-col gap-2">
                      <h6>Complete Your Profile</h6>
                      <p className="text-sm text-muted/50">
                        Please fill in your profile information (name, email,
                        headline, and description) before creating{" "}
                        {button.label === "Resume"
                          ? "a resume"
                          : "a cover letter"}
                        .
                      </p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          }

          return buttonContent;
        })}
      </div>
    </section>
  );
}
