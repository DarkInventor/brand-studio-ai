"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckoutButton } from "./checkout-button"
import { Check } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  interval: "month" | "year"
  features: string[]
  priceId: string
  popular?: boolean
}

interface PricingPlansProps {
  userId: string
}

export function PricingPlans({ userId }: PricingPlansProps) {
  const [billingInterval, setBillingInterval] = useState<"month" | "year">("month")

  // Replace these with your actual Stripe price IDs
  const plans: PricingPlan[] = [
    {
      id: "basic",
      name: "Basic",
      description: "Essential tools for small brands",
      price: 9.99,
      interval: "month",
      features: ["Generate up to 50 brand assets", "Basic templates", "Email support"],
      priceId: "price_1234", // Replace with your Stripe price ID
    },
    {
      id: "pro",
      name: "Professional",
      description: "Everything you need for growing brands",
      price: 29.99,
      interval: "month",
      features: ["Generate up to 200 brand assets", "Advanced templates", "Priority support", "Custom brand voice"],
      priceId: "price_5678", // Replace with your Stripe price ID
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "Advanced features for established brands",
      price: 99.99,
      interval: "month",
      features: ["Unlimited brand assets", "All templates", "Dedicated support", "Custom brand voice", "API access"],
      priceId: "price_9012", // Replace with your Stripe price ID
    },
  ]

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Select the perfect plan for your brand's needs. All plans include access to our AI-powered brand studio.
        </p>

        <div className="flex justify-center mt-6">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setBillingInterval("month")}
              className={`px-4 py-2 rounded-md ${billingInterval === "month" ? "bg-white shadow-sm" : ""}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("year")}
              className={`px-4 py-2 rounded-md ${billingInterval === "year" ? "bg-white shadow-sm" : ""}`}
            >
              Yearly <span className="text-green-500 text-sm">Save 20%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.popular ? "border-blue-500 shadow-lg" : ""}`}>
            {plan.popular && (
              <div className="bg-blue-500 text-white text-center py-1 text-sm font-medium">Most Popular</div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/{billingInterval}</span>
              </div>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <CheckoutButton
                priceId={plan.priceId}
                userId={userId}
                buttonText={`Subscribe to ${plan.name}`}
                className="w-full"
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
