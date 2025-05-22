"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAuth } from "firebase/auth";
import {
  EmailAuthProvider,
  updateProfile as firebaseUpdateProfile,
  reauthenticateWithCredential,
  sendEmailVerification,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export function SettingsTabs() {
  const [photoURL, setPhotoURL] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
      setEmail(user.email || "");

      // Load bio if available
    }
  }, []);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const photoURL = formData.get("photoURL") as string;

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User session not found.");
      }

      await firebaseUpdateProfile(user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Profile update failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  function handleSelectFromGallery() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setPhotoURL(imageUrl);

        // Optional: Update Firebase profile photo URL
        const user = auth.currentUser;
        if (user) {
          await firebaseUpdateProfile(user, { photoURL: imageUrl });
        }

        toast({
          title: "Photo uploaded",
          description: "Your profile photo has been updated.",
        });
        setOpenDialog(false);
      }
    };
    input.click();
  }

  function handleTakePhoto() {
    // Use MediaDevices API for camera access
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // A video element can be created here for advanced implementation
        toast({
          title: "Camera supported",
          description:
            "A dedicated camera component can be integrated for capturing photos.",
        });
      })
      .catch(() => {
        toast({
          title: "Camera error",
          description:
            "Unable to access the camera. Please check browser permissions.",
          variant: "destructive",
        });
      });
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "New password and confirmation must be the same.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    const user = auth.currentUser;

    if (!user || !user.email) {
      toast({
        title: "User not found",
        description: "Please log in again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });

      event.currentTarget.reset();
    } catch (error: any) {
      console.log("Firebase error object:", error);

      const errorCode =
        error && typeof error === "object" && "code" in error
          ? error.code
          : null;

      let errorMessage = "An error occurred. Please try again.";

      if (errorCode === "auth/wrong-password") {
        errorMessage = "Your current password is incorrect.";
      } else if (errorCode === "auth/weak-password") {
        errorMessage = "The new password is too weak. Please choose a stronger password.";
      }

      toast({
        title: "Password change failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function changeEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const newEmail = formData.get("newEmail") as string;
    const password = formData.get("password") as string;

    const user = auth.currentUser;

    if (!user || !user.email) {
      toast({
        title: "User not found",
        description: "Please log in again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Re-authenticate
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // 2. Update email
      await updateEmail(user, newEmail);

      // 3. Send verification email to new address
      await sendEmailVerification(user);

      toast({
        title: "Verification email sent",
        description: "A verification link has been sent to your new email address.",
      });

      event.currentTarget.reset();
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";

      if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "This email address is already used by another account.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Your current password is incorrect.";
      }

      toast({
        title: "Email change failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="email">Email</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Card className="p-6">
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full Name"
                />
              </div>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild>
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt="Profile Photo"
                      onClick={() => setOpenDialog(true)}
                      className="w-12 h-12 rounded-full object-cover cursor-pointer"
                    />
                  ) : (
                    <div
                      onClick={() => setOpenDialog(true)}
                      className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer"
                    >
                      <span className="text-gray-600 text-sm">
                        No Photo
                      </span>
                    </div>
                  )}
                </DialogTrigger>

                <DialogContent className="text-center">
                  <DialogHeader>
                    <DialogTitle>Update Profile Photo</DialogTitle>
                  </DialogHeader>

                  <div className="flex flex-col items-center gap-4">
                    <Button
                      onClick={handleSelectFromGallery}
                      variant="outline"
                      className="w-full"
                    >
                      Select from Gallery
                    </Button>
                    <Button
                      onClick={handleTakePhoto}
                      variant="outline"
                      className="w-full"
                    >
                      Take Photo with Camera
                    </Button>
                  </div>

                  <DialogFooter>
                    <Button
                      onClick={() => setOpenDialog(false)}
                      variant="secondary"
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About Me</Label>
              <Input
                id="bio"
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write something about yourself"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="password">
        <Card className="p-6">
          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="email">
        <Card className="p-6">
          <form onSubmit={changeEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentEmail">Current Email</Label>
              <Input id="currentEmail" value={email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newEmail">New Email</Label>
              <Input id="newEmail" name="newEmail" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Changing..." : "Change Email"}
            </Button>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
