"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseError } from "firebase/app";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      await sendPasswordResetEmail(auth, email);

      setEmailSent(true);
      toast({
        title: "Email Sent",
        description:
          "A password reset link has been sent to your email address.",
      });
    } catch (error: any) {
      const firebaseError = error as FirebaseError;
      toast({
        title: "Failed to Send Email",
        description:
          firebaseError.code === "auth/user-not-found"
            ? "No user found with this email address."
            : "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6">
      {emailSent ? (
        <div className="text-center">
          <h3 className="text-lg font-medium">Email Sent</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            A password reset link has been sent to your email address. Please
            check your inbox.
          </p>
        </div>
      ) : (
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
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Sending..."
                : "Send Password Reset Link"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
