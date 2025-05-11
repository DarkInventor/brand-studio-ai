"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface ManageSubscriptionProps {
  userId: string
}

export function ManageSubscription({ userId }: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/subscription?userId=${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch subscription")
        }

        const data = await response.json()
        setSubscription(data.subscription)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [userId])

  const handleCreatePortalSession = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create portal session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center items-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-red-500 text-center">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You don't have an active subscription yet.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Subscribe to one of our plans to access premium features.</p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <a href="/pricing">View Plans</a>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Subscription</CardTitle>
          <Badge variant={subscription.status === "active" ? "default" : "outline"}>
            {subscription.status === "active" ? "Active" : subscription.status}
          </Badge>
        </div>
        <CardDescription>Manage your subscription and billing information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Plan</h3>
            <p>{subscription.plan.name}</p>
          </div>
          <div>
            <h3 className="font-medium">Billing Period</h3>
            <p>{subscription.interval === "month" ? "Monthly" : "Yearly"}</p>
          </div>
          <div>
            <h3 className="font-medium">Next Billing Date</h3>
            <p>{new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCreatePortalSession}>Manage Billing</Button>
      </CardFooter>
    </Card>
  )
}
