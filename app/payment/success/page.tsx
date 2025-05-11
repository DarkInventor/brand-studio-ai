"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        setLoading(true)

        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/login")
          return
        }

        // Get user profile with subscription info
        const { data: profile } = await supabase
          .from("profiles")
          .select("subscription_plan, subscription_status, credits")
          .eq("id", user.id)
          .single()

        setSubscription(profile)
      } catch (err) {
        console.error("Error fetching subscription:", err)
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchSubscriptionDetails()
    }
  }, [sessionId, router])

  return (
    <div className="container mx-auto py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Thank you for your subscription to Brand Studio AI.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-center">
                Your subscription to the <span className="font-semibold">{subscription?.subscription_plan}</span> plan
                is now active.
              </p>
              {typeof subscription?.credits !== 'undefined' && (
                <p className="text-center">
                  <span className="font-semibold">{subscription.credits}</span> credits have been added to your account.
                </p>
              )}
              <p className="text-center">
                Status:{" "}
                <span className="font-semibold capitalize">{subscription?.subscription_status || "Active"}</span>
              </p>
              <p className="text-center text-sm text-gray-500">A receipt has been sent to your email address.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Link href="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Link href="/account">
            <Button variant="outline">Manage Subscription</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
