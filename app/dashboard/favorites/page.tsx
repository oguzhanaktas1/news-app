"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { FavoritesList } from "@/components/dashboard/favorites-list"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function FavoritesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login")  // Redirect to login if no user
      } else {
        setLoading(false)  // Stop loading if user exists
      }
    })

    return () => unsubscribe()
  }, [router])

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-6">Your Favorite News</h1>
            <FavoritesList />
          </div>
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
