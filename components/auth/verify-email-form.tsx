"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import {
  sendEmailVerification,
  onAuthStateChanged,
  reload,
} from "firebase/auth";

export function VerifyEmailForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleResendEmail() {
    if (!user) return;

    setIsLoading(true);

    try {
      await sendEmailVerification(user);

      toast({
        title: "Email sent",
        description:
          "Verification link has been resent to your email address.",
      });
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleVerify() {
    if (!user) return;

    setIsLoading(true);

    try {
      // Reload user info to get the latest email verification status
      await reload(user);

      if (user.emailVerified) {
        toast({
          title: "Email verified",
          description: "Your account has been successfully verified.",
        });

        router.push("/dashboard");
      } else {
        toast({
          title: "Email not verified yet",
          description: "Please click the link sent to your email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 text-center">
      <div>
        <h3 className="text-lg font-medium">Email Verification</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          We sent a verification link to your email address. Please check your inbox.
        </p>
      </div>
      <div className="grid gap-2">
        <Button onClick={handleVerify} disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify My Email"}
        </Button>
        <Button
          variant="outline"
          onClick={handleResendEmail}
          disabled={isLoading}
        >
          {isLoading
            ? "Sending..."
            : "Resend Verification Email"}
        </Button>
      </div>
    </div>
  );
}
