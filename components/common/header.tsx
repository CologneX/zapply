"use client";
import React, { useState } from "react";
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
import { openDialog } from "./dialog";
import dynamic from "next/dynamic";

const AccountSettingsContent = dynamic(
  () => import("./account-settings-dialog"),
  { ssr: false, loading: () => <div /> }
);
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Share2Icon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header({ user }: { user: User | null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  const handleCopyProfileLink = () => {
    if (session?.user.displayUsername) {
      const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}${RouteURL.USER}/${session.user.displayUsername}`;
      toast.success("Profile link copied to clipboard!");
      navigator.clipboard.writeText(profileUrl);
    }
  };

  const handleOpenSettings = () => {
    openDialog({
      title: "Account Settings",
      description: "Manage your account preferences",
      children: <AccountSettingsContent />,
      showCloseButton: true,
    });
  };
  return (
    <Navbar>
      <NavBody>
        <NavbarLogo />
        <div className="flex items-center gap-4">
          {!user && (
            <NavbarButton variant="primary" href={RouteURL.SIGNIN}>
              Generate AI Resume
            </NavbarButton>
          )}
          {user && (
            <>
              <Button
                variant="ghost"
                onClick={handleOpenSettings}
                className="bg-transparent shadow-none"
              >
                Setting
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button
                      variant="ghost"
                      onClick={handleCopyProfileLink}
                      disabled={!session?.user?.displayUsername}
                      className="bg-transparent shadow-none"
                    >
                      <Share2Icon />
                      Share Profile
                    </Button>
                  </span>
                </TooltipTrigger>
                {!session?.user?.displayUsername && (
                  <TooltipContent>
                    Please set a display username in settings first
                  </TooltipContent>
                )}
              </Tooltip>
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
          {/* <Button> */}
          {!user && (
            <NavbarButton variant="primary" href={RouteURL.SIGNIN}>
              Generate AI Resume
            </NavbarButton>
          )}
          {user && (
            <>
              <NavbarButton
                variant="gradient"
                href={RouteURL.DASHBOARD}
                className="w-full"
              >
                Dashboard
              </NavbarButton>
              <Button
                variant="outline"
                onClick={handleOpenSettings}
                className="w-full"
              >
                Setting
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    onClick={handleCopyProfileLink}
                    disabled={!session?.user?.displayUsername}
                    className="w-full"
                  >
                    <Share2Icon />
                    Share Profile
                  </Button>
                </TooltipTrigger>
                {!session?.user?.displayUsername && (
                  <TooltipContent>
                    Please set a display username in settings first
                  </TooltipContent>
                )}
              </Tooltip>
            </>
          )}
          {/* </Button> */}
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
