import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/brand-logo"
import { ChevronRight, Instagram, Twitter, Facebook, Mail, ArrowRight } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"

export default async function LandingPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Section */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between py-4">
          <BrandLogo size="md" />
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Dashboard
                </Link>
                <UserProfileDropdown />
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium transition-colors hover:text-primary">
                  Sign In
                </Link>
                <Link href="/signup" className="hidden sm:block">
                  <Button size="sm" variant="default">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted -z-10"></div>
          <div className="absolute inset-0 opacity-30 bg-[url('/images/neural-pattern.png')] bg-center -z-10"></div>

          <div className="container flex flex-col items-center text-center">
            <div className="animate-in slide-in-from-bottom">
              <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary to-secondary">
                Create Stunning Instagram Posts in Minutes!
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                Boost your brand's social media presence with 100 custom Instagram posts that align perfectly with your
                brand identity.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button size="lg" className="h-12 px-8 text-lg w-full sm:w-auto">
                    Start for Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg w-full sm:w-auto">
                  Watch Demo
                </Button>
              </div>
            </div>

            <div
              className="mt-16 grid w-full max-w-screen-lg grid-cols-1 gap-8 md:grid-cols-2 animate-in fade-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg transition-transform hover:scale-[1.02] duration-500">
                <Image src="/images/hero-dashboard.jpg" alt="BrandStudio AI Dashboard" fill className="object-cover" />
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl border shadow-lg transition-transform hover:scale-[1.02] duration-500">
                <Image src="/images/hero-posts.jpg" alt="Generated Instagram Posts" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="container">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose BrandStudio AI?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Save time and ensure brand consistency with AI-powered Instagram posts.
              </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "100 Custom Posts in Minutes",
                  description: "Generate posts quickly and effortlessly.",
                  image: "/images/feature-speed.jpg",
                },
                {
                  title: "Brand Consistency",
                  description: "All posts are tailored to your brand's identity and tone.",
                  image: "/images/feature-brand.jpg",
                },
                {
                  title: "Easy Scheduling",
                  description: "Drag-and-drop calendar to schedule posts directly to Instagram.",
                  image: "/images/feature-schedule.png",
                },
                {
                  title: "No Design Skills Needed",
                  description: "Perfect for businesses and freelancers without a design team.",
                  image: "/images/feature-ai.png",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center rounded-xl border p-6 text-center shadow-sm transition-all hover:shadow-md hover:border-primary/20 hover:bg-primary/5"
                >
                  <div className="mb-6 h-32 w-32 overflow-hidden rounded-full transition-transform group-hover:scale-105">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 -z-10"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('/images/neural-pattern.png')] bg-center -z-10"></div>

          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Ready to Transform Your Instagram?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              Join thousands of businesses saving time and improving their social media presence with BrandStudio AI.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="default"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                >
                  Sign Up Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="border-t bg-background py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <BrandLogo size="sm" />
              <p className="text-sm text-muted-foreground">
                AI-powered Instagram content creation for businesses and creators.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="h-5 w-5" />
                  <span className="sr-only">Email</span>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Product</h3>
              <ul className="space-y-2 text-sm">
                {["Features", "Pricing", "Testimonials", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Company</h3>
              <ul className="space-y-2 text-sm">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Connect</h3>
              <p className="mb-4 text-sm text-muted-foreground">Need Help? Contact Us at support@brandstudio.ai</p>
              <div className="mt-6">
                <Link href="/signup">
                  <Button variant="default" className="w-full">
                    Sign Up Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 BrandStudio AI. All rights reserved.</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
