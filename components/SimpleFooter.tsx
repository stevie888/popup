"use client";
import { Home, Wallet, Scan, History, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthContext";

export default function SimpleFooter() {
  const { user, loading, isAuthenticated } = useAuth();
  
  console.log('🦶 SimpleFooter: Rendering with user:', user ? user.name : 'null');
  console.log('🦶 SimpleFooter: Loading state:', loading);
  console.log('🦶 SimpleFooter: Is authenticated:', isAuthenticated);
  
  // Don't show footer while loading or if user is not authenticated
  if (loading || !isAuthenticated) {
    console.log('🦶 SimpleFooter: Not showing - loading:', loading, 'authenticated:', isAuthenticated);
    return null;
  }
  
  console.log('🦶 SimpleFooter: Showing footer for user:', user?.name);
  
  return (
    <footer className="w-full gap-4 shadow-lg border-t-1 flex items-center justify-center py-3 px-4">
      <Link href={"/en/dashboard"}>
        <Button isIconOnly radius="full">
          <Home />
        </Button>
      </Link>
      <Link href={"/en/wallet"}>
        <Button isIconOnly radius="full" size="md">
          <Wallet />
        </Button>
      </Link>
      <Link href="/en/scan">
        <Button isIconOnly radius="full" size="lg">
          <Scan />
        </Button>
      </Link>
      <Link href="/en/history">
        <Button isIconOnly radius="full">
          <History />
        </Button>
      </Link>
      <Link href="/en/profile">
        <Button isIconOnly radius="full">
          <User />
        </Button>
      </Link>
    </footer>
  );
} 