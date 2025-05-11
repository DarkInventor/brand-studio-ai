"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import type { PricingPlan } from "@/types/database"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutButtonProps {
  priceId: string
  buttonText?: string
  className?: string
  plan?: Partial<PricingPlan>
}

export function CheckoutButton({ priceId, buttonText = "Subscribe Now", className, plan }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCheckout = async () => {
    try {
      setLoading(true)

      // Create a checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: priceId,
          planName: plan?.name,
          planInterval: plan?.interval,
        }),
      })

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      if (url) {
        router.push(url)
      } else {
        throw new Error("Failed to create checkout session")
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className}>
      {loading ? "Loading..." : buttonText}
    </Button>
  )
}
