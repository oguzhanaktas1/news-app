import type React from "react"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  backLink: string
  backLinkText: string
}

export function AuthLayout({ children, title, description, backLink, backLinkText }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
        <Link
          href={backLink}
          className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          {backLinkText}
        </Link>
      </div>
    </div>
  )
}
