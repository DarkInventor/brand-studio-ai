import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Instagram, Sparkles } from "lucide-react"
import { createServerClient } from "@/lib/supabase/server"
import { UserProfileDropdown } from "@/components/user-profile-dropdown"
import { PressSection } from "@/components/ui/press-section"

export default async function LandingPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isLoggedIn = !!session

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex gap-2 items-center">
            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
              <span className="text-xl font-bold">B</span>
              <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
                AI
              </span>
            </div>
            <div className="font-bold text-xl flex items-center">
              BrandStudioAI
              <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-md font-medium">
                BETA
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {!isLoggedIn && (
              <nav className="flex items-center space-x-6">
                <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
                  Features
                </Link>
                <Link href="#demo" className="text-sm font-medium transition-colors hover:text-primary">
                  How It Works
                </Link>
                <Link href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                  Pricing
                </Link>
                <Link href="#faq" className="text-sm font-medium transition-colors hover:text-primary">
                  FAQ
                </Link>
              </nav>
            )}
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
                  <Link href="/signup">
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
          <button className="flex items-center justify-center rounded-md p-2 text-foreground md:hidden">
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
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle menu</span>
          </button>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    AI-Powered Instagram Growth
                  </div>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Generate Instagram posts that grow your followers 3x faster. No design skills needed.
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    BrandStudioAI creates on-brand images and captions that match your style. Schedule a month of
                    content in 15 minutes instead of 15 hours.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {isLoggedIn ? (
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
                      >
                        Create Instagram Posts <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all hover:shadow-purple-300"
                      >
                        Start Creating Posts <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Button size="lg" variant="outline" className="border-purple-200 hover:bg-purple-100 hover:text-purple-700 transition-all w-[150px]">
                    <Instagram className="mr-2 h-4 w-4" /> Watch Demo
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>47% Higher Engagement</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>15+ Hours Saved Weekly</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="rounded-full bg-green-100 p-1">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span>100% Brand Consistency</span>
                  </div>
                </div>
              </div>
              {/* <div className="flex items-center justify-center">
                <div className="relative aspect-video overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-10"></div>
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-8Tm8nHGL89T4RXx8qzYAAN9kbJJ2NO.png"
                    alt="BrandStudioAI Dashboard"
                    width={700}
                    height={400}
                    className="object-cover"
                  />
                
                </div>
               
              </div> */}
              <div className="flex items-center justify-center overflow-hidden">
      {/* Changed aspect-video to aspect-[9/16] for a tall portrait orientation */}
      <div className="relative aspect-[9/7.5] overflow-hidden rounded-xl border bg-background shadow-xl transition-all hover:shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 z-10"></div>

        {/* Removed the extra nested div that was causing layout issues */}
        <video
          src="https://pub-a49ce427d0254ca983d7c77bb50b7846.r2.dev/brand%20studio.mp4"
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
            </div>
          </div>
        </section>
        <PressSection />
       

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Create a month of Instagram content in minutes
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI understands what makes content go viral and applies it to your brand
                </p>
              </div>
            </div>

            <div className="grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Generate on-brand posts with one click</h3>
                <p className="text-muted-foreground">
                  Tell our AI about your brand, and it creates images and captions that match your style perfectly. No
                  more struggling with design tools or writer's block.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>AI analyzes top-performing content in your niche</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Creates images that match current visual trends</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Writes captions with trending hashtags</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">Try Content Generation</Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-post-lUIx1DtfNNcsqQhFi2u6fkfmr74DW0.png"
                  alt="AI-Generated Instagram Post"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="order-2 md:order-1 overflow-hidden rounded-xl border shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/schedule-XX7MmZx9vXoYiL7guvMGYmfgiXj4SU.png"
                  alt="Content Calendar"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <div className="order-1 md:order-2 flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Schedule posts when your audience is most active</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes when your followers are most likely to engage and schedules your posts at optimal
                  times. Set it once and forget it.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Drag-and-drop calendar interface</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Automatic posting at optimal times</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Consistent posting improves algorithm ranking</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">See Scheduling Demo</Button>
                </div>
              </div>
            </div>

            <div className="mt-20 grid gap-12 md:grid-cols-2 lg:gap-16 xl:gap-20">
              <div className="flex flex-col space-y-4">
                <h3 className="text-2xl font-bold">Track growth and optimize your strategy</h3>
                <p className="text-muted-foreground">
                  See which posts perform best and why. Our analytics help you understand what resonates with your
                  audience so you can create more of what works.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Track follower growth and engagement rates</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Identify your best-performing content</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 h-5 w-5 text-green-500 mt-0.5" />
                    <span>Get AI recommendations to improve performance</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">View Analytics Demo</Button>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border shadow-lg">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/summary-7H32Oso9LcuhsAwQRHL2U4foVG6hcf.png"
                  alt="Growth Analytics"
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  Real Results
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Our customers see growth in 30 days or less
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Don't take our word for it—see the numbers
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
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
                    className="h-8 w-8 text-purple-600"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold mb-2">47%</h3>
                <p className="text-xl font-semibold text-purple-600 mb-2">Higher Engagement</p>
                <p className="text-muted-foreground">
                  Average increase in likes, comments, and shares after just 30 days of consistent posting
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
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
                    className="h-8 w-8 text-purple-600"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold mb-2">3x</h3>
                <p className="text-xl font-semibold text-purple-600 mb-2">Faster Follower Growth</p>
                <p className="text-muted-foreground">
                  Customers grow their audience three times faster than with manual content creation
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl border border-purple-100 shadow-sm">
                <div className="rounded-full w-16 h-16 bg-purple-100 flex items-center justify-center mb-4">
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
                    className="h-8 w-8 text-purple-600"
                  >
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <h3 className="text-4xl font-bold mb-2">15+</h3>
                <p className="text-xl font-semibold text-purple-600 mb-2">Hours Saved Weekly</p>
                <p className="text-muted-foreground">
                  Eliminate time spent on content creation, design, and scheduling with our automated workflow
                </p>
              </div>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl border border-purple-100 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-center">Common Concerns About AI Content Creation</h3>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
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
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Won't AI content look generic and inauthentic?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our AI is trained on your specific brand voice and style. It creates content that's uniquely
                        yours, not generic templates.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
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
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">I don't have design skills. Will I still get good results?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Absolutely! Our AI handles all the design work. You just provide basic guidance on what you
                        want, and we create professional-quality content.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
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
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Is it complicated to set up?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Not at all. Our onboarding takes just 5 minutes. Create a brand kit, connect your Instagram, and
                        you're ready to start generating content.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="rounded-full bg-red-100 p-1 mr-3 mt-1">
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
                        className="h-3 w-3 text-red-600"
                      >
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">What if I don't like the generated content?</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        You have full editing control. Don't like something? Regenerate it or make manual edits. Our AI
                        learns from your preferences over time.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  Success Stories
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  From struggling to thriving on Instagram
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Real customers sharing their growth journey with BrandStudioAI
                </p>
              </div>
            </div>

            <div className="mx-auto max-w-6xl mt-12 grid gap-8 md:grid-cols-3">
              <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-12 w-12 border">
                      <Image
                        src="/images/testimonial-1.png"
                        alt="Sarah Johnson"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Marketing Director, TechFlow</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "Before BrandStudioAI, I spent 20+ hours weekly on content. Now I spend 2 hours and get better
                    results. Our engagement increased by 45% and we've gained 5,800 new followers in just 3 months."
                  </blockquote>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center text-green-600">
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
                        className="mr-1 h-4 w-4"
                      >
                        <path d="m5 12 5 5 9-9" />
                      </svg>
                      <span>5,800 New Followers</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-12 w-12 border">
                      <Image
                        src="/man-entrepreneur.png"
                        alt="Michael Chen"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">Founder, Wellness Collective</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "As a solopreneur, I couldn't afford a design team. BrandStudioAI gives me professional content that
                    perfectly matches my brand. My follower count went from 2,300 to 7,800 in 6 months, and sales from
                    Instagram are up 78%."
                  </blockquote>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center text-green-600">
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
                        className="mr-1 h-4 w-4"
                      >
                        <path d="m5 12 5 5 9-9" />
                      </svg>
                      <span>78% Sales Increase</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="rounded-full overflow-hidden h-12 w-12 border">
                      <Image
                        src="/images/testimonial-3.png"
                        alt="Emma Rodriguez"
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold">Emma Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">Social Media Manager, StyleHouse</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="h-5 w-5"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground italic mb-4">
                    "Our engagement rate jumped from 2.1% to 5.8% in just two months with BrandStudioAI. The consistency
                    in our posts has dramatically improved our brand recognition, and we're now getting approached by
                    major brands for collaborations."
                  </blockquote>
                  <div className="flex items-center gap-3 text-sm font-medium">
                    <div className="flex items-center text-green-600">
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
                        className="mr-1 h-4 w-4"
                      >
                        <path d="m5 12 5 5 9-9" />
                      </svg>
                      <span>176% Engagement Increase</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-flex items-center rounded-lg bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                  FAQ
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to know about BrandStudioAI
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-3xl mt-12 space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left">What is BrandStudioAI?</AccordionTrigger>
                  <AccordionContent>
                    BrandStudioAI is an AI-powered platform for generating, managing, and previewing Instagram-ready
                    posts for brands. It leverages OpenAI for creative content generation and helps marketing teams,
                    agencies, and solo founders automate and streamline their social media content creation process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left">How does BrandStudioAI generate content?</AccordionTrigger>
                  <AccordionContent>
                    BrandStudioAI uses advanced AI models from OpenAI to generate both images and captions that match
                    your brand's style and tone. You create a Brand Kit with your brand details, and our AI uses this
                    information to create content that's consistent with your brand identity.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left">Can I edit the generated content?</AccordionTrigger>
                  <AccordionContent>
                    Yes! All generated content can be edited. You can modify captions, regenerate images, and make any
                    adjustments needed before scheduling or publishing your posts.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left">
                    How many posts can I generate with each plan?
                  </AccordionTrigger>
                  <AccordionContent>
                    The Starter plan includes 100 posts per month, the Professional plan includes 200 posts per month,
                    and the Enterprise plan includes 500 posts per month. If you need more, you can purchase additional
                    credits.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left">Can I publish directly to Instagram?</AccordionTrigger>
                  <AccordionContent>
                    Yes, BrandStudioAI allows you to connect your Instagram account and publish posts directly from the
                    platform. You can also schedule posts for future publication at optimal times.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-left">What image quality can I expect?</AccordionTrigger>
                  <AccordionContent>
                    Image quality depends on your plan. The Starter plan provides low-quality images (1024x1024), the
                    Professional plan offers medium-quality images with more size options, and the Enterprise plan
                    delivers high-quality images in all available sizes and formats.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-left">Is there a free trial?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer a 7-day free trial with access to all features of the Professional plan. No credit
                    card is required to start your trial.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-left">How long are my images stored?</AccordionTrigger>
                  <AccordionContent>
                    Image storage varies by plan: 7 days for Starter, 30 days for Professional, and 90 days for
                    Enterprise. You can download your images at any time during the storage period. Extended storage
                    options are available for an additional fee.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-600 to-purple-700 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to grow your Instagram following?
                </h2>
                <p className="max-w-[900px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of creators and brands who are saving time and growing faster with BrandStudioAI
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
                    >
                      Create Your First Post
                    </Button>
                  </Link>
                ) : (
                  <Link href="/signup">
                    <Button
                      size="lg"
                      className="bg-white text-purple-600 hover:bg-purple-100 shadow-lg shadow-purple-800/20 transition-all"
                    >
                      Start Your 7-Day Free Trial
                    </Button>
                  </Link>
                )}
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 border  text-white hover:bg-purple-700 transition-all bg-purple-600"
                >
                  Schedule a Demo
                </Button>
              </div>
              <p className="text-sm text-purple-200 mt-4">No credit card required. Cancel anytime.</p>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t py-6 md:py-12">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex gap-2 items-center">
                <div className="relative h-9 w-9 overflow-hidden rounded-md bg-gradient-to-br from-purple-500 to-purple-700 text-white flex items-center justify-center">
                  <span className="text-xl font-bold">B</span>
                  <span className="absolute top-0 right-0 bg-gradient-to-br from-blue-400 to-purple-500 text-[8px] px-1 rounded-bl-md font-semibold">
                    AI
                  </span>
                </div>
                <div className="font-bold text-xl">BrandStudioAI</div>
              </div>
              <p className="text-sm text-muted-foreground">
                AI-powered platform for generating, managing, and previewing Instagram-ready posts for brands.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} BrandStudioAI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
