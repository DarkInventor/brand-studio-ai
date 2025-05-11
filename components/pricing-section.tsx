import { Check, HelpCircle, Instagram } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

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
}

export function PricingSection() {
  const tagline = "Automate and streamline your social media content creation."
  const generalInclusions = [
    "Commercial usage rights",
    "Comprehensive brand kit management",
    "Access to our powerful AI-powered post generation tools",
  ]
  const plans: PricingPlan[] = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for individuals just getting started",
      imagesPerMonth: "500 Images/month",
      features: [
        { name: "Standard image quality", included: true },
        { name: "Basic post scheduling (up to 500 active scheduled posts)", included: true, tooltip: "Schedule up to 2000 posts in advance." },
        { name: "Fundamental post management (view/edit)", included: true, tooltip: "View and edit your scheduled posts." },
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
      description: "Ideal for creators and small businesses",
      imagesPerMonth: "2,000 Images/month",
      popular: true,
      features: [
        { name: "Priority image generation", included: true, tooltip: "Faster image creation with higher priority." },
        { name: "Advanced post scheduling (up to 2000 active scheduled posts)", included: true, tooltip: "Schedule up to 500 posts in advance." },
        { name: "Comprehensive post management (view/edit/delete/regenerate captions)", included: true, tooltip: "Full control over your scheduled posts." },
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
      description: "For teams and growing businesses",
      imagesPerMonth: "5,000 Images/month",
      features: [
        { name: "Team collaboration features", included: true, tooltip: "Invite up to 10 team members." },
        { name: "Unlimited active post scheduling", included: true, tooltip: "No cap on scheduled posts." },
        { name: "API access", included: true },
        { name: "Custom templates", included: true },
        { name: "Dedicated onboarding support", included: true },
        { name: "Premium image generation priority", included: true, tooltip: "Top-tier image generation speed and quality." },
        { name: "All Pro features", included: true, tooltip: "Includes everything in the Pro plan." },
      ],
      cta: "Contact Sales",
    },
  ]

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
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
              <Button variant="outline" className={`w-full ${plan.popular ? "bg-primary hover:bg-primary/90 text-white" : "text-black border"}`}>{plan.cta}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
     

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Image Billing Explained</h3>
          <ul className="space-y-2 text-gray-600">
            <li>• Each Instagram-ready post (image + caption) uses image credits.</li>           
          </ul>
        </div>

        <div className="text-center pt-4">
          <Button variant="link" >
            Contact us for custom plans, enterprise needs, or dedicated support
          </Button>
        </div>
      </div>
    </section>
  )
}
