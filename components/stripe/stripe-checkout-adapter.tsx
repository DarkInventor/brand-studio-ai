"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutAdapterProps {
  priceId: string
  userId: string
  children: React.ReactNode
  className?: string
}

export function StripeCheckoutAdapter({ priceId, userId, children, className }: StripeCheckoutAdapterProps) {
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
          userId,
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
    <div onClick={handleCheckout} className={`cursor-pointer ${className}`}>
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        children
      )}
    </div>
  )
}
