"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  
  // More robust role checking
  const isAdmin = user && user.role === 'admin';

  const handleLogout = () => {
    logout();
    router.push("/en/login");
  };

  // Don't render user-specific content during loading to prevent hydration mismatch
  if (loading) {
    return (
      <HeroUINavbar maxWidth="xl" position="sticky">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex flex-col items-center gap-0" href="/en/dashboard">
              <div className="flex items-center gap-2">
                <Logo />
                <p className="font-bold text-inherit freestyle-script text-2xl mt-2">PopUp</p>
              </div>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent
          className="hidden sm:flex basis-1/5 sm:basis-full"
          justify="end"
        >
          <NavbarItem>
            <LanguageSwitcher />
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>
    );
  }

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
                      <NextLink className="flex flex-col items-center gap-0" href="/en/dashboard">
            <div className="flex items-center gap-2">
            <Logo />
              <p className="font-bold text-inherit freestyle-script text-2xl mt-2">PopUp</p>
            </div>
            {user && (
              <span className="text-xs text-gray-700 font-semibold mt-1">Hello, {user.name}</span>
            )}
          </NextLink>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        {/* Language Switcher */}
        <NavbarItem>
          <LanguageSwitcher />
        </NavbarItem>
        
        {!user && (
          <>
            <NavbarItem>
              <NextLink href="/en/login">
                <Button variant="ghost">Login</Button>
              </NextLink>
            </NavbarItem>
            <NavbarItem>
              <NextLink href="/en/signup">
                <Button variant="ghost">Sign Up</Button>
              </NextLink>
            </NavbarItem>
          </>
        )}
        {user && (
          <>
            {!isAdmin && (
              <NavbarItem>
                <NextLink href="/en/dashboard">
                  <Button variant="ghost">Umbrellas</Button>
                </NextLink>
              </NavbarItem>
            )}
            {isAdmin && (
              <NavbarItem>
                <NextLink href="/en/admin">
                  <Button variant="ghost" className="bg-red-100 text-red-700 hover:bg-red-200">
                    Admin
                  </Button>
                </NextLink>
              </NavbarItem>
            )}
            <NavbarItem>
              <Button variant="ghost" onClick={handleLogout}>Logout</Button>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroUINavbar>
  );
};
