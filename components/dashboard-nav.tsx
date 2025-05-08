"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, Calendar, Package, LogOut, Palette, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
  },
  {
    title: "Schedule",
    href: "/scheduler",
    icon: Calendar,
  },
  {
    title: "Summary",
    href: "/summary",
    icon: Package,
  },
  {
    title: "Brand Kit",
    href: "/brand-kit",
    icon: Palette,
  },
]

export function DashboardNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)

    // Get user session
    async function getUserSession() {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) {
        setUser(session.user)
      }
    }

    getUserSession()
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Mobile Navigation Header */}
      <div className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between border-b px-4">
                <BrandLogo size="sm" href="/" className="font-semibold" />
              </div>
              <nav className="flex-1 overflow-auto p-4">
                <ul className="grid gap-2">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          pathname === item.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="border-t p-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => setOpen(false)}
                >
                  <LogOut className="h-5 w-5" />
                  Profile
                </Link>
                <form
                  action={async () => {
                    await fetch("/api/auth/signout", { method: "POST" })
                    window.location.href = "/"
                  }}
                >
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <BrandLogo size="sm" href="/" />

        <div className="ml-auto">
          <UserProfileDropdown />
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden h-screen w-64 flex-col border-r bg-muted/40 md:flex">
        <div className="flex h-16 items-center justify-between border-b px-6">
          <BrandLogo size="sm" href="/" />
        </div>
        <nav className="flex-1 overflow-auto p-4">
          <ul className="grid gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t p-4">
          <div className="mb-4 flex items-center gap-3 px-3 py-2">
            <UserProfileDropdown />
          </div>
        </div>
      </div>
    </>
  )
}
