"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CreditCard, Calendar, CheckCircle, XCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function CheckCreditsPage() {
  const [userId, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loadingCurrentUser, setLoadingCurrentUser] = useState(true)

  // Fetch current user on page load
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          setCurrentUser(user)
          setUserId(user.id)
          // Automatically fetch the current user's credits
          fetchUserCredits(user.id)
        }
      } catch (err) {
        console.error("Error fetching current user:", err)
      } finally {
        setLoadingCurrentUser(false)
      }
    }

    fetchCurrentUser()
  }, [])

  const fetchUserCredits = async (id: string) => {
    setLoading(true)
    setError(null)
    setUserData(null)

    try {
      const response = await fetch(`/api/get-credits?userId=${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user credits")
      }

      setUserData(data.data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userId) {
      fetchUserCredits(userId)
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Check Credit Balance</CardTitle>
          <CardDescription>View a user's credit balance and subscription information.</CardDescription>
        </CardHeader>
        <CardContent>
          {loadingCurrentUser ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <>
              {currentUser ? (
                <div className="mb-4 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-600">
                    Logged in as: <span className="font-medium">{currentUser.email}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">User ID: {currentUser.id}</p>
                </div>
              ) : (
                <p className="mb-4 text-yellow-600">Not logged in. Enter a user ID manually.</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
                    </>
                  ) : (
                    "Check Credits"
                  )}
                </Button>
              </form>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          {error && <div className="text-red-500 mt-2">{error}</div>}
          {userData && (
            <div className="mt-4 w-full space-y-4">
              <h3 className="font-medium text-green-600">User Information</h3>

              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <p className="font-medium">Credit Balance</p>
                  <p className="text-2xl font-bold">{userData.credits || 0}</p>
                </div>
              </div>

              <div className="flex items-center">
                {userData.is_subscribed ? (
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 mr-2 text-red-500" />
                )}
                <div>
                  <p className="font-medium">Subscription Status</p>
                  <p>{userData.is_subscribed ? "Active" : "Inactive"}</p>
                  {userData.subscription_plan && (
                    <p className="text-sm text-gray-600">Plan: {userData.subscription_plan}</p>
                  )}
                  {userData.subscription_status && (
                    <p className="text-sm text-gray-600">Status: {userData.subscription_status}</p>
                  )}
                </div>
              </div>

              {userData.subscription_period_end && (
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  <div>
                    <p className="font-medium">Subscription Renewal</p>
                    <p>{formatDate(userData.subscription_period_end)}</p>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <p className="text-sm text-gray-500">User ID: {userData.id}</p>
                <p className="text-sm text-gray-500">Email: {userData.email}</p>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
