"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavBody,
  NavbarLogo,
  NavbarButton,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { RouteURL } from "@/lib/routes";
import { User } from "better-auth";

export function Header({ user }: { user: User | null }) {
  const navItems = [
    {
      name: "Home",
      link: RouteURL.DASHBOARD,
    },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleOpenSettings = () => {
    const params = new URLSearchParams(window.location.search);
    params.set("settings", "account");
    const qs = params.toString();
    router.push(`${window.location.pathname}${qs ? `?${qs}` : ""}`, {
      scroll: false,
    });
  };
  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <div className="flex items-center gap-4">
          {!user && (
            <NavbarButton variant="primary" href={RouteURL.SIGNIN}>
              I WANT TO GET EMPLOYED FAST
            </NavbarButton>
          )}
          {user && (
            <>
              <NavbarButton
                as="button"
                variant="secondary"
                onClick={handleOpenSettings}
              >
                Setting
              </NavbarButton>
              <NavbarButton variant="gradient" href={RouteURL.DASHBOARD}>
                Dashboard
              </NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClickAction={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="relative text-neutral-600 dark:text-neutral-300"
            >
              <span className="block">{item.name}</span>
            </a>
          ))}
          <div className="flex w-full flex-col gap-4">
            {/* <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Login
            </NavbarButton>
            <NavbarButton
              onClick={() => setIsMobileMenuOpen(false)}
              variant="primary"
              className="w-full"
            >
              Book a call
            </NavbarButton> */}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
