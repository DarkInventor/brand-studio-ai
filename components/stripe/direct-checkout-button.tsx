"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { loadStripe } from "@stripe/stripe-js"
import { Loader2 } from "lucide-react"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface DirectCheckoutButtonProps {
  priceId: string
  buttonText?: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function DirectCheckoutButton({
  priceId,
  buttonText = "Subscribe Now",
  className,
  variant = "default",
}: DirectCheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    try {
      setLoading(true)

      // Load Stripe
      const stripe = await stripePromise
      if (!stripe) throw new Error("Stripe failed to load")

      // Create checkout session directly with Stripe.js
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
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
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={loading} className={className} variant={variant}>
      {loading ? (
        <div className="flex items-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : (
        buttonText
      )}
    </Button>
  )
}
