"use client";

import { useState, useCallback, JSX } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, Settings, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { ModeToggle } from "../mode-toggle";

export function DashboardHeader(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [signingOut, setSigningOut] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = useCallback(async (): Promise<void> => {
    setSigningOut(true);
    try {
      await signOut(auth);

      toast({
        title: "Signed Out",
        description: "You have successfully signed out.",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Sign Out Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSigningOut(false);
    }
  }, [router, toast]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex h-16 items-center justify-between px-[15%]">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="grid gap-4 py-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  News Feed
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold">OA News</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            News Feed
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link href="/dashboard/notifications">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="h-5 w-5" />
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="User menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center gap-2">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} disabled={signingOut} className="flex items-center gap-2">
                {signingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
