"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

import { FirebaseError } from "firebase/app";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);

      toast({
        title: "Login Successful",
        description: "Redirecting to your news feed.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            toast({
              title: "User Not Found",
              description: "No account found with this email address.",
              variant: "destructive",
            });
            break;
          case "auth/wrong-password":
            toast({
              title: "Incorrect Password",
              description: "The password you entered is incorrect.",
              variant: "destructive",
            });
            break;
          case "auth/invalid-email":
            toast({
              title: "Invalid Email",
              description: "Please enter a valid email address.",
              variant: "destructive",
            });
            break;
          case "auth/too-many-requests":
            toast({
              title: "Too Many Attempts",
              description:
                "Your account has been temporarily locked. Please try again later.",
              variant: "destructive",
            });
            break;
          default:
            toast({
              title: "Login Failed",
              description: "An error occurred. Please try again.",
              variant: "destructive",
            });
        }
      } else {
        toast({
          title: "Unknown Error",
          description: "Something went wrong.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);

      toast({
        title: "Google Sign-In Successful",
        description: "Redirecting to your news feed.",
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Google Sign-In Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="example@mail.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Forgot Password
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or</span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleGoogleSignIn}
      >
        {isLoading ? "Signing In..." : "Sign In with Google"}
      </Button>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
