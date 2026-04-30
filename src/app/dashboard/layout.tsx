"use client"

import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, LogOut, Briefcase } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  return (
    <div className="flex min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 flex-col border-r bg-white dark:bg-zinc-900 hidden md:flex">
        <div className="p-6 border-b flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-indigo-600" />
          <span className="font-bold text-lg">Task Manager</span>
        </div>
        <div className="flex-1 py-4">
          <nav className="grid gap-1 px-4">
            <Link href="/dashboard" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${pathname === "/dashboard" ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-100" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"}`}>
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            <Link href="/dashboard/projects" className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${pathname.startsWith("/dashboard/projects") ? "bg-indigo-100 text-indigo-900 dark:bg-indigo-900/50 dark:text-indigo-100" : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"}`}>
              <Briefcase className="h-4 w-4" />
              Projects
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
              {session?.user?.name?.[0] || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{session?.user?.name}</span>
              <span className="text-xs text-zinc-500 capitalize">{session?.user?.role?.toLowerCase()}</span>
            </div>
          </div>
          <Button variant="outline" className="w-full justify-start text-zinc-500" onClick={() => signOut({ callbackUrl: "/login" })}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 lg:h-[60px] border-b flex items-center gap-4 px-6 md:hidden bg-white dark:bg-zinc-900">
          <span className="font-bold text-lg">Task Manager</span>
        </header>
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
