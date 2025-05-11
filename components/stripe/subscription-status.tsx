// "use client"

// import { useState, useEffect } from "react"
// import { CreditCard, Loader2 } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
// import { Badge } from "@/components/ui/badge"

// export function SubscriptionStatus() {
//   const [credits, setCredits] = useState<number | null>(null)
//   const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null)
//   const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const supabase = createClientComponentClient()

//   useEffect(() => {
//     async function fetchUserInfo() {
//       try {
//         setLoading(true)

//         const { data: { session }, error: sessionError } = await supabase.auth.getSession()

//         if (sessionError || !session?.user) {
//           setError("Please login to see your credits and subscription.")
//           return
//         }

//         const { data, error } = await supabase
//           .from("profiles")
//           .select("credits, subscription_plan, subscription_status")
//           .eq("id", session.user.id)
//           .single()

//         if (error) {
//           console.error("Error fetching profile:", error)
//           setError("Failed to load data.")
//           return
//         }

//         setCredits(data?.credits || 0)
//         setSubscriptionPlan(data?.subscription_plan || "Free")
//         setSubscriptionStatus(data?.subscription_status || "Inactive")
//       } catch (err) {
//         console.error("Error fetching user info:", err)
//         setError("Something went wrong.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchUserInfo()
//   }, [supabase])

//   return (
//     <Card>
//       <CardHeader className="pb-3">
//         <div className="flex justify-between items-center">
//           <CardTitle className="flex items-center">
//             <CreditCard className="mr-2 h-5 w-5" />
//             Account Info
//           </CardTitle>
//           <Badge variant={subscriptionStatus === "active" ? "default" : "outline"}>
//             {subscriptionStatus === "active" ? "Active" : subscriptionStatus}
//           </Badge>
//         </div>
//         <CardDescription>Your credit balance and subscription details</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {loading ? (
//           <div className="flex justify-center py-4">
//             <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
//           </div>
//         ) : error ? (
//           <div className="text-center text-red-500 py-2">{error}</div>
//         ) : (
//           <div className="space-y-6">
//             <div className="text-center">
//               <span className="text-4xl font-bold">{credits}</span>
//               <span className="text-gray-500 ml-2">credits remaining</span>
//               <div className="text-sm text-gray-500 mt-1">
//                 Each image generation uses 1 credit.
//               </div>
//             </div>

//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-gray-500">Current Plan</span>
//                 <span className="font-medium">{subscriptionPlan}</span>
//               </div>
//             </div>

//             {credits !== null && credits < 50 && (
//               <div className="pt-2">
//                 <Button asChild className="w-full">
//                   <Link href="/pricing">Upgrade for More Credits</Link>
//                 </Button>
//               </div>
//             )}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import { useState, useEffect } from "react"
import { CreditCard, Loader2, Calendar, AlertCircle, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SubscriptionStatus() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClientComponentClient()

  const planLimits = {
    Free: 50,
    Basic: 500,
    Pro: 2000,
    Enterprise: 5000,
  }

  const planPrices = {
    Free: 0,
    Basic: 9,
    Pro: 24,
    Enterprise: 99.99,
  }

  const fetchUserInfo = async () => {
    try {
      setLoading(true)

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        setError("Please login to see your credits and subscription.")
        return
      }

      // Fetch profile data with the correct field names
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select(
          "*, full_name, avatar_url, credits, subscription_plan, subscription_status, subscription_period_end, is_subscribed, email",
        )
        .eq("id", session.user.id)
        .single()

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        setError("Failed to load profile data.")
        return
      }

      setProfile(data)
    } catch (err) {
      console.error("Error fetching user info:", err)
      setError("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [supabase])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchUserInfo()
    setRefreshing(false)
  }

  const getStatusColor = (status: string | null) => {
    if (!status) return "outline"

    switch (status.toLowerCase()) {
      case "active":
        return "success"
      case "trialing":
        return "warning"
      case "past_due":
        return "destructive"
      case "canceled":
        return "secondary"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (e) {
      return "Invalid date"
    }
  }

  const getProgressValue = () => {
    if (!profile?.credits || !profile?.subscription_plan || !(profile.subscription_plan in planLimits)) return 0
    const limit = planLimits[profile.subscription_plan as keyof typeof planLimits]
    return Math.min(100, (profile.credits / limit) * 100)
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Account Info
          </CardTitle>
          <div className="flex items-center gap-2">
            {profile?.subscription_status && (
              <Badge variant={getStatusColor(profile.subscription_status) as any}>{profile.subscription_status}</Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="h-8 w-8"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
        <CardDescription>Your credit balance and subscription details</CardDescription>
      </CardHeader>

      {loading ? (
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Loading your subscription details...</p>
        </CardContent>
      ) : error ? (
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-2 text-destructive mb-2">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">Error Loading Data</p>
          </div>
          <p className="text-center text-sm text-muted-foreground">{error}</p>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              Try Again
            </Button>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="space-y-6">
            {/* User Profile Section */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || "User"} />
                <AvatarFallback>{getInitials(profile?.full_name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{profile?.full_name || "User"}</h3>
                <p className="text-sm text-muted-foreground">{profile?.email}</p>
              </div>
            </div>

            <Separator />

            {/* Credits Section */}
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{profile?.credits || 0}</span>
              <span className="text-gray-500 ml-2">credits remaining</span>

              <div className="mt-4">
                <Progress value={getProgressValue()} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  <span>0</span>
                  <span>
                    {profile?.subscription_plan && profile.subscription_plan in planLimits
                      ? planLimits[profile.subscription_plan as keyof typeof planLimits]
                      : "N/A"}{" "}
                    credits
                  </span>
                </div>
              </div>

              <div className="text-sm text-muted-foreground mt-2">Each image generation uses 1 credit.</div>
            </div>

            <Separator />

            {/* Subscription Details */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Subscription Status</span>
                <Badge variant={profile?.is_subscribed ? "success" : "outline"}>
                  {profile?.is_subscribed ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm">Current Plan</span>
                <span className="font-medium">{profile?.subscription_plan || "Free"}</span>
              </div>

              {profile?.subscription_plan && profile.subscription_plan in planPrices && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Monthly Price</span>
                  <span className="font-medium">
                    ${planPrices[profile.subscription_plan as keyof typeof planPrices]}
                  </span>
                </div>
              )}

              {profile?.subscription_period_end && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Next Billing Date</span>
                  </div>
                  <span className="font-medium">{formatDate(profile.subscription_period_end)}</span>
                </div>
              )}

              {profile?.stripe_customer_id && (
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer ID</span>
                  <span className="font-medium text-xs text-muted-foreground">
                    {profile.stripe_customer_id.substring(0, 8)}...
                  </span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-3">
            {profile?.credits !== null && profile?.credits < 50 && (
              <Button asChild className="w-full">
                <Link href="/pricing">Upgrade for More Credits</Link>
              </Button>
            )}

            {/* <Button variant="outline" asChild className="w-full">
              <Link href="/account/billing">Manage Subscription</Link>
            </Button> */}
          </CardFooter>
        </>
      )}
    </Card>
  )
}
