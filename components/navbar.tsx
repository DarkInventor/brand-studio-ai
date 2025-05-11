import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl">
            Brand Studio
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-sm font-medium">
              Pricing
            </Link>
            <Link href="/direct-checkout" className="text-sm font-medium">
              Direct Checkout
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
