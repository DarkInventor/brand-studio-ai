"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import type { Profile } from "@/types/database"

export function SubscriptionStatus() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          throw new Error("Not authenticated")
        }

        // Get user profile with subscription info
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        setProfile(data)
      } catch (err) {
        console.error("Error fetching profile:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleManageBilling = async () => {
    try {
      setLoading(true)

      // Create a portal session
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error("Failed to create portal session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (err) {
      console.error("Error creating portal session:", err)
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

  if (!profile) {
    return (
      <Card>
        <CardContent className="py-6">
          <p className="text-center">Please sign in to view your subscription.</p>
        </CardContent>
      </Card>
    )
  }

  if (!profile.is_subscribed) {
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
          <Badge variant={profile.subscription_status === "active" ? "default" : "outline"}>
            {profile.subscription_status === "active" ? "Active" : profile.subscription_status}
          </Badge>
        </div>
        <CardDescription>Manage your subscription and billing information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profile.subscription_plan && (
            <div>
              <h3 className="font-medium">Plan</h3>
              <p>{profile.subscription_plan}</p>
            </div>
          )}
          {profile.subscription_period_end && (
            <div>
              <h3 className="font-medium">Next Billing Date</h3>
              <p>{new Date(profile.subscription_period_end).toLocaleDateString()}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium">Email</h3>
            <p>{profile.email}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleManageBilling}>Manage Billing</Button>
      </CardFooter>
    </Card>
  )
}
