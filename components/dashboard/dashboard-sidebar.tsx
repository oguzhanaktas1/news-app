"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Newspaper, BookmarkIcon, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Home",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Favorites",
      href: "/dashboard/favorites",
      icon: BookmarkIcon,
    },
    {
      title: "Categories",
      href: "/news/all",
      icon: Newspaper,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: Bell,
    },
  ]

  return (
    <div className="bg-card rounded-lg border p-4">
      <h2 className="font-semibold mb-4 px-2">Menu</h2>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            )}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
