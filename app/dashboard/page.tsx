"use client"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { NewsCategories } from "@/components/dashboard/news-categories"
import { NewsFeed } from "@/components/dashboard/news-feed"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { getAuth, onAuthStateChanged } from "firebase/auth"
import { saveUserCategories, getUserCategories } from "../../lib/firebaseHelpers"

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["sports", "technology"])
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login")
      } else {
        setUserId(user.uid)
        // Load user preferences
        const categories = await getUserCategories(user.uid)
        setSelectedCategories(categories.length ? categories : ["sports", "technology"])
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [router])

  if (loading) return <div>Loading...</div>

  const handleSave = async () => {
    if (!userId) return
    setIsSaving(true)
    try {
      await saveUserCategories(userId, selectedCategories)
      // alert("Preferences saved!")
    } catch (error) {
      // alert("Save error, please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold mb-6">Your News Feed</h1>

            {/* ✅ Added required props */}
            <NewsCategories
              selected={selectedCategories}
              onChange={setSelectedCategories}
              onSave={handleSave}
            />

            <div className="mt-6">
              {/* You might want to pass selectedCategories prop to NewsFeed */}
              <NewsFeed selectedCategories={selectedCategories} />
            </div>
          </div>
          <div className="lg:col-span-1">
            <DashboardSidebar />
          </div>
        </div>
      </main>
    </div>
  )
}
