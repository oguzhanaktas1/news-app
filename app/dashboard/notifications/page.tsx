"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import NotificationList from "@/components/notifications/NotificationList";
import NotificationToggle from "@/components/notifications/NotificationToggle";
import NotificationPreferences from "@/components/notifications/NotificationPreferences";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";

export default function NotificationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login"); // Redirect to login page if no user
      } else {
        setLoading(false); // Stop loading if user exists
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <h1 className="text-3xl font-bold mb-6">Notifications</h1>

            <NotificationToggle />
            <NotificationPreferences />
            <NotificationList />
          </div>
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
