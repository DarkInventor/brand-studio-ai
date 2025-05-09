"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutGrid, Calendar, Package, LogOut, Palette, Menu, ChevronDown, User, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { BrandLogo } from "@/components/brand-logo"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { createClient } from "@/lib/supabase/client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutGrid,
    subItems: [
      {
        title: "Image Posts",
        href: "/dashboard/image-posts",
      },
      {
        title: "Video Posts",
        href: "/dashboard/video-posts",
        comingSoon: true,
      },
      {
        title: "Commercial Ads",
        href: "/dashboard/commercial-ads",
        comingSoon: true,
      },
    ],
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
  const [openCollapsible, setOpenCollapsible] = useState<string | null>(
    // Auto-expand the section that contains the current path
    navItems.find((item) => item.subItems?.some((subItem) => pathname === subItem.href))?.title || null,
  )

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

  const renderNavItem = (item: any) => {
    const isActive = pathname === item.href
    const hasActiveChild = item.subItems?.some((subItem: any) => pathname === subItem.href)

    if (item.subItems) {
      return (
        <Collapsible
          open={openCollapsible === item.title}
          onOpenChange={(isOpen) => setOpenCollapsible(isOpen ? item.title : null)}
          className="w-full"
        >
          <div className="flex w-full items-center">
            <Link
              href={item.href}
              onClick={(e) => {
                e.stopPropagation() // Prevent triggering the collapsible
                setOpen(false)
              }}
              className={cn(
                "flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                isActive || hasActiveChild
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className={cn("h-5 w-5", (isActive || hasActiveChild) && "text-primary")} />
              <span>{item.title}</span>
            </Link>
            <CollapsibleTrigger className="flex h-9 w-9 items-center justify-center rounded-lg p-0 hover:bg-muted transition-colors">
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  openCollapsible === item.title && "rotate-180",
                )}
              />
              <span className="sr-only">Toggle {item.title} menu</span>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="animate-in slide-in-from-top-2 duration-200">
            <div className="mt-1 pl-8 relative before:absolute before:left-2 before:top-0 before:h-full before:w-px before:bg-border">
              <ul className="grid gap-1 py-1">
                {item.subItems.map((subItem: any) => (
                  <li key={subItem.href}>
                    <Link
                      href={subItem.comingSoon ? "#" : subItem.href}
                      onClick={(e) => {
                        if (subItem.comingSoon) {
                          e.preventDefault()
                          return
                        }
                        setOpen(false)
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                        pathname === subItem.href
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        subItem.comingSoon && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <span>{subItem.title}</span>
                      {subItem.comingSoon && (
                        <Badge
                          variant="outline"
                          className="ml-auto text-xs px-1 py-0 h-5 border-primary/20 bg-primary/5"
                        >
                          Soon
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          pathname === item.href
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        )}
      >
        <item.icon className={cn("h-5 w-5", pathname === item.href && "text-primary")} />
        <span>{item.title}</span>
      </Link>
    )
  }

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
                {/* <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="h-8 w-8 rounded-full">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button> */}
              </div>
              <nav className="flex-1 overflow-auto p-4">
                <div className="mb-4">
                  <Link
                    href="/"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    onClick={() => setOpen(false)}
                  >
                    <Home className="h-5 w-5" />
                    Home
                  </Link>
                </div>
                <div className="mb-2 px-3">
                  <h3 className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
                    Content Management
                  </h3>
                </div>
                <ul className="grid gap-1 mb-6">
                  {navItems.map((item) => (
                    <li key={item.href}>{renderNavItem(item)}</li>
                  ))}
                </ul>
                <div className="mb-2 px-3">
                  <h3 className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Account</h3>
                </div>
                <ul className="grid gap-1">
                  <li>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      <User className="h-5 w-5" />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      onClick={() => setOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <form
                      action={async () => {
                        await fetch("/api/auth/signout", { method: "POST" })
                        window.location.href = "/"
                      }}
                    >
                      <button
                        type="submit"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </form>
                  </li>
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <BrandLogo size="sm" href="/" />

        <div className="ml-auto">
          <UserProfileDropdown />
        </div>
      </div>

      {/* Desktop Navigation */}
      <TooltipProvider delayDuration={300}>
        <div className="hidden h-screen w-64 flex-col border-r bg-card md:flex">
          <div className="flex h-16 items-center border-b px-6 py-8">
            <BrandLogo size="sm" href="/" className="font-semibold" />
          </div>
          <nav className="flex-1 overflow-auto p-4">
            <div className="mb-2 px-3">
              <h3 className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Content Management</h3>
            </div>
            <ul className="grid gap-1 mb-6">
              {navItems.map((item) => (
                <li key={item.href}>{renderNavItem(item)}</li>
              ))}
            </ul>
            <div className="mb-2 px-3">
              <h3 className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Account</h3>
            </div>
            <ul className="grid gap-1">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Manage your profile</TooltipContent>
                </Tooltip>
              </li>
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Configure app settings</TooltipContent>
                </Tooltip>
              </li>
            </ul>
          </nav>
          <div className="border-t p-4">
            <div className="flex items-center justify-between px-2 py-3">
              <UserProfileDropdown />
              <Tooltip>
                <TooltipTrigger asChild>
                  <form
                    action={async () => {
                      await fetch("/api/auth/signout", { method: "POST" })
                      window.location.href = "/"
                    }}
                  >
                    <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 rounded-full">
                      <LogOut className="h-4 w-4" />
                      <span className="sr-only">Sign Out</span>
                    </Button>
                  </form>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  )
}

function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
