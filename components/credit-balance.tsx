"use client"

import { useState, useEffect } from "react"
import { CreditCard, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export function CreditBalance() {
  const [credits, setCredits] = useState<number | null>(null)
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchUserInfo() {
      try {
        setLoading(true)

        const { data: { session }, error: sessionError } = await supabase.auth.getSession()

        if (sessionError || !session?.user) {
          setError("Please login to see your credits and subscription.")
          return
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("credits, subscription_plan, subscription_status")
          .eq("id", session.user.id)
          .single()

        if (error) {
          console.error("Error fetching profile:", error)
          setError("Failed to load data.")
          return
        }

        setCredits(data?.credits || 0)
        setSubscriptionPlan(data?.subscription_plan || "Free")
        setSubscriptionStatus(data?.subscription_status || "Inactive")
      } catch (err) {
        console.error("Error fetching user info:", err)
        setError("Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [supabase])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Account Info
        </CardTitle>
        <CardDescription>Your credit balance and subscription details</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-2">{error}</div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-4xl font-bold">{credits}</span>
              <span className="text-gray-500 ml-2">credits remaining</span>
              <div className="text-sm text-gray-500 mt-1">
                Each image generation uses 1 credit.
              </div>
            </div>

           

            {credits !== null && credits < 50 && (
              <div className="pt-2">
                <Button asChild className="w-full">
                  <Link href="/pricing">Upgrade for More Credits</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
