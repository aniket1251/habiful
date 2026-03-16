"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/app/(auth)/authProvider";
import { usePathname, useRouter } from "next/navigation";
import { Bell, MessageCircle, Plus, Search, Menu, X, LayoutDashboard, Settings, LogOut, HelpCircle, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { user: authUser, signOut: handleSignOutAction } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");

  const handleSignOut = async () => {
    await handleSignOutAction();
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-4 sm:px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer hover:!text-primary-300"
            scroll={false}
          >
            <div className="flex items-center gap-1.5">
              <Image
                src="/navLogo.svg"
                alt="Habiful logo"
                width={24}
                height={24}
                className="w-8 h-8 text-white"
              />
              <div className="text-xl font-bold">
                HABI
                <span className="text-secondary-500 font-light hover:!text-primary-300">
                  FUL
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className={`md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50 hidden md:flex`}
              onClick={() =>
                router.push(
                  authUser.role?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search"
                )
              }
            >
              {authUser.role?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:block ml-2">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isDashboardPage && (
          <p className="text-primary-200 hidden md:block">
            Discover rental homes built around your lifestyle and habitat
          </p>
        )}
        <div className="flex items-center gap-5">
          {authUser ? (
            <>
              <div className="relative hidden md:block">
                <MessageCircle className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
              </div>
              <div className="relative hidden md:block">
                <Bell className="w-6 h-6 cursor-pointer text-primary-200 hover:text-primary-400" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-secondary-700 rounded-full"></span>
              </div>
              {/* Desktop: Avatar dropdown */}
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
                    <Avatar>
                      <AvatarImage src={authUser.profileImageUrl ?? ""} />
                      <AvatarFallback className="bg-primary-600">
                        {authUser.role?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-primary-200 hidden md:block">
                      {authUser.name}
                    </p>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white text-primary-700">
                    <DropdownMenuItem
                      className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100 text-bold"
                      onClick={() =>
                        router.push(
                          authUser.role?.toLowerCase() === "manager"
                            ? "/managers/properties"
                            : "/tenants/favorites",
                          { scroll: false }
                        )
                      }
                    >
                      Go to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary-200" />
                    <DropdownMenuItem
                      className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                      onClick={() =>
                        router.push(
                          `/${authUser.role?.toLowerCase()}s/settings`,
                          { scroll: false }
                        )
                      }
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer hover:!bg-primary-700 hover:!text-primary-100"
                      onClick={handleSignOut}
                    >
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Mobile: Hamburger menu */}
              <button
                className="md:hidden p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          ) : (
            <>
              {/* Desktop: Login/Signup buttons */}
              <div className="hidden sm:flex items-center gap-3">
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    variant="secondary"
                    className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
              {/* Mobile: Hamburger menu for non-auth */}
              <button
                className="sm:hidden p-1"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed left-0 right-0 bottom-0 bg-primary-700 z-40 shadow-lg rounded-t-2xl">
          <div className="flex flex-col px-5 py-5">
            {authUser ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-primary-500">
                  <Avatar className="w-11 h-11">
                    <AvatarImage src={authUser.profileImageUrl ?? ""} />
                    <AvatarFallback className="bg-primary-600">
                      {authUser.role?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-semibold">{authUser.name}</p>
                    <p className="text-primary-300 text-sm capitalize">{authUser.role}</p>
                  </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex flex-col gap-1 mb-4">
                  <button
                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg text-left transition-colors"
                    onClick={() => {
                      router.push(
                        authUser.role?.toLowerCase() === "manager"
                          ? "/managers/properties"
                          : "/tenants/favorites"
                      );
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </button>
                  <button
                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg text-left transition-colors"
                    onClick={() => {
                      router.push(
                        authUser.role?.toLowerCase() === "manager"
                          ? "/managers/newproperty"
                          : "/search"
                      );
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {authUser.role?.toLowerCase() === "manager" ? (
                      <>
                        <Plus className="w-5 h-5" />
                        Add New Property
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Search Properties
                      </>
                    )}
                  </button>
                  <button
                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg text-left transition-colors"
                    onClick={() => {
                      router.push(`/${authUser.role?.toLowerCase()}s/settings`);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </button>
                </nav>

                {/* Notifications Section */}
                <div className="flex flex-col gap-1 py-4 border-t border-primary-500">
                  <button className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg text-left transition-colors">
                    <div className="relative">
                      <MessageCircle className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary-500 rounded-full"></span>
                    </div>
                    Messages
                  </button>
                  <button className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg text-left transition-colors">
                    <div className="relative">
                      <Bell className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary-500 rounded-full"></span>
                    </div>
                    Notifications
                  </button>
                </div>

                {/* Logout */}
                <div className="pt-4 border-t border-primary-500">
                  <button
                    className="w-full px-3 py-3 text-white hover:bg-red-600/20 rounded-lg text-left transition-colors flex items-center gap-3"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Non-auth: Navigation links */}
                <nav className="flex flex-col gap-1 mb-4">
                  <Link
                    href="/search"
                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Search className="w-5 h-5" />
                    Search Properties
                  </Link>
                  <Link
                    href="/faq"
                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HelpCircle className="w-5 h-5" />
                    FAQ
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 px-3 py-3 text-white hover:bg-primary-600 rounded-lg transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Mail className="w-5 h-5" />
                    Contact
                  </Link>
                </nav>

                {/* Non-auth: Auth buttons */}
                <div className="flex flex-col gap-3 pt-4 border-t border-primary-500">
                  <Link href="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full h-11 text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      variant="secondary"
                      className="w-full h-11 text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
