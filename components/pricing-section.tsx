"use client"

import { useState, useEffect } from "react"
import { Check, HelpCircle, Instagram, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { loadStripe } from "@stripe/stripe-js"
import { supabase } from "@/lib/supabase"
import { STRIPE_PRICES, PLAN_CREDITS } from "@/config/stripe"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NumberTicker } from "@/components/magicui/number-ticker"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PricingFeature {
  name: string
  included: boolean
  tooltip?: string
}

interface PricingPlan {
  name: string
  price: string
  description: string
  features: PricingFeature[]
  cta: string
  popular?: boolean
  imagesPerMonth: string
  stripePriceId: string
  productId: string
}

export function PricingSection() {
  const [loading, setLoading] = useState(false)
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)

  // --- Calculator State ---
  const [calcCredits, setCalcCredits] = useState(500)
  const [calcType, setCalcType] = useState<'image' | 'video'>('image')
  const [calcDuration, setCalcDuration] = useState(5)
  const [calcQuality, setCalcQuality] = useState('360p')
  const [calcMotion, setCalcMotion] = useState('normal')

  useEffect(() => {
    // Get current user and subscription status
    const fetchUserAndSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        const { data: profile } = await supabase
          .from("profiles")
          .select("is_subscribed, subscription_status, subscription_plan, credits")
          .eq("id", user.id)
          .single()

        setSubscription(profile)
      }
    }

    fetchUserAndSubscription()
  }, [])

  const handleCheckout = async (stripePriceId: string, planName: string) => {
    try {
      setLoading(true)
      setLoadingPlanId(planName)

      // Direct checkout with Stripe.js
      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to load")

      // First try to create a checkout session via our API
      try {
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            price: stripePriceId,
            planName: planName,
            planInterval: "month",
            credits: PLAN_CREDITS[planName as keyof typeof PLAN_CREDITS] || 0,
          }),
        })

        if (response.ok) {
          const { url } = await response.json()
          // Redirect to Stripe Checkout
          if (url) {
            window.location.href = url
            return
          }
        }

        // If API fails, fall back to direct Stripe checkout
        console.warn("API checkout failed, falling back to direct Stripe checkout")
      } catch (error) {
        console.error("API checkout error:", error)
        // Continue to fallback
      }

      // Fallback: Create checkout session directly with Stripe.js
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: stripePriceId, quantity: 1 }],
        mode: "subscription",
        successUrl: window.location.origin + "/payment/success",
        cancelUrl: window.location.origin + "/payment/canceled",
      })

      if (error) throw error
    } catch (error) {
      console.error("Error:", error)
      alert("There was an error creating your checkout session. Please try again.")
    } finally {
      setLoading(false)
      setLoadingPlanId(null)
    }
  }

  const tagline = "Automate and streamline your social media content creation."
  const generalInclusions = [
    "Commercial usage rights",
    "Comprehensive brand kit management",
    "Access to our powerful AI-powered post generation tools",
  ]

  // Update plans with Stripe price IDs
  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for individuals just getting started. Generate up to 500 images or ~125 basic 5s videos per month.",
      imagesPerMonth: "500 Images or ~125 basic 5s videos/month",
      stripePriceId: STRIPE_PRICES.STARTER_MONTHLY,
      productId: "prod_SIAzrgXJe7WltQ",
      features: [
        { name: "Standard image quality", included: true },
        { name: "AI-powered video generation (uses credits, see pricing table)", included: true, tooltip: "You can use your monthly credits for either images or videos. Videos cost more credits depending on quality and duration. See pricing table for details." },
        {
          name: "Basic post scheduling (up to 500 active scheduled posts)",
          included: true,
          tooltip: "Schedule up to 2000 posts in advance.",
        },
        {
          name: "Fundamental post management (view/edit)",
          included: true,
          tooltip: "View and edit your scheduled posts.",
        },
        { name: "Basic support", included: true },
        { name: "Analytics", included: false },
        { name: "Advanced editing tools", included: false },
        { name: "Comprehensive post management (delete/regenerate captions)", included: false },
        { name: "Priority image generation", included: false },
        { name: "Priority support", included: false },
        { name: "Team collaboration", included: false },
        { name: "API access", included: false },
        { name: "Custom templates", included: false },
        { name: "Onboarding support", included: false },
        { name: "Unlimited active post scheduling", included: false },
        { name: "Premium image generation priority", included: false },
      ],
      cta: "Get Started",
    },
    {
      name: "Pro",
      price: "$24",
      description: "Ideal for creators and small businesses. Generate up to 2,000 images or ~500 basic 5s videos per month.",
      imagesPerMonth: "2,000 Images or ~500 basic 5s videos/month",
      stripePriceId: STRIPE_PRICES.PRO_MONTHLY,
      productId: "prod_SIAzrgXJe7WltQ",
      popular: true,
      features: [
        { name: "Priority image generation", included: true, tooltip: "Faster image creation with higher priority." },
        { name: "AI-powered video generation (uses credits, see pricing table)", included: true, tooltip: "You can use your monthly credits for either images or videos. Videos cost more credits depending on quality and duration. See pricing table for details." },
        {
          name: "Advanced post scheduling (up to 2000 active scheduled posts)",
          included: true,
          tooltip: "Schedule up to 500 posts in advance.",
        },
        {
          name: "Comprehensive post management (view/edit/delete/regenerate captions)",
          included: true,
          tooltip: "Full control over your scheduled posts.",
        },
        { name: "In-depth analytics", included: true },
        { name: "Advanced editing tools", included: true },
        { name: "Priority support", included: true },
        { name: "Team collaboration", included: false },
        { name: "API access", included: false },
        { name: "Custom templates", included: false },
        { name: "Onboarding support", included: false },
        { name: "Unlimited active post scheduling", included: false },
        { name: "Premium image generation priority", included: false },
      ],
      cta: "Upgrade to Pro",
    },
    {
      name: "Business",
      price: "$59",
      description: "For teams and growing businesses. Generate up to 5,000 images or ~1,250 basic 5s videos per month.",
      imagesPerMonth: "5,000 Images or ~1,250 basic 5s videos/month",
      stripePriceId: STRIPE_PRICES.BUSINESS_MONTHLY,
      productId: "prod_SIAzrgXJe7WltQ",
      features: [
        { name: "Team collaboration features", included: true, tooltip: "Invite up to 10 team members." },
        { name: "Unlimited active post scheduling", included: true, tooltip: "No cap on scheduled posts." },
        { name: "API access", included: true },
        { name: "Custom templates", included: true },
        { name: "Dedicated onboarding support", included: true },
        { name: "Premium image generation priority", included: true, tooltip: "Top-tier image generation speed and quality." },
        { name: "AI-powered video generation (uses credits, see pricing table)", included: true, tooltip: "You can use your monthly credits for either images or videos. Videos cost more credits depending on quality and duration. See pricing table for details." },
        { name: "All Pro features", included: true, tooltip: "Includes everything in the Pro plan." },
      ],
      cta: "Contact Sales",
    },
  ]

  // Helper function to determine if a plan is the current subscription
  const isCurrentPlan = (planName: string) => {
    return subscription?.subscription_plan === planName && subscription?.is_subscribed
  }

  // Helper function to get button text based on subscription status
  const getButtonText = (plan: PricingPlan) => {
    if (isCurrentPlan(plan.name)) {
      return "Current Plan"
    }
    return plan.cta
  }

  // Credit cost lookup for video
  function getVideoCreditCost({ quality, duration, motion_mode }: { quality: string, duration: number, motion_mode: string }) {
    quality = String(quality).toLowerCase();
    duration = Number(duration);
    motion_mode = String(motion_mode).toLowerCase();
    if (duration === 5) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 4;
      if (quality === "720p" && motion_mode === "normal") return 5;
      if (quality === "1080p" && motion_mode === "normal") return 11;
      if ((quality === "360p" || quality === "540p") && motion_mode === "smooth") return 8;
      if (quality === "720p" && motion_mode === "smooth") return 11;
    }
    if (duration === 8) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 8;
      if (quality === "720p" && motion_mode === "normal") return 11;
    }
    if (duration === 10) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 10;
      if (quality === "720p" && motion_mode === "normal") return 14;
      if (quality === "1080p" && motion_mode === "normal") return 22;
    }
    if (duration === 30) {
      if ((quality === "360p" || quality === "540p") && motion_mode === "normal") return 30;
      if (quality === "720p" && motion_mode === "normal") return 41;
      if (quality === "1080p" && motion_mode === "normal") return 65;
    }
    return null;
  }

  // Plan credit presets
  const planCredits = {
    Starter: 500,
    Pro: 2000,
    Business: 5000,
  }

  // Calculate result
  let calcResult = 0
  if (calcType === 'image') {
    calcResult = Math.floor(calcCredits / 1)
  } else {
    const cost = getVideoCreditCost({ quality: calcQuality, duration: calcDuration, motion_mode: calcMotion }) || 1
    calcResult = Math.floor(calcCredits / cost)
  }

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Calculator UI with modern components */}
      <Card className="mb-10 max-w-2xl mx-auto border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Credit Usage Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center justify-between mb-1">
                <span className="block text-xs font-medium">Credits</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-gray-400 cursor-help ml-1">ⓘ</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Set the number of credits you want to calculate for. Select a plan to autofill.</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-2">
                <Slider
                  min={1}
                  max={5000}
                  step={1}
                  value={[calcCredits]}
                  onValueChange={([v]) => setCalcCredits(v)}
                  className="w-full"
                />
                <span className="w-12 text-right text-sm font-mono">{calcCredits}</span>
              </div>
            </div>
            <div className="min-w-[140px]">
              <span className="block text-xs font-medium mb-1">Plan</span>
              <Select onValueChange={v => setCalcCredits(planCredits[v as keyof typeof planCredits])}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Custom" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Starter">Starter (500)</SelectItem>
                  <SelectItem value="Pro">Pro (2,000)</SelectItem>
                  <SelectItem value="Business">Business (5,000)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[140px]">
              <span className="block text-xs font-medium mb-1">Content Type</span>
              <Select value={calcType} onValueChange={v => setCalcType(v as 'image' | 'video')}>
                <SelectTrigger className="w-full h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {calcType === 'video' && (
              <>
                <div className="min-w-[120px]">
                  <span className="block text-xs font-medium mb-1">Duration</span>
                  <Select value={String(calcDuration)} onValueChange={v => setCalcDuration(Number(v))}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 sec</SelectItem>
                      <SelectItem value="8">8 sec</SelectItem>
                      <SelectItem value="10">10 sec</SelectItem>
                      <SelectItem value="30">30 sec</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[120px]">
                  <span className="block text-xs font-medium mb-1">Quality</span>
                  <Select value={calcQuality} onValueChange={v => setCalcQuality(v)}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="360p">360p</SelectItem>
                      <SelectItem value="540p">540p</SelectItem>
                      <SelectItem value="720p">720p</SelectItem>
                      <SelectItem value="1080p">1080p</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-[120px]">
                  <span className="block text-xs font-medium mb-1">Motion</span>
                  <Select value={calcMotion} onValueChange={v => setCalcMotion(v)}>
                    <SelectTrigger className="w-full h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="smooth">Smooth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <div className="mt-2 text-base font-medium flex items-center gap-2">
            {calcType === 'image' ? (
              <>
                With <span className="font-bold">{calcCredits}</span> credits, you can create
                <NumberTicker value={calcResult} className="ml-2 text-primary text-xl font-bold" /> images.
              </>
            ) : (
              <>
                With <span className="font-bold">{calcCredits}</span> credits, you can create
                <NumberTicker value={calcResult} className="ml-2 text-primary text-xl font-bold" /> videos
                <span className="ml-1 text-xs text-gray-500">({calcDuration}s, {calcQuality.toUpperCase()}, {calcMotion} motion)</span>
              </>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Video credit costs vary by duration, quality, and motion. <a href="https://github.com/DarkInventor/brand-studio#content-generation-costs" target="_blank" rel="noopener noreferrer" className="underline text-primary">See full pricing table</a>.
          </div>
        </CardContent>
      </Card>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Instagram className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Pricing</h2>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">{tagline}</p>
      </div>

      <div className="mb-8 text-center">
        <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-medium text-sm">
          All plans include: {generalInclusions.join(", ")}
        </div>
        <div className="mt-2 text-xs text-gray-600 max-w-xl mx-auto">
          <strong>Unified Credit System:</strong> Use your monthly credits for either images or videos. Video generation uses more credits per post depending on quality and duration. <a href="https://github.com/DarkInventor/brand-studio#content-generation-costs" target="_blank" rel="noopener noreferrer" className="underline text-primary">See pricing table</a> for full details and examples.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`flex flex-col h-full ${plan.popular ? "border-primary shadow-lg relative" : ""}`}
          >
            {plan.popular && <Badge className="absolute -top-2 right-6 bg-primary">Most Popular</Badge>}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <div className="mt-2 text-primary font-medium">{plan.imagesPerMonth}</div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    <div className="mr-2 mt-1">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="h-5 w-5 flex items-center justify-center">
                          <div className="h-1 w-1 rounded-full bg-gray-300"></div>
                        </div>
                      )}
                    </div>
                    <span className={feature.included ? "" : "text-gray-400"}>{feature.name}</span>
                    {feature.tooltip && feature.included && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-white" : "text-black border"}`}
                onClick={() => handleCheckout(plan.stripePriceId, plan.name)}
                disabled={loading || isCurrentPlan(plan.name) || plan.name === "Business"} // Disable Business plan button as it's "Contact Sales"
              >
                {loadingPlanId === plan.name ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : plan.name === "Business" ? (
                  <a href="mailto:sales@yourdomain.com">Contact Sales</a>
                ) : (
                  getButtonText(plan)
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Image Billing Explained</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Each Instagram-ready post (image + caption) uses 1 credit from your monthly allocation.</li>
            <li>• Credits reset at the beginning of each billing cycle.</li>
            <li>• Unused credits do not roll over to the next month.</li>
          </ul>
        </div>

        <div className="text-center pt-4">
          <Button variant="link" asChild>
            <a href="mailto:support@yourdomain.com">
              Contact us for custom plans, enterprise needs, or dedicated support
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
